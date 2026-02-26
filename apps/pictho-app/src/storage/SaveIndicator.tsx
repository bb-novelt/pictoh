import { useEffect, useState } from 'react';
import { Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { onSave } from './autoSave';

/** How long (ms) the indicator stays visible after a save. */
const VISIBLE_DURATION_MS = 1500;

/**
 * Discrete save indicator displayed in the bottom-left corner.
 * Briefly shows "Sauvegardé" with a checkmark after each auto-save,
 * then fades out automatically.
 */
export function SaveIndicator() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const unsubscribe = onSave(() => {
      setVisible(true);
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        setVisible(false);
        timeout = null;
      }, VISIBLE_DURATION_MS);
    });

    return () => {
      unsubscribe();
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Chip
      icon={<CheckIcon />}
      label="Sauvegardé"
      size="small"
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
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
