import { Box } from '@mui/material';
import { useSnapshot } from 'valtio';
import { store } from '../state';
import { Square } from './Square';

/**
 * Main 6-column × 4-row grid layout.
 *
 * - Fills all available space while keeping every square perfectly square.
 * - Gaps scale proportionally so the grid fits any tablet width/height.
 * - The grid is constrained so the squares remain square: the container
 *   uses `aspect-ratio: 6/4` and is bounded by both viewport dimensions.
 */
export function Grid() {
  const snap = useSnapshot(store);
  const currentPage = snap.pages.find(
    (page) => page.pageId === snap.currentPageId
  );

  if (!currentPage) return null;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        boxSizing: 'border-box',
      }}
    >
      {/*
       * Inner grid container.
       * aspect-ratio: 6/4 ensures the grid keeps a 3:2 proportion so all
       * cells remain perfectly square regardless of the viewport size.
       * max-width / max-height constrain it so it never overflows either axis.
       */}
      <Box
        sx={{
          aspectRatio: '6 / 4',
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'min(100%, calc(100vh * 6 / 4))',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '0.5%',
        }}
      >
        {currentPage.squares.map((square) => (
          <Square key={square.position} square={square} />
        ))}
      </Box>
    </Box>
  );
}

export default Grid;
