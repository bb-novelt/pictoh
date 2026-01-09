import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useSnapshot } from 'valtio';
import { appState, actions, selectors } from '../state/appState';
import SquareComponent from './Square';
import EditSquareModal from './EditSquareModal';
import EditModeBar from './EditModeBar';
import { Square } from '../types';

const Grid: React.FC = () => {
  const snap = useSnapshot(appState);
  const currentPage = selectors.getCurrentPage();
  const [clickCounts, setClickCounts] = useState<{ [key: number]: number }>({});
  const [editingSquare, setEditingSquare] = useState<Square | null>(null);
  const [editingSquareIndex, setEditingSquareIndex] = useState<number | null>(null);

  const handleSquareClick = (square: Square, pageIndex: number) => {
    if (snap.isEditMode) {
      // Open edit modal
      setEditingSquare(square);
      setEditingSquareIndex(square.id);
    } else {
      // Track clicks for edit mode activation
      const newCounts = { ...clickCounts };
      newCounts[square.id] = (newCounts[square.id] || 0) + 1;
      
      if (newCounts[square.id] === 5) {
        // Activate edit mode after 5 clicks
        actions.setEditMode(true);
        setClickCounts({}); // Reset counts
      } else {
        setClickCounts(newCounts);
        
        // Read associated text aloud
        if (square.associatedText) {
          speakText(square.associatedText);
        }
        
        // Navigate to page if specified (after speech)
        if (square.openPageName) {
          setTimeout(() => {
            actions.setCurrentPage(square.openPageName);
          }, 500);
        }
      }
    }
  };

  const speakText = (text: string) => {
    // Use Web Speech API (browser TTS)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      
      // Try to use a female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) => voice.lang.startsWith('fr') && voice.name.toLowerCase().includes('female')
      ) || voices.find((voice) => voice.lang.startsWith('fr'));
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCloseModal = () => {
    setEditingSquare(null);
    setEditingSquareIndex(null);
  };

  const handleSaveSquare = (updates: Partial<Square>) => {
    if (editingSquareIndex !== null && currentPage) {
      const pageIndex = snap.pages.findIndex((p) => p.pageName === currentPage.pageName);
      actions.updateSquare(pageIndex, editingSquareIndex, updates);
    }
    handleCloseModal();
  };

  if (!currentPage) {
    return <div>Page non trouvée</div>;
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {snap.isEditMode && <EditModeBar />}
      
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: 2,
          padding: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        {currentPage.squares.map((square, index) => (
          <SquareComponent
            key={square.id}
            square={square}
            onClick={() => {
              const pageIndex = snap.pages.findIndex((p) => p.pageName === currentPage.pageName);
              handleSquareClick(square, pageIndex);
            }}
          />
        ))}
      </Box>

      {editingSquare && (
        <EditSquareModal
          square={editingSquare}
          open={!!editingSquare}
          onClose={handleCloseModal}
          onSave={handleSaveSquare}
        />
      )}
    </Box>
  );
};

export default Grid;
