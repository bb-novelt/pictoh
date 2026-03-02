import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './app/app';
import theme from './shared/theme';
import * as serviceWorkerRegistration from './offline/serviceWorkerRegistration';
import { rehydrateStore } from './storage/rehydrateStore';

// Restore persisted state before the first render
rehydrateStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);

// Register service worker for offline support
serviceWorkerRegistration.register({
  onSuccess: () => {
    // Service worker registered successfully - app is ready for offline use
  },
  onUpdate: () => {
    // New service worker update available
  },
  onOfflineReady: () => {
    // App is ready to work offline
  },
});
