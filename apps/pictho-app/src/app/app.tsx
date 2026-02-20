import { useState } from 'react';
import { FirstLaunchLoader, isFirstLaunch } from '../firstLaunch';
import { OfflineIndicator } from '../offline/OfflineIndicator';
import { Layout } from '../grid/Layout';

export function App() {
  const [firstLaunchDone, setFirstLaunchDone] = useState(!isFirstLaunch());

  if (!firstLaunchDone) {
    return <FirstLaunchLoader onComplete={() => setFirstLaunchDone(true)} />;
  }

  return (
    <Layout>
      <div>
        <h1>Pict&apos;Oh</h1>
        <p>Application de communication par pictogrammes</p>
      </div>
      <OfflineIndicator />
    </Layout>
  );
}

export default App;
