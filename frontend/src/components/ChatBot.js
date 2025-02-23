import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import api from '../services/api';

const ChatBot = () => {
  const [messages, setMessages] = useState([{
    text: "Hello! I'm your AI Medical Assistant. How can I help you today?",
    sender: 'bot'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    
    setLoading(true);
    try {
      const response = await api.sendMessage(userMessage);
      const botResponse = response?.output?.answer || response?.answer || response?.response || 'I apologize, but I am unable to process your request at the moment.';
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setMessages(prev => [...prev, { 
        text: 'I apologize, but I encountered an error while processing your request. Please try again.',
        sender: 'bot',
        isError: true
      }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      {/* Chat Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'primary.light',
        color: 'white'
      }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon /> Chat with AI Medical Assistant
        </Typography>
      </Box>

      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        p: 2,
        bgcolor: 'background.default'
      }}>
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1,
                alignItems: 'flex-start'
              }}
            >
              {message.sender === 'bot' && (
                <SmartToyIcon 
                  sx={{ 
                    mr: 1, 
                    mt: 1,
                    color: 'primary.main',
                    bgcolor: 'background.paper',
                    p: 0.5,
                    borderRadius: '50%',
                    boxShadow: theme.shadows[1]
                  }} 
                />
              )}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  ...(message.isError && {
                    bgcolor: 'error.light',
                    color: 'white'
                  })
                }}
              >
                <ListItemText 
                  primary={message.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      whiteSpace: 'pre-wrap'
                    }
                  }}
                />
              </Paper>
              {message.sender === 'user' && (
                <PersonIcon 
                  sx={{ 
                    ml: 1, 
                    mt: 1,
                    color: 'primary.main',
                    bgcolor: 'background.paper',
                    p: 0.5,
                    borderRadius: '50%',
                    boxShadow: theme.shadows[1]
                  }} 
                />
              )}
            </ListItem>
          ))}
          {loading && (
            <ListItem sx={{ justifyContent: 'flex-start' }}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CircularProgress size={20} />
                <Typography variant="body2">Thinking...</Typography>
              </Paper>
            </ListItem>
          )}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              }
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatBot;
