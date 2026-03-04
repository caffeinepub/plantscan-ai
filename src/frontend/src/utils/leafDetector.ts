/**
 * Leaf detector utility
 * Uses canvas pixel analysis to detect if an uploaded image is likely a plant leaf.
 * Checks for dominant green/yellow-green tones which are characteristic of plant foliage.
 */

export interface LeafDetectionResult {
  isLeaf: boolean;
  greenRatio: number; // 0–1, fraction of pixels that are "plant-green"
}

/**
 * Analyzes the uploaded image for plant leaf characteristics.
 * Returns true if the image has enough green/plant-like pixels.
 */
export async function detectLeaf(file: File): Promise<LeafDetectionResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_DIM = 100; // Downsample for performance
      const scale = Math.min(MAX_DIM / img.width, MAX_DIM / img.height, 1);
      canvas.width = Math.max(1, Math.floor(img.width * scale));
      canvas.height = Math.max(1, Math.floor(img.height * scale));

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve({ isLeaf: false, greenRatio: 0 });
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      let greenPixels = 0;
      let totalPixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Skip transparent pixels
        if (a < 30) continue;
        totalPixels++;

        // Plant leaf green: green channel must dominate red and blue
        // Also covers yellow-green, dark green, lime tones
        const isGreen =
          g > 60 && // minimum green brightness
          g > r * 1.05 && // green dominates red
          g > b * 1.1 && // green dominates blue
          g - b > 15 && // meaningful green-blue gap
          r < 220; // avoid near-white

        if (isGreen) greenPixels++;
      }

      if (totalPixels === 0) {
        resolve({ isLeaf: false, greenRatio: 0 });
        return;
      }

      const greenRatio = greenPixels / totalPixels;

      // Threshold: at least 12% of non-transparent pixels are plant-green
      const isLeaf = greenRatio >= 0.12;

      resolve({ isLeaf, greenRatio });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ isLeaf: false, greenRatio: 0 });
    };

    img.src = url;
  });
}
