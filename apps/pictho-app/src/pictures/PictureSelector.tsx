/**
 * PictureSelector – picture library browser with search, filter, and upload.
 *
 * - Search/filter text input
 * - Toggle to show built-in pictures, user-added pictures, or both
 * - Scrollable grid limited to PICTURE_DISPLAY_LIMIT pictures at once
 *   (when more than the limit exist, the most recently used are shown first,
 *   and the final list is sorted alphabetically)
 * - Currently selected picture is highlighted
 * - Upload button to add new user pictures (immediately cached for offline use)
 */
import { useRef, useState } from 'react';
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
import type { Picture } from '../shared/types';
import { pictureService } from './pictureService';
import { cacheUserPicture } from '../offline/serviceWorkerRegistration';
import { getDisplayPictures, type FilterType } from './pictureUtils';

interface ThumbnailProps {
  picture: Picture;
  isSelected: boolean;
  onSelect: (picture: Picture) => void;
}

/** Individual picture thumbnail with broken-image fallback. */
function PictureThumbnail({ picture, isSelected, onSelect }: ThumbnailProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Box
      onClick={() => onSelect(picture)}
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
      }}
    >
      {imgError ? (
        <Box
          sx={{
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.200',
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="text.disabled">
            ?
          </Typography>
        </Box>
      ) : (
        <Box
          component="img"
          src={picture.src}
          alt={picture.text}
          onError={() => setImgError(true)}
          sx={{ width: 64, height: 64, objectFit: 'contain' }}
        />
      )}
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
}

/**
 * PictureSelector component.
 *
 * Renders a search input, a filter toggle, an upload button, and a scrollable
 * grid of picture thumbnails. Updating `lastUsedTime` and triggering re-renders
 * are handled internally so the 50-picture limit stays up to date.
 */
interface Props {
  /** ID of the currently selected picture (highlighted in the grid) */
  selectedPictureId?: string | null;
  /** Called when the user selects a picture */
  onSelect: (picture: Picture) => void;
}

export function PictureSelector({ selectedPictureId, onSelect }: Props) {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<FilterType>('both');
  // Incremented whenever pictures change so the component re-reads the service
  const [, setRevision] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pictures = getDisplayPictures(searchText, filter);

  function handleSelect(picture: Picture) {
    pictureService.updateLastUsedTime(picture.id);
    setRevision((r) => r + 1);
    onSelect(picture);
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) return;

      const id = `user-${crypto.randomUUID()}`;
      // Use the filename without extension as the display text, capitalized
      const stem = file.name.replace(/\.[^.]+$/, '');
      const text = stem.charAt(0).toUpperCase() + stem.slice(1);

      const picture = pictureService.addUserPicture(id, text, src);

      // Cache immediately for offline availability
      cacheUserPicture(src);

      setRevision((r) => r + 1);
      // Auto-select the newly uploaded picture
      handleSelect(picture);
    };
    reader.readAsDataURL(file);

    // Reset the input so the same file can be uploaded again
    e.target.value = '';
  }

  return (
    <Box>
      {/* Search input */}
      <TextField
        placeholder="Rechercher une image…"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {/* Filter toggle + upload button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
        }}
      >
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_e, value: FilterType | null) => {
            if (value !== null) setFilter(value);
          }}
          size="small"
        >
          <ToggleButton value="both">Toutes</ToggleButton>
          <ToggleButton value="builtin">Bibliothèque</ToggleButton>
          <ToggleButton value="user">Mes images</ToggleButton>
        </ToggleButtonGroup>

        <Button
          size="small"
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={handleUploadClick}
        >
          Ajouter
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>

      {/* Picture grid */}
      {pictures.length === 0 ? (
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
          {pictures.map((picture) => (
            <PictureThumbnail
              key={picture.id}
              picture={picture}
              isSelected={selectedPictureId === picture.id}
              onSelect={handleSelect}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
