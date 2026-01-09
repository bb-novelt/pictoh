import React from 'react';
import { Box, Typography } from '@mui/material';
import { Square } from '../types';
import { getPicturePath } from '../utils/pictureUtils';

interface SquareComponentProps {
  square: Square;
  onClick: () => void;
}

const SquareComponent: React.FC<SquareComponentProps> = ({ square, onClick }) => {
  const hasContent = square.selectedPicture || square.associatedText;

  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: '#fff',
        borderRadius: 2,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        border: '2px solid #e0e0e0',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: '#1976d2',
          transform: 'scale(1.02)',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
      }}
    >
      {hasContent ? (
        <>
          {square.displayTextAbovePicture && square.associatedText && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 1,
                fontSize: '1rem',
              }}
            >
              {square.associatedText}
            </Typography>
          )}
          {square.selectedPicture && (
            <Box
              component="img"
              src={getPicturePath(square.selectedPicture)}
              alt={square.associatedText}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          {!square.displayTextAbovePicture && square.associatedText && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 1,
                fontSize: '1rem',
              }}
            >
              {square.associatedText}
            </Typography>
          )}
        </>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ccc',
          }}
        >
          <Typography variant="h6">+</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SquareComponent;
