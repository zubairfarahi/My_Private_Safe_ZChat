import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  Upload as UploadIcon,
  Person as PersonIcon,
  TrendingUp,
  Schedule,
  CheckCircle
} from '@mui/icons-material';

const DashboardPage = () => {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState({
    totalChats: 0,
    totalUploads: 0,
    lastActivity: 'Never'
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const quickActions = [
    {
      title: 'Start New Chat',
      description: 'Begin a conversation with AI',
      icon: <ChatIcon color="primary" />,
      path: '/chat'
    },
    {
      title: 'Upload Files',
      description: 'Upload documents for processing',
      icon: <UploadIcon color="primary" />,
      path: '/upload'
    }
  ];

  const recentActivity = [
    {
      action: 'Chat session started',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      action: 'File uploaded',
      time: '1 day ago',
      status: 'completed'
    },
    {
      action: 'API key updated',
      time: '3 days ago',
      status: 'completed'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Welcome back, {username || 'User'}!
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <ChatIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Chats
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalChats}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <UploadIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Files Uploaded
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalUploads}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    API Status
                  </Typography>
                  <Chip label="Connected" color="success" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Last Activity
                  </Typography>
                  <Typography variant="body2">
                    {stats.lastActivity}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              {quickActions.map((action, index) => (
                <React.Fragment key={action.title}>
                  <ListItem button>
                    <ListItemIcon>
                      {action.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={action.title}
                      secondary={action.description}
                    />
                  </ListItem>
                  {index < quickActions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={activity.time}
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage; 