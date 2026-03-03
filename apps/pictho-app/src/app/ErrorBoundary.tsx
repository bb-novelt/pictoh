import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Top-level error boundary that catches unhandled React errors and displays
 * a friendly French fallback UI instead of a blank screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[Pict'Oh] Erreur inattendue :", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: 3,
            px: 4,
          }}
        >
          <Typography variant="h5">Une erreur est survenue</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            L&apos;application a rencontré un problème inattendu.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Recharger l&apos;application
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
