'use client';

import { useEffect, useRef } from 'react';

export default function BgEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Lightweight static background: subtle vertical gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#f5f7fb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Textured noise overlay (very light)
      const noiseSize = 128;
      const noise = document.createElement('canvas');
      noise.width = noiseSize;
      noise.height = noiseSize;
      const nctx = noise.getContext('2d');
      if (nctx) {
        const imageData = nctx.createImageData(noiseSize, noiseSize);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const v = 240 + Math.floor(Math.random() * 15); // near-white
          imageData.data[i] = v;
          imageData.data[i + 1] = v;
          imageData.data[i + 2] = v;
          imageData.data[i + 3] = 14; // ~5% opacity
        }
        nctx.putImageData(imageData, 0, 0);
        const pattern = ctx.createPattern(noise, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, width, height);
        }
      }
    };

    draw();
    window.addEventListener('resize', draw);
    return () => {
      window.removeEventListener('resize', draw);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed left-0 top-0 h-screen w-screen"
      style={{ zIndex: -10 }}
    />
  );
}
