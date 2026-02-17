/**
 * Edit mode state actions
 */
import { store } from '../store';

/**
 * Toggle edit mode on/off
 */
export function toggleEditMode(): void {
  store.isEditMode = !store.isEditMode;
}

/**
 * Enable edit mode
 */
export function enableEditMode(): void {
  store.isEditMode = true;
}

/**
 * Disable edit mode
 */
export function disableEditMode(): void {
  store.isEditMode = false;
}

/**
 * Check if edit mode is currently active
 * @returns true if edit mode is active
 */
export function isEditModeActive(): boolean {
  return store.isEditMode;
}
