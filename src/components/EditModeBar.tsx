import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Add, Settings, Close } from '@mui/icons-material';
import { actions } from '../state/appState';
import CreatePageDialog from './CreatePageDialog';
import ManagePagesDialog from './ManagePagesDialog';

const EditModeBar: React.FC = () => {
  const [createPageOpen, setCreatePageOpen] = useState(false);
  const [managePagesOpen, setManagePagesOpen] = useState(false);

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <Button
              color="inherit"
              startIcon={<Add />}
              onClick={() => setCreatePageOpen(true)}
              sx={{ fontSize: '1.1rem' }}
            >
              Créer une page
            </Button>
            <Button
              color="inherit"
              startIcon={<Settings />}
              onClick={() => setManagePagesOpen(true)}
              sx={{ fontSize: '1.1rem' }}
            >
              Gérer les pages
            </Button>
          </Box>
          <Button
            color="inherit"
            startIcon={<Close />}
            onClick={() => actions.setEditMode(false)}
            sx={{ fontSize: '1.1rem' }}
          >
            Quitter le mode édition
          </Button>
        </Toolbar>
      </AppBar>

      <CreatePageDialog
        open={createPageOpen}
        onClose={() => setCreatePageOpen(false)}
      />

      <ManagePagesDialog
        open={managePagesOpen}
        onClose={() => setManagePagesOpen(false)}
      />
    </>
  );
};

export default EditModeBar;
