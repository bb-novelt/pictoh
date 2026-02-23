/** localStorage key used to record first-launch completion */
const FIRST_LAUNCH_KEY = 'pictoh-first-launch-complete';

/**
 * Return true when first-launch setup has not yet been completed.
 */
export function isFirstLaunch(): boolean {
  try {
    return localStorage.getItem(FIRST_LAUNCH_KEY) === null;
  } catch {
    // localStorage unavailable (e.g. private browsing without storage)
    return false;
  }
}

export function markFirstLaunchComplete(): void {
  try {
    localStorage.setItem(FIRST_LAUNCH_KEY, new Date().toISOString());
  } catch {
    // Ignore storage errors – the app can still run
  }
}

/**
 * URLs of built-in picture library images to pre-cache.
 * This list will be populated in Task 8.1 (Picture Library Setup).
 */
export function getPictureUrls(): string[] {
  return [];
}

/**
 * URLs of TTS model files to pre-cache.
 * The app uses the Web Speech API (device-local engine), so no model
 * files need to be downloaded.  The download worker handles an empty
 * list by sending PHASE_COMPLETE immediately.
 */
export function getTtsModelUrls(): string[] {
  return [];
}
