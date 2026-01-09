import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useSnapshot } from 'valtio';
import { appState } from '../state/appState';
import { Square } from '../types';
import { getPicturePath } from '../utils/pictureUtils';

interface EditSquareModalProps {
  square: Square;
  open: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Square>) => void;
}

const EditSquareModal: React.FC<EditSquareModalProps> = ({
  square,
  open,
  onClose,
  onSave,
}) => {
  const snap = useSnapshot(appState);
  const [selectedPicture, setSelectedPicture] = useState(square.selectedPicture || '');
  const [associatedText, setAssociatedText] = useState(square.associatedText);
  const [displayTextAbove, setDisplayTextAbove] = useState(square.displayTextAbovePicture);
  const [openPageName, setOpenPageName] = useState(square.openPageName);
  const [searchFilter, setSearchFilter] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(true);

  useEffect(() => {
    setSelectedPicture(square.selectedPicture || '');
    setAssociatedText(square.associatedText);
    setDisplayTextAbove(square.displayTextAbovePicture);
    setOpenPageName(square.openPageName);
  }, [square]);

  const handleSave = () => {
    onSave({
      selectedPicture: selectedPicture || undefined,
      associatedText,
      displayTextAbovePicture: displayTextAbove,
      openPageName,
    });
  };

  // Filter pictures based on search and favorites
  const filteredPictures = snap.pictures
    .filter((pic) => {
      if (showOnlyFavorites && !pic.isFavorite) return false;
      if (searchFilter && !pic.text.toLowerCase().includes(searchFilter.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => a.text.localeCompare(b.text));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: '1.5rem' }}>Modifier la case</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {/* Current picture preview */}
          {selectedPicture && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: 2,
                border: '2px solid #e0e0e0',
                borderRadius: 2,
              }}
            >
              <img
                src={getPicturePath(selectedPicture)}
                alt={associatedText}
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </Box>
          )}

          {/* Text input */}
          <TextField
            label="Texte associé"
            fullWidth
            value={associatedText}
            onChange={(e) => setAssociatedText(e.target.value)}
            sx={{ fontSize: '1.2rem' }}
          />

          {/* Display text above checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={displayTextAbove}
                onChange={(e) => setDisplayTextAbove(e.target.checked)}
              />
            }
            label="Afficher le texte au-dessus de l'image"
          />

          {/* Page navigation */}
          <FormControl fullWidth>
            <InputLabel>Ouvrir la page</InputLabel>
            <Select
              value={openPageName}
              onChange={(e) => setOpenPageName(e.target.value)}
              label="Ouvrir la page"
            >
              <MenuItem value="">Aucune</MenuItem>
              {snap.pages.map((page) => (
                <MenuItem key={page.pageName} value={page.pageName}>
                  {page.pageName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Picture selection */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Sélectionner une image
          </Typography>

          {/* Search filter */}
          <TextField
            label="Rechercher une image"
            fullWidth
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            sx={{ fontSize: '1.1rem' }}
          />

          {/* Favorites filter */}
          <FormControlLabel
            control={
              <Checkbox
                checked={showOnlyFavorites}
                onChange={(e) => setShowOnlyFavorites(e.target.checked)}
              />
            }
            label="Afficher uniquement les favoris"
          />

          {/* Picture grid */}
          <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1,
              }}
            >
              {filteredPictures.map((pic) => (
                <Box
                  key={pic.id}
                  onClick={() => {
                    setSelectedPicture(pic.id);
                    setAssociatedText(pic.text);
                  }}
                  sx={{
                    cursor: 'pointer',
                    border:
                      selectedPicture === pic.id
                        ? '3px solid #1976d2'
                        : '2px solid #e0e0e0',
                    borderRadius: 1,
                    padding: 1,
                    display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      '&:hover': {
                        borderColor: '#1976d2',
                      },
                    }}
                  >
                    <img
                      src={getPicturePath(pic.id)}
                      alt={pic.text}
                      style={{ width: '100%', height: 'auto' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <Typography variant="caption" sx={{ textAlign: 'center', mt: 0.5 }}>
                      {pic.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            {filteredPictures.length === 0 && (
              <Typography sx={{ textAlign: 'center', py: 2, color: '#999' }}>
                Aucune image trouvée
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ fontSize: '1.1rem' }}>
          Annuler
        </Button>
        <Button onClick={handleSave} variant="contained" sx={{ fontSize: '1.1rem' }}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSquareModal;
