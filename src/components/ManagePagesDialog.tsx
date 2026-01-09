import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
} from '@mui/material';
import { Edit, Delete, OpenInNew } from '@mui/icons-material';
import { useSnapshot } from 'valtio';
import { appState, actions } from '../state/appState';

interface ManagePagesDialogProps {
  open: boolean;
  onClose: () => void;
}

const ManagePagesDialog: React.FC<ManagePagesDialogProps> = ({ open, onClose }) => {
  const snap = useSnapshot(appState);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleRename = (oldName: string) => {
    setEditingPage(oldName);
    setNewName(oldName);
  };

  const handleSaveRename = (oldName: string) => {
    if (newName.trim() && newName !== oldName) {
      actions.renamePage(oldName, newName.trim());
    }
    setEditingPage(null);
    setNewName('');
  };

  const handleDelete = (pageName: string) => {
    if (snap.pages.length > 1) {
      if (window.confirm(`Voulez-vous vraiment supprimer la page "${pageName}" ?`)) {
        actions.deletePage(pageName);
      }
    } else {
      alert('Vous ne pouvez pas supprimer la dernière page.');
    }
  };

  const handleOpenPage = (pageName: string) => {
    actions.setCurrentPage(pageName);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: '1.5rem' }}>Gérer les pages</DialogTitle>
      <DialogContent>
        <List>
          {snap.pages.map((page) => (
            <ListItem
              key={page.pageName}
              secondaryAction={
                <div style={{ display: 'flex', gap: '8px' }}>
                  <IconButton
                    edge="end"
                    onClick={() => handleOpenPage(page.pageName)}
                    sx={{ fontSize: '1.5rem' }}
                  >
                    <OpenInNew />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleRename(page.pageName)}
                    sx={{ fontSize: '1.5rem' }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(page.pageName)}
                    disabled={snap.pages.length === 1}
                    sx={{ fontSize: '1.5rem' }}
                  >
                    <Delete />
                  </IconButton>
                </div>
              }
            >
              {editingPage === page.pageName ? (
                <TextField
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => handleSaveRename(page.pageName)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveRename(page.pageName);
                    }
                  }}
                  autoFocus
                  fullWidth
                  sx={{ fontSize: '1.2rem' }}
                />
              ) : (
                <ListItemText
                  primary={page.pageName}
                  secondary={
                    page.pageName === snap.currentPageName ? 'Page actuelle' : ''
                  }
                  primaryTypographyProps={{ fontSize: '1.2rem' }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ fontSize: '1.1rem' }}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManagePagesDialog;
