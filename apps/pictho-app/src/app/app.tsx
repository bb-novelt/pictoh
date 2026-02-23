import { useState } from 'react';
import { FirstLaunchLoader, isFirstLaunch } from '../firstLaunch';
import { OfflineIndicator } from '../offline/OfflineIndicator';
import { Layout } from '../grid/Layout';
import { Grid } from '../grid/Grid';
import { useClickTracker } from '../editMode';

export function App() {
  const [firstLaunchDone, setFirstLaunchDone] = useState(!isFirstLaunch());

  useClickTracker();

  if (!firstLaunchDone) {
    return <FirstLaunchLoader onComplete={() => setFirstLaunchDone(true)} />;
  }

  return (
    <Layout>
      <Grid />
      <OfflineIndicator />
    </Layout>
  );
}

export default App;
