import { createTheme } from '@mui/material/styles';

/**
 * Custom MUI theme for Pict'Oh.
 *
 * Design principles:
 * - French-first font stack with good readability on tablets
 * - Large touch targets (minimum 44 × 44 px)
 * - High-contrast colour palette for readability
 * - Subtle shadows for cards/squares
 */
const theme = createTheme({
  // ── Typography ────────────────────────────────────────────────────────────
  typography: {
    /**
     * French-friendly font stack:
     * 1. Segoe UI — excellent readability on Windows tablets
     * 2. Roboto   — MUI default, great on Android tablets
     * 3. system-ui — OS-default font (iOS/iPadOS uses SF Pro)
     * 4. sans-serif fallback
     *
     * All sizes are increased compared to MUI defaults to ensure
     * comfortable reading on tablet screens at arm's length.
     */
    fontFamily: [
      'Segoe UI',
      'Roboto',
      'system-ui',
      '-apple-system',
      'sans-serif',
    ].join(','),
    // Base font size bumped to 16 px for tablet readability
    fontSize: 16,
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.9375rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'none',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
  },

  // ── Colour palette ────────────────────────────────────────────────────────
  palette: {
    primary: {
      main: '#1565C0', // Deep blue — visible, calm, accessible
      light: '#5E92F3',
      dark: '#003C8F',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F57C00', // Warm orange — friendly, stands out against blue
      light: '#FFAD42',
      dark: '#BB4D00',
      contrastText: '#ffffff',
    },
    error: {
      main: '#C62828', // Red used for edit-mode borders
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },

  // ── Shape ─────────────────────────────────────────────────────────────────
  shape: {
    borderRadius: 8,
  },

  // ── Shadows ───────────────────────────────────────────────────────────────
  // Custom shadow scale — subtle but visible on tablet screens.
  // MUI expects an array of exactly 25 shadow strings (indices 0-24).
  shadows: [
    'none', // 0
    '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)', // 1 – card resting
    '0 2px 6px rgba(0,0,0,0.14), 0 2px 4px rgba(0,0,0,0.10)', // 2 – card hover
    '0 4px 10px rgba(0,0,0,0.14), 0 3px 6px rgba(0,0,0,0.10)', // 3
    '0 4px 12px rgba(0,0,0,0.16), 0 4px 8px rgba(0,0,0,0.10)', // 4
    '0 6px 16px rgba(0,0,0,0.16), 0 4px 8px rgba(0,0,0,0.10)', // 5
    '0 6px 20px rgba(0,0,0,0.18), 0 5px 10px rgba(0,0,0,0.12)', // 6
    '0 8px 24px rgba(0,0,0,0.18), 0 6px 12px rgba(0,0,0,0.12)', // 7
    '0 8px 28px rgba(0,0,0,0.20), 0 7px 14px rgba(0,0,0,0.14)', // 8
    '0 10px 32px rgba(0,0,0,0.20), 0 8px 16px rgba(0,0,0,0.14)', // 9
    '0 10px 36px rgba(0,0,0,0.22)', // 10
    '0 12px 40px rgba(0,0,0,0.22)', // 11
    '0 12px 44px rgba(0,0,0,0.24)', // 12
    '0 14px 48px rgba(0,0,0,0.24)', // 13
    '0 14px 52px rgba(0,0,0,0.26)', // 14
    '0 16px 56px rgba(0,0,0,0.26)', // 15
    '0 16px 60px rgba(0,0,0,0.28)', // 16
    '0 18px 64px rgba(0,0,0,0.28)', // 17
    '0 18px 68px rgba(0,0,0,0.30)', // 18
    '0 20px 72px rgba(0,0,0,0.30)', // 19
    '0 20px 76px rgba(0,0,0,0.32)', // 20
    '0 22px 80px rgba(0,0,0,0.32)', // 21
    '0 22px 84px rgba(0,0,0,0.34)', // 22
    '0 24px 88px rgba(0,0,0,0.34)', // 23
    '0 24px 92px rgba(0,0,0,0.36)', // 24
  ],

  // ── Component overrides ───────────────────────────────────────────────────
  components: {
    // Ensure all buttons meet the 44 × 44 px minimum touch target
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,
        },
      },
    },
    // Card shadow for the square grid cells
    MuiCard: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    // Paper (dialogs, drawers…) — use rounded corners
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    // Dialog — ensure large, readable text on tablets
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.125rem',
          fontWeight: 600,
        },
      },
    },
    // TextField — taller for easier touch interaction
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
      },
    },
  },
});

export default theme;
