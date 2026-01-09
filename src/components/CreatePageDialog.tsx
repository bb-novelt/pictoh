import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { actions } from '../state/appState';

interface CreatePageDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreatePageDialog: React.FC<CreatePageDialogProps> = ({ open, onClose }) => {
  const [pageName, setPageName] = useState('');

  const handleCreate = () => {
    if (pageName.trim()) {
      actions.createPage(pageName.trim());
      setPageName('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: '1.5rem' }}>Créer une nouvelle page</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nom de la page"
          fullWidth
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ fontSize: '1.2rem' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ fontSize: '1.1rem' }}>
          Annuler
        </Button>
        <Button onClick={handleCreate} variant="contained" sx={{ fontSize: '1.1rem' }}>
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePageDialog;
