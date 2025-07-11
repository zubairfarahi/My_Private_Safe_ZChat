import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  Delete,
  Download,
  CheckCircle,
  Error,
  Description,
  Image,
  Movie,
  AudioFile
} from '@mui/icons-material';

const FileUploadPage = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image />;
    if (fileType.startsWith('video/')) return <Movie />;
    if (fileType.startsWith('audio/')) return <AudioFile />;
    return <Description />;
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newFiles = selectedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      uploadProgress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
    setSuccess('');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const newFiles = droppedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      uploadProgress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
    setSuccess('');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate file upload process
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update progress
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'uploading', uploadProgress: 0 }
              : f
          )
        );

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, uploadProgress: progress }
                : f
            )
          );
        }

        // Mark as completed
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'completed', uploadProgress: 100 }
              : f
          )
        );
      }

      setSuccess(`${files.length} file(s) uploaded successfully!`);
    } catch (error) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const pendingFiles = files.filter(file => file.status === 'pending');
  const uploadingFiles = files.filter(file => file.status === 'uploading');
  const completedFiles = files.filter(file => file.status === 'completed');

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        File Upload
      </Typography>

      {/* Error and Success Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Upload Area */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          border: '2px dashed',
          borderColor: 'primary.main',
          backgroundColor: 'background.default',
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'action.hover'
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUpload sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drop files here or click to browse
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Support for multiple file types (PDF, images, documents, etc.)
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={uploadFiles}
          disabled={pendingFiles.length === 0 || uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
        >
          {uploading ? 'Uploading...' : `Upload ${pendingFiles.length} File(s)`}
        </Button>
        <Button
          variant="outlined"
          onClick={() => setFiles([])}
          disabled={files.length === 0}
        >
          Clear All
        </Button>
      </Box>

      {/* File Lists */}
      <Grid container spacing={2} sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* Pending Files */}
        {pendingFiles.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom>
                Pending Files ({pendingFiles.length})
              </Typography>
              <List dense>
                {pendingFiles.map((file) => (
                  <ListItem key={file.id}>
                    <ListItemIcon>
                      {getFileIcon(file.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={getFileSize(file.size)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => removeFile(file.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Uploading Files */}
        {uploadingFiles.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom>
                Uploading Files ({uploadingFiles.length})
              </Typography>
              <List dense>
                {uploadingFiles.map((file) => (
                  <ListItem key={file.id}>
                    <ListItemIcon>
                      <CircularProgress size={20} variant="determinate" value={file.uploadProgress} />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${file.uploadProgress}%`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Completed Files */}
        {completedFiles.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom>
                Completed Files ({completedFiles.length})
              </Typography>
              <List dense>
                {completedFiles.map((file) => (
                  <ListItem key={file.id}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={getFileSize(file.size)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="primary">
                        <Download />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FileUploadPage; 