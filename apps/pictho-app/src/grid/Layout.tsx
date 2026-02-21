import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * Top-level layout wrapper for Pict'Oh.
 *
 * - Fills the full viewport in landscape orientation.
 * - In portrait mode the content is rotated 90° clockwise so it always
 *   renders as landscape — no "please rotate" message is shown.
 * - Sets the global minimum touch-target size (44 × 44 px) via CSS custom
 *   property used by descendant interactive elements.
 *
 * Portrait → landscape rotation maths:
 *   Portrait viewport: W (short) × H (tall)
 *   Inner box sized H × W (landscape proportions), positioned at top=100vh so
 *   its top-left corner sits at the bottom-left of the viewport.
 *   A 90° CW rotation around that corner swings the box into view:
 *     top-right corner → (0, 0)  (screen top-left)
 *     bottom-right corner → (W, 0)  (screen top-right)
 *   Result: content fills the full portrait viewport in landscape orientation.
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
      {/*
       * Content wrapper.
       * In landscape: fills parent normally (100% × 100%).
       * In portrait: fixed-positioned, rotated 90° CW so the app displays
       *   in landscape without any "please rotate" message.
       * position:fixed is used so the transform is not clipped by the parent's
       *   overflow:hidden.
       */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          '@media (orientation: portrait)': {
            position: 'fixed',
            top: '100vh',
            left: 0,
            width: '100vh',
            height: '100vw',
            transformOrigin: 'left top',
            transform: 'rotate(90deg)',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
