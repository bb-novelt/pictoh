import { Box, Typography } from '@mui/material';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * Top-level layout wrapper for Pict'Oh.
 *
 * - Fills the full viewport in landscape orientation.
 * - Displays a "please rotate" overlay when the device is in portrait mode
 *   so the app is never used in portrait orientation.
 * - Sets the global minimum touch-target size (44 × 44 px) via CSS custom
 *   property used by descendant interactive elements.
 */
export function Layout({ children }: Props) {
  return (
    <Box
      sx={{
        width: '100dvw',
        height: '100dvh',
        overflow: 'hidden',
        // Minimum touch target size required for usability on tablets
        '--min-touch-target': '44px',
        '& button, & [role="button"]': {
          minWidth: 'var(--min-touch-target)',
          minHeight: 'var(--min-touch-target)',
        },
      }}
    >
      {/* Portrait-mode overlay: shown only when orientation is portrait */}
      <Box
        sx={{
          display: 'none',
          '@media (orientation: portrait)': {
            display: 'flex',
          },
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          backgroundColor: 'background.default',
        }}
      >
        <ScreenRotationIcon sx={{ fontSize: 80, color: 'primary.main' }} />
        <Typography variant="h5" align="center">
          Veuillez tourner votre tablette en mode paysage
        </Typography>
      </Box>

      {/* App content — only meaningfully visible in landscape */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          '@media (orientation: portrait)': {
            visibility: 'hidden',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
