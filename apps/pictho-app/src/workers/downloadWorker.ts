/// <reference lib="webworker" />
/**
 * Download Web Worker for Pict'Oh
 *
 * Handles background downloading of:
 * - Picture library (all images from /assets/pictures/*)
 * - TTS model files
 *
 * Fetching resources through the worker causes the service worker to intercept
 * and cache them via its cache-first strategy, ensuring offline availability.
 *
 * Message protocol: see downloadWorkerMessages.ts
 */

import type {
  DownloadPhase,
  WorkerIncomingMessage,
  WorkerOutgoingMessage,
} from './downloadWorkerMessages';

let isCancelled = false;

self.addEventListener(
  'message',
  async (event: MessageEvent<WorkerIncomingMessage>) => {
    const message = event.data;

    if (message.type === 'CANCEL') {
      isCancelled = true;
      return;
    }

    if (message.type === 'START_DOWNLOADS') {
      isCancelled = false;
      const { pictureUrls, ttsModelUrls } = message;

      // Download picture library — service worker caches each response
      await downloadResources('pictures', pictureUrls);
      if (isCancelled) return;

      // Download TTS model files — service worker caches each response
      await downloadResources('tts', ttsModelUrls);
      if (isCancelled) return;

      const completeMsg: WorkerOutgoingMessage = { type: 'ALL_COMPLETE' };
      self.postMessage(completeMsg);
    }
  }
);

/**
 * Fetch each URL in sequence, posting PROGRESS messages after each fetch.
 * Errors are reported per-file and do not abort the remaining downloads.
 */
async function downloadResources(
  phase: DownloadPhase,
  urls: string[]
): Promise<void> {
  const total = urls.length;

  if (total === 0) {
    const msg: WorkerOutgoingMessage = { type: 'PHASE_COMPLETE', phase };
    self.postMessage(msg);
    return;
  }

  let downloaded = 0;

  for (const url of urls) {
    if (isCancelled) return;

    try {
      // Fetch the resource; the service worker intercepts and caches the response
      await fetch(url);
      downloaded++;

      const progressMsg: WorkerOutgoingMessage = {
        type: 'PROGRESS',
        phase,
        downloaded,
        total,
        percentage: Math.round((downloaded / total) * 100),
      };
      self.postMessage(progressMsg);
    } catch (error) {
      console.error(`[DownloadWorker] Failed to fetch ${url}:`, error);
      const errorMsg: WorkerOutgoingMessage = {
        type: 'ERROR',
        phase,
        error: `Failed to fetch ${url}: ${error instanceof Error ? error.message : String(error)}`,
      };
      self.postMessage(errorMsg);
    }
  }

  const phaseCompleteMsg: WorkerOutgoingMessage = {
    type: 'PHASE_COMPLETE',
    phase,
  };
  self.postMessage(phaseCompleteMsg);
}
