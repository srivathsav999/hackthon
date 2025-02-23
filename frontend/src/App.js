import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Typography, Container, CssBaseline, useMediaQuery } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ChatBot from './components/ChatBot';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#00acc1',
      light: '#26c6da',
      dark: '#00838f',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        flexGrow: 1,
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <LocalHospitalIcon 
              sx={{ 
                mr: 2, 
                color: 'primary.main',
                fontSize: 28
              }} 
            />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                color: 'text.primary',
                fontWeight: 600
              }}
            >
              AI Medical Assistant
            </Typography>
          </Toolbar>
        </AppBar>
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: isMobile ? 2 : 4,
            mb: isMobile ? 2 : 4,
            height: `calc(100vh - ${isMobile ? '80px' : '100px'})`,
          }}
        >
          <ChatBot />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
