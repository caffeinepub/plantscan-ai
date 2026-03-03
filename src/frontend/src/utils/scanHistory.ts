import type { Prediction } from "./cnnSimulator";

export interface ScanEntry {
  id: string;
  timestamp: number;
  imageDataUrl: string;
  predictions: Prediction[];
}

const STORAGE_KEY = "plantscan_history";

export function loadHistory(): ScanEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ScanEntry[];
  } catch {
    return [];
  }
}

export function saveEntry(entry: ScanEntry): void {
  const history = loadHistory();
  // Prepend new entry (most recent first)
  history.unshift(entry);
  // Keep only last 50 entries
  const trimmed = history.slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
