import React, { useRef, useEffect } from 'react';

// Aurora color stops
const AURORA_COLORS = [
  ['#38bdf8', '#a78bfa', '#f472b6'], // blue, purple, pink
  ['#0ea5e9', '#38bdf8', '#fbbf24'], // cyan, blue, gold
  ['#a78bfa', '#f472b6', '#38bdf8'], // purple, pink, blue
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const AuroraBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function drawAurora(time: number) {
      ctx.clearRect(0, 0, width, height);
      // Draw 3 moving aurora bands
      for (let i = 0; i < 3; i++) {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        const colors = AURORA_COLORS[i];
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(0.5 + 0.1 * Math.sin(time / 2000 + i), colors[1]);
        grad.addColorStop(1, colors[2]);
        ctx.globalAlpha = 0.22 + 0.08 * Math.sin(time / (1800 + i * 500));
        ctx.save();
        ctx.translate(
          lerp(-width * 0.2, width * 0.2, 0.5 + 0.5 * Math.sin(time / (4000 + i * 1000))),
          lerp(-height * 0.1, height * 0.1, 0.5 + 0.5 * Math.cos(time / (3500 + i * 800)))
        );
        ctx.rotate(Math.sin(time / (5000 + i * 1200)) * 0.1 + (i - 1) * 0.15);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(width / 2, height * (0.4 + i * 0.18), width * 0.9, height * (0.18 + 0.08 * i), 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }
      // Draw vertical light streaks
      for (let i = 0; i < 7; i++) {
        const x = lerp(0, width, (i + 0.5 + 0.2 * Math.sin(time / (1800 + i * 300))) / 7);
        const grad = ctx.createLinearGradient(x, 0, x, height);
        grad.addColorStop(0, 'rgba(255,255,255,0.12)');
        grad.addColorStop(0.5, 'rgba(56,189,248,0.08)');
        grad.addColorStop(1, 'rgba(168,139,250,0.01)');
        ctx.globalAlpha = 0.18 + 0.08 * Math.sin(time / (1200 + i * 200));
        ctx.fillStyle = grad;
        ctx.fillRect(x - width * 0.01, 0, width * 0.02, height);
      }
      ctx.globalAlpha = 1;
    }

    function animate(time: number) {
      drawAurora(time);
      animationRef.current = requestAnimationFrame(animate);
    }
    animate(0);

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        zIndex: -2,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        background: 'black',
      }}
      aria-hidden="true"
    />
  );
});

export default AuroraBackground; 