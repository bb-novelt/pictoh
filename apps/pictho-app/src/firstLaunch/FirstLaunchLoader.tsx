import { useEffect, useRef, useState } from 'react';
import { Alert, Box, LinearProgress, Typography } from '@mui/material';
import type { WorkerOutgoingMessage } from './downloadWorkerMessages';
import DownloadWorker from './downloadWorker?worker';
import {
  getPictureUrls,
  getTtsModelUrls,
  markFirstLaunchComplete,
} from './firstLaunchUtils';

/**
 * Progress weights for each download phase.
 * The app being fully loaded and running counts as the base 30%.
 */
const WEIGHT_APP = 30;
const WEIGHT_PICTURES = 40;
const WEIGHT_TTS = 30;

interface Props {
  onComplete: () => void;
}

/**
 * Full-screen loading overlay displayed on the very first launch.
 * Starts the download worker to pre-cache the picture library and TTS model,
 * tracks weighted progress, and calls `onComplete` when everything is ready.
 */
export function FirstLaunchLoader({ onComplete }: Props) {
  const [progress, setProgress] = useState(WEIGHT_APP);
  const [statusMessage, setStatusMessage] = useState(
    'Téléchargement des images…'
  );
  const [errors, setErrors] = useState<string[]>([]);

  // Track per-phase progress in refs to avoid stale-closure issues inside
  // the worker message handler.
  const phaseProgress = useRef({ pictures: 0, tts: 0 });
  const isCompleteRef = useRef(false);

  useEffect(() => {
    const worker = new DownloadWorker();

    function recalculate(): void {
      const p = phaseProgress.current;
      const total =
        WEIGHT_APP +
        (p.pictures / 100) * WEIGHT_PICTURES +
        (p.tts / 100) * WEIGHT_TTS;
      setProgress(Math.round(total));
    }

    worker.onmessage = (event: MessageEvent<WorkerOutgoingMessage>) => {
      const message = event.data;

      switch (message.type) {
        case 'PROGRESS':
          if (message.phase === 'pictures') {
            phaseProgress.current.pictures = message.percentage;
            setStatusMessage(
              `Téléchargement des images… ${message.downloaded}/${message.total}`
            );
          } else {
            phaseProgress.current.tts = message.percentage;
            setStatusMessage(
              `Téléchargement du modèle vocal… ${message.downloaded}/${message.total}`
            );
          }
          recalculate();
          break;

        case 'PHASE_COMPLETE':
          if (message.phase === 'pictures') {
            phaseProgress.current.pictures = 100;
            setStatusMessage('Images prêtes');
          } else {
            phaseProgress.current.tts = 100;
            setStatusMessage('Modèle vocal prêt');
          }
          recalculate();
          break;

        case 'ALL_COMPLETE':
          if (!isCompleteRef.current) {
            isCompleteRef.current = true;
            setProgress(100);
            setStatusMessage('Prêt !');
            markFirstLaunchComplete();
            // Brief pause so the user sees 100% before the app appears
            setTimeout(() => onComplete(), 500);
          }
          break;

        case 'ERROR':
          setErrors((prev) => [...prev, message.error]);
          break;
      }
    };

    worker.onerror = (error: ErrorEvent) => {
      setErrors((prev) => [
        ...prev,
        `Erreur du worker : ${error.message ?? 'inconnue'}`,
      ]);
    };

    const pictureUrls = getPictureUrls();
    const ttsModelUrls = getTtsModelUrls();

    worker.postMessage({ type: 'START_DOWNLOADS', pictureUrls, ttsModelUrls });

    return () => {
      worker.postMessage({ type: 'CANCEL' });
      worker.terminate();
    };
  }, [onComplete]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 3,
        px: 4,
      }}
    >
      <Typography variant="h4" component="h1">
        Pict&apos;Oh
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Préparation de l&apos;application…
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">{statusMessage}</Typography>
          <Typography variant="body2">{progress}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {errors.length > 0 && (
        <Alert severity="warning" sx={{ maxWidth: 500, width: '100%' }}>
          {errors.length === 1
            ? errors[0]
            : `${errors.length} erreurs lors du téléchargement. L'application continuera à fonctionner.`}
        </Alert>
      )}
    </Box>
  );
}
