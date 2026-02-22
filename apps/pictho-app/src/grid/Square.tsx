import { Box } from '@mui/material';
import type { Square as SquareType } from '../shared/types';

interface Props {
  square: SquareType;
}

/**
 * A single square cell in the 6×4 grid.
 *
 * - Stays perfectly square via the aspect-ratio CSS property.
 * - Has rounded corners.
 * - Displays the selected picture if one is set; otherwise renders an empty placeholder.
 */
export function Square({ square }: Props) {
  return (
    <Box
      sx={{
        aspectRatio: '1 / 1',
        borderRadius: 2,
        bgcolor: 'grey.100',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        width: '100%',
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
          <Box
            component="img"
            src={square.selectedPicture.src}
            alt={square.selectedPicture.text}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              flex: 1,
            }}
          />
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
