import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import * as serviceWorkerRegistration from './offline/serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
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
