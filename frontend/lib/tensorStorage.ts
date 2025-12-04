import { UserTensor } from './types';
import { MOCK_USER_TENSOR } from './mockData';

const STORAGE_KEY = 'quantum_user_tensor';

export function getTensor(): UserTensor {
  if (typeof window === 'undefined') return MOCK_USER_TENSOR;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading tensor:', error);
  }

  return MOCK_USER_TENSOR;
}

export function saveTensor(tensor: UserTensor): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tensor));
  } catch (error) {
    console.error('Error saving tensor:', error);
  }
}

export function resetTensor(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEY);
}
