import { useState } from 'react';
import { FirstLaunchLoader, isFirstLaunch } from '../firstLaunch';
import { OfflineIndicator } from '../offline/OfflineIndicator';

export function App() {
  const [firstLaunchDone, setFirstLaunchDone] = useState(!isFirstLaunch());

  if (!firstLaunchDone) {
    return <FirstLaunchLoader onComplete={() => setFirstLaunchDone(true)} />;
  }

  return (
    <>
      <div>
        <h1>Pict&apos;Oh</h1>
        <p>Application de communication par pictogrammes</p>
      </div>
      <OfflineIndicator />
    </>
  );
}

export default App;
