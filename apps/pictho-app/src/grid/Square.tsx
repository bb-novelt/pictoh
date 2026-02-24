import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { Square as SquareType } from '../shared/types';

interface Props {
  square: SquareType;
  onClick: () => void;
  isEditMode: boolean;
}

/**
 * A single square cell in the 6×4 grid.
 *
 * - Stays perfectly square via the aspect-ratio CSS property.
 * - Has rounded corners.
 * - Displays the selected picture if one is set; otherwise renders an empty placeholder.
 * - Shows a blue border flash on touch start (normal mode) as visual feedback.
 * - Shows a persistent red border when edit mode is active.
 */
export function Square({ square, onClick, isEditMode }: Props) {
  const [touched, setTouched] = useState(false);
  // Track which src caused an error; imgError is true when the current src failed
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const imgError = errorSrc === square.selectedPicture?.src;
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current !== null) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  function handleTouchStart() {
    setTouched(true);
    touchTimeoutRef.current = setTimeout(() => setTouched(false), 1000);
    onClick();
  }

  // Determine border: red in edit mode, blue flash on touch, grey otherwise
  let borderColor: string;
  if (isEditMode) {
    borderColor = 'error.main';
  } else if (touched) {
    borderColor = 'primary.main';
  } else {
    borderColor = 'grey.300';
  }

  return (
    <Box
      onTouchStart={handleTouchStart}
      onClick={isEditMode ? onClick : undefined}
      sx={{
        aspectRatio: '1 / 1',
        borderRadius: 2,
        bgcolor: square.selectedPicture ? 'background.paper' : 'grey.100',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        width: '100%',
        cursor: 'pointer',
        border: '2px solid',
        borderColor: borderColor,
        boxSizing: 'border-box',
      }}
    >
      {square.selectedPicture && (
        <>
          {square.displayTextAbovePicture && square.associatedText && (
            <Box
              component="span"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                textAlign: 'center',
                px: 0.5,
                lineHeight: 1.2,
                color: 'text.primary',
              }}
            >
              {square.associatedText}
            </Box>
          )}
          {imgError ? (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ flex: 1, display: 'flex', alignItems: 'center' }}
            >
              ?
            </Typography>
          ) : (
            <Box
              component="img"
              src={square.selectedPicture.src}
              alt={square.selectedPicture.text}
              onError={() => setErrorSrc(square.selectedPicture?.src ?? null)}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                flex: 1,
              }}
            />
          )}
          {!square.displayTextAbovePicture && square.associatedText && (
            <Box
              component="span"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                textAlign: 'center',
                px: 0.5,
                lineHeight: 1.2,
                color: 'text.primary',
              }}
            >
              {square.associatedText}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default Square;
