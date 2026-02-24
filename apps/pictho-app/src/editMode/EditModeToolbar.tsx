import { AppBar, Button, Toolbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import { disableEditMode } from '../state/actions/editModeActions';

interface Props {
  onCreatePage?: () => void;
  onManagePages?: () => void;
}

/**
 * Toolbar displayed at the top of the screen when edit mode is active.
 *
 * - "Créer une nouvelle page" — opens the create-page dialog (task 6.2).
 * - "Gérer les pages" — opens the manage-pages dialog (task 6.3).
 * - "Quitter le mode édition" — exits edit mode immediately.
 */
export function EditModeToolbar({ onCreatePage, onManagePages }: Props) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar variant="dense" sx={{ gap: 1 }}>
        <Button color="inherit" startIcon={<AddIcon />} onClick={onCreatePage}>
          Créer une nouvelle page
        </Button>
        <Button
          color="inherit"
          startIcon={<ListIcon />}
          onClick={onManagePages}
        >
          Gérer les pages
        </Button>
        <Button
          color="inherit"
          startIcon={<CloseIcon />}
          onClick={disableEditMode}
          sx={{ ml: 'auto' }}
        >
          Quitter le mode édition
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default EditModeToolbar;
