import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnapshot } from 'valtio';
import { store } from '../state/store';
import type { Picture } from '../shared/types';
import { updateSquare, setSquarePicture } from '../state/actions/squareActions';
import { updatePictureUsage } from '../state/actions/pictureActions';

interface Props {
  /** Grid position (0-23) of the square being edited */
  position: number;
  onClose: () => void;
}

/**
 * Modal for editing a single square in edit mode.
 *
 * - Displays a large preview of the currently selected picture.
 * - Provides editors for all square attributes; every change is saved
 *   immediately (no explicit save button needed).
 * - Shows a scrollable picture-selection grid filtered by search text.
 * - Closes when the user clicks outside the dialog or the close button.
 *
 * Note: The picture library will be populated in Task 8.1.
 * Until then the selection grid shows an empty-state message.
 */
export function SquareEditModal({ position, onClose }: Props) {
  const snap = useSnapshot(store);
  const [pictureSearch, setPictureSearch] = useState('');

  const currentPage = snap.pages.find((p) => p.pageId === snap.currentPageId);
  const square = currentPage?.squares.find((s) => s.position === position);

  if (!square) return null;

  // Pictures will be supplied by the picture service (Task 8.2).
  // For now we use an empty array so the UI renders correctly.
  const availablePictures: Picture[] = [];

  const filteredPictures = availablePictures.filter((p) =>
    p.text.toLowerCase().includes(pictureSearch.toLowerCase())
  );

  // --- Auto-save handlers ------------------------------------------------

  function handleTextChange(text: string) {
    updateSquare(position, { associatedText: text });
  }

  function handleDisplayTextChange(checked: boolean) {
    updateSquare(position, { displayTextAbovePicture: checked });
  }

  function handleNavigationChange(pageId: string) {
    updateSquare(position, { openPageId: pageId });
  }

  function handlePictureSelect(picture: Picture) {
    // Track usage so the 50-picture limit works correctly (Task 8.4)
    updatePictureUsage(picture);
    setSquarePicture(position, picture);
  }

  function handleClearPicture() {
    setSquarePicture(position, null);
  }

  // -----------------------------------------------------------------------

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pr: 6 }}>
        Modifier la case
        <IconButton
          onClick={onClose}
          size="small"
          title="Fermer"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* ── Large image preview ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            mb: 3,
            bgcolor: 'grey.100',
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {square.selectedPicture ? (
            <>
              <Box
                component="img"
                src={square.selectedPicture.src}
                alt={square.selectedPicture.text}
                sx={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
              <IconButton
                onClick={handleClearPicture}
                size="small"
                color="error"
                title="Supprimer l'image"
                sx={{ position: 'absolute', top: 4, right: 4 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <Typography color="text.secondary">
              Aucune image sélectionnée
            </Typography>
          )}
        </Box>

        {/* ── Attribute editors ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <TextField
            label="Texte associé"
            value={square.associatedText}
            onChange={(e) => handleTextChange(e.target.value)}
            fullWidth
            size="small"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={square.displayTextAbovePicture}
                onChange={(e) => handleDisplayTextChange(e.target.checked)}
              />
            }
            label="Afficher le texte au-dessus de l'image"
          />

          <FormControl fullWidth size="small">
            <InputLabel id="nav-page-label">Naviguer vers la page</InputLabel>
            <Select
              labelId="nav-page-label"
              label="Naviguer vers la page"
              value={square.openPageId}
              onChange={(e) => handleNavigationChange(e.target.value)}
            >
              <MenuItem value="">
                <em>Aucune navigation</em>
              </MenuItem>
              {snap.pages.map((page) => (
                <MenuItem key={page.pageId} value={page.pageId}>
                  {page.pageName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* ── Picture selection ── */}
        <Typography variant="subtitle2" gutterBottom>
          Sélectionner une image
        </Typography>

        <TextField
          placeholder="Rechercher une image…"
          value={pictureSearch}
          onChange={(e) => setPictureSearch(e.target.value)}
          size="small"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {filteredPictures.length === 0 ? (
          <Typography color="text.secondary" variant="body2" textAlign="center">
            Aucune image disponible.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: 1,
              maxHeight: 300,
              overflowY: 'auto',
            }}
          >
            {filteredPictures.map((picture) => {
              const isSelected = square.selectedPicture?.id === picture.id;
              return (
                <Box
                  key={picture.id}
                  onClick={() => handlePictureSelect(picture)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    bgcolor: isSelected ? 'action.selected' : 'grey.100',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box
                    component="img"
                    src={picture.src}
                    alt={picture.text}
                    sx={{ width: 64, height: 64, objectFit: 'contain' }}
                  />
                  <Typography
                    variant="caption"
                    textAlign="center"
                    sx={{
                      mt: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                  >
                    {picture.text}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
