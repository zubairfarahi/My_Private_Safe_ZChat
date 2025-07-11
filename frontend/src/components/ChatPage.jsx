import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Settings
} from '@mui/icons-material';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [developerMessage, setDeveloperMessage] = useState('You are a helpful AI assistant.');
  const [model, setModel] = useState('gpt-4.1-mini');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);
    setError('');

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      const apiKey = localStorage.getItem('apiKey');
      if (!apiKey) {
        throw new Error('API key not found. Please login again.');
      }

      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage,
          model: model,
          api_key: apiKey
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      // Add AI message placeholder
      const aiMessageId = Date.now() + 1;
      const newAiMessage = {
        id: aiMessageId,
        text: '',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, newAiMessage]);

      // Stream the response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        aiResponse += chunk;

        // Update the AI message with streaming content
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, text: aiResponse }
              : msg
          )
        );
      }

    } catch (error) {
      setError(error.message);
      // Remove the AI message if there was an error
      setMessages(prev => prev.filter(msg => msg.id !== Date.now() + 1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          AI Chat
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Model</InputLabel>
            <Select
              value={model}
              label="Model"
              onChange={(e) => setModel(e.target.value)}
            >
              <MenuItem value="gpt-4.1-mini">GPT-4.1 Mini</MenuItem>
              <MenuItem value="gpt-4.1">GPT-4.1</MenuItem>
              <MenuItem value="gpt-4o-mini">GPT-4o Mini</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            size="small"
            onClick={clearChat}
            disabled={messages.length === 0}
          >
            Clear Chat
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Messages */}
      <Paper 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2, 
          mb: 2,
          backgroundColor: 'background.default'
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary'
          }}>
            <SmartToy sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              Start a conversation
            </Typography>
            <Typography variant="body2" align="center">
              Ask me anything! I'm here to help with your AI engineering questions.
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message, index) => (
              <React.Fragment key={message.id}>
                <ListItem sx={{ 
                  flexDirection: 'column', 
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  px: 0
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    maxWidth: '70%',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                  }}>
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar sx={{ 
                        bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                        width: 32,
                        height: 32
                      }}>
                        {message.sender === 'user' ? <Person /> : <SmartToy />}
                      </Avatar>
                    </ListItemAvatar>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        backgroundColor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                        color: message.sender === 'user' ? 'white' : 'text.primary',
                        maxWidth: '100%'
                      }}
                    >
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {message.text}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                        {message.timestamp}
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
                {index < messages.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
            {loading && (
              <ListItem sx={{ justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Paper>

      {/* Input Area */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={loading}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || loading}
          sx={{ minWidth: 56, height: 56 }}
        >
          <Send />
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPage; 