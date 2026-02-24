import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useSnapshot } from 'valtio';
import { store } from '../state/store';
import { createPage } from '../state/actions/pageActions';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Dialog for creating a new page.
 *
 * - Validates that the name is non-empty and unique across existing pages.
 * - On confirmation, creates the page and navigates to it immediately.
 */
export function CreatePageDialog({ open, onClose }: Props) {
  const snap = useSnapshot(store);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleClose() {
    setName('');
    setError('');
    onClose();
  }

  function handleSubmit() {
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Le nom de la page ne peut pas être vide.');
      return;
    }

    const nameExists = snap.pages.some(
      (page) => page.pageName.toLowerCase() === trimmed.toLowerCase()
    );
    if (nameExists) {
      setError('Une page avec ce nom existe déjà.');
      return;
    }

    createPage(trimmed, true);
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Créer une nouvelle page</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Nom de la page"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          error={!!error}
          helperText={error}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
