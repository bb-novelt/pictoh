import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useSnapshot } from 'valtio';
import { FirstLaunchLoader, isFirstLaunch } from '../firstLaunch';
import { OfflineIndicator } from '../offline/OfflineIndicator';
import { Layout } from '../grid/Layout';
import { Grid } from '../grid/Grid';
import {
  useClickTracker,
  EditModeToolbar,
  CreatePageDialog,
  ManagePagesDialog,
} from '../editMode';
import { initTts } from '../tts';
import { store } from '../state';
import { initAutoSave } from '../storage/autoSave';
import { SaveIndicator } from '../storage/SaveIndicator';

export function App() {
  const [firstLaunchDone, setFirstLaunchDone] = useState(!isFirstLaunch());
  const [createPageOpen, setCreatePageOpen] = useState(false);
  const [managePagesOpen, setManagePagesOpen] = useState(false);
  const snap = useSnapshot(store);

  useEffect(() => {
    initTts();
  }, []);

  useEffect(() => initAutoSave(), []);

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
        {snap.isEditMode && (
          <EditModeToolbar
            onCreatePage={() => setCreatePageOpen(true)}
            onManagePages={() => setManagePagesOpen(true)}
          />
        )}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <Grid />
        </Box>
      </Box>
      <OfflineIndicator />
      <SaveIndicator />
      <CreatePageDialog
        open={createPageOpen}
        onClose={() => setCreatePageOpen(false)}
      />
      <ManagePagesDialog
        open={managePagesOpen}
        onClose={() => setManagePagesOpen(false)}
      />
    </Layout>
  );
}

export default App;
