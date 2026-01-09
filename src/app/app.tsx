import { useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Grid from '../components/Grid';
import { appState } from '../state/appState';
import { initializePictures } from '../utils/pictureLoader';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontSize: 16,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export function App() {
  useEffect(() => {
    // Initialize pictures if not already loaded
    if (appState.pictures.length === 0) {
      const pictures = initializePictures(appState.pictures);
      appState.pictures = pictures;
    }

    // Force portrait orientation
    const lockOrientation = () => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('portrait').catch((err) => {
          console.warn('Orientation lock not supported:', err);
        });
      }
    };

    lockOrientation();

    // Load voices for TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Grid />
      </Box>
    </ThemeProvider>
  );
}

export default App;
