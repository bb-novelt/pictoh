/**
 * Message type definitions for the download Web Worker.
 * Shared between the main thread and the worker.
 */

/** Messages sent FROM the main thread TO the worker */
export type WorkerIncomingMessage =
  | {
      type: 'START_DOWNLOADS';
      /** URLs of picture library images to prefetch and cache */
      pictureUrls: string[];
      /** URLs of TTS model files to prefetch and cache */
      ttsModelUrls: string[];
    }
  | { type: 'CANCEL' };

/** Phase identifier for a download operation */
export type DownloadPhase = 'pictures' | 'tts';

/** Progress information for a single download phase */
export interface DownloadProgress {
  phase: DownloadPhase;
  /** Number of files downloaded so far in this phase */
  downloaded: number;
  /** Total number of files in this phase */
  total: number;
  /** Completion percentage for this phase (0–100) */
  percentage: number;
}

/** Messages sent FROM the worker TO the main thread */
export type WorkerOutgoingMessage =
  | ({ type: 'PROGRESS' } & DownloadProgress)
  | { type: 'PHASE_COMPLETE'; phase: DownloadPhase }
  | { type: 'ALL_COMPLETE' }
  | { type: 'ERROR'; phase: DownloadPhase; error: string };
