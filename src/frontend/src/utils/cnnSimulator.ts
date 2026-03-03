import { type Disease, diseases } from "../data/diseases";

export interface Prediction {
  disease: Disease;
  confidence: number;
}

function hashBytes(bytes: Uint8Array): number {
  let hash = 5381;
  // Sample at most 1000 bytes spread across the file for performance
  const step = Math.max(1, Math.floor(bytes.length / 1000));
  for (let i = 0; i < bytes.length; i += step) {
    hash = ((hash << 5) + hash + bytes[i]) >>> 0; // unsigned 32-bit
  }
  return hash;
}

export async function simulateCNN(file: File): Promise<Prediction[]> {
  // Read file bytes for hashing
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const seed = hashBytes(bytes);

  const total = diseases.length; // 12

  // Pick 3 distinct disease indices
  let idx0 = seed % total;
  let idx1 = (seed * 31 + 7) % total;
  let idx2 = (seed * 97 + 13) % total;

  // Ensure distinct
  if (idx1 === idx0) idx1 = (idx1 + 1) % total;
  if (idx2 === idx0 || idx2 === idx1) {
    idx2 = (idx2 + 1) % total;
    if (idx2 === idx0 || idx2 === idx1) {
      idx2 = (idx2 + 1) % total;
    }
  }

  // Confidence variation based on seed
  const variation = (seed % 10) / 100; // 0.00 – 0.09

  const predictions: Prediction[] = [
    { disease: diseases[idx0], confidence: Math.min(0.98, 0.6 + variation) },
    {
      disease: diseases[idx1],
      confidence: Math.max(0.05, 0.25 - variation / 2),
    },
    {
      disease: diseases[idx2],
      confidence: Math.max(0.02, 0.15 - variation / 4),
    },
  ];

  // Normalize so they sum close to 1
  const total_conf = predictions.reduce((sum, p) => sum + p.confidence, 0);
  for (const p of predictions) {
    p.confidence = Math.round((p.confidence / total_conf) * 100) / 100;
  }

  return predictions.sort((a, b) => b.confidence - a.confidence);
}
