import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useSnapshot } from 'valtio';
import { store } from '../state/store';
import {
  navigateToPage,
  deletePage,
  renamePage,
} from '../state/actions/pageActions';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Dialog for managing all pages.
 *
 * - Lists all pages sorted alphabetically.
 * - Highlights the current page.
 * - Allows navigating to, renaming, or deleting each page.
 * - Prevents deletion of the Home page.
 * - Asks for confirmation before deleting a page.
 * - Navigates to Home automatically when the current page is deleted.
 */
export function ManagePagesDialog({ open, onClose }: Props) {
  const snap = useSnapshot(store);

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingError, setEditingError] = useState('');
  const [deleteConfirmPageId, setDeleteConfirmPageId] = useState<string | null>(
    null
  );

  const sortedPages = [...snap.pages].sort((a, b) =>
    a.pageName.localeCompare(b.pageName, 'fr')
  );

  function handleNavigate(pageId: string) {
    navigateToPage(pageId);
    onClose();
  }

  function handleStartRename(pageId: string, currentName: string) {
    setEditingPageId(pageId);
    setEditingName(currentName);
    setEditingError('');
  }

  function handleCancelRename() {
    setEditingPageId(null);
    setEditingName('');
    setEditingError('');
  }

  function handleConfirmRename(pageId: string) {
    const trimmed = editingName.trim();

    if (!trimmed) {
      setEditingError('Le nom ne peut pas être vide.');
      return;
    }

    const nameExists = snap.pages.some(
      (page) =>
        page.pageId !== pageId &&
        page.pageName.toLowerCase() === trimmed.toLowerCase()
    );
    if (nameExists) {
      setEditingError('Une page avec ce nom existe déjà.');
      return;
    }

    renamePage(pageId, trimmed);
    setEditingPageId(null);
    setEditingName('');
    setEditingError('');
  }

  function handleDeleteRequest(pageId: string) {
    setDeleteConfirmPageId(pageId);
  }

  function handleDeleteConfirm() {
    if (deleteConfirmPageId) {
      deletePage(deleteConfirmPageId);
      setDeleteConfirmPageId(null);
    }
  }

  function handleDeleteCancel() {
    setDeleteConfirmPageId(null);
  }

  const deleteConfirmPage = deleteConfirmPageId
    ? snap.pages.find((p) => p.pageId === deleteConfirmPageId)
    : null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Gérer les pages</DialogTitle>
        <DialogContent>
          <List disablePadding>
            {sortedPages.map((page) => {
              const isCurrent = page.pageId === snap.currentPageId;
              const isHome = page.pageId === snap.homePageId;
              const isEditing = editingPageId === page.pageId;

              return (
                <ListItem
                  key={page.pageId}
                  divider
                  sx={{
                    backgroundColor: isCurrent
                      ? 'action.selected'
                      : 'transparent',
                    gap: 1,
                  }}
                >
                  {isEditing ? (
                    <>
                      <TextField
                        size="small"
                        value={editingName}
                        onChange={(e) => {
                          setEditingName(e.target.value);
                          setEditingError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter')
                            handleConfirmRename(page.pageId);
                          if (e.key === 'Escape') handleCancelRename();
                        }}
                        error={!!editingError}
                        helperText={editingError}
                        autoFocus
                        sx={{ flex: 1 }}
                      />
                      <IconButton
                        onClick={() => handleConfirmRename(page.pageId)}
                        color="primary"
                        size="small"
                        title="Valider"
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleCancelRename}
                        size="small"
                        title="Annuler"
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={isCurrent ? 'bold' : 'normal'}
                          >
                            {page.pageName}
                          </Typography>
                        }
                      />
                      <IconButton
                        onClick={() => handleNavigate(page.pageId)}
                        size="small"
                        title="Ouvrir"
                      >
                        <OpenInNewIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          handleStartRename(page.pageId, page.pageName)
                        }
                        size="small"
                        title="Renommer"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteRequest(page.pageId)}
                        size="small"
                        disabled={isHome}
                        color="error"
                        title="Supprimer"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirmPageId} onClose={handleDeleteCancel}>
        <DialogTitle>Supprimer la page</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer la page «&nbsp;
            {deleteConfirmPage?.pageName}&nbsp;» ? Cette action est
            irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Annuler</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
