import { Chip } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

/**
 * Subtle offline indicator displayed in the bottom-right corner.
 * Only visible when the device has no network connection.
 * The app is fully functional offline after the first launch.
 */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <Chip
      icon={<WifiOffIcon />}
      label="Hors ligne"
      size="small"
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1300,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        '& .MuiChip-icon': {
          color: 'white',
        },
      }}
    />
  );
}
