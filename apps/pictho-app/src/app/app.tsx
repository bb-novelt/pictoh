import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useSnapshot } from 'valtio';
import { FirstLaunchLoader, isFirstLaunch } from '../firstLaunch';
import { OfflineIndicator } from '../offline/OfflineIndicator';
import { Layout } from '../grid/Layout';
import { Grid } from '../grid/Grid';
import { useClickTracker, EditModeToolbar } from '../editMode';
import { initTts } from '../tts';
import { store } from '../state';

export function App() {
  const [firstLaunchDone, setFirstLaunchDone] = useState(!isFirstLaunch());
  const snap = useSnapshot(store);

  useEffect(() => {
    initTts();
  }, []);

  useClickTracker();

  if (!firstLaunchDone) {
    return <FirstLaunchLoader onComplete={() => setFirstLaunchDone(true)} />;
  }

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        {snap.isEditMode && <EditModeToolbar />}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <Grid />
        </Box>
      </Box>
      <OfflineIndicator />
    </Layout>
  );
}

export default App;
