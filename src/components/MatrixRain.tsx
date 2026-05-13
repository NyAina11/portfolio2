import { useEffect, useRef } from 'react';

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let columns = 0;
    let drops: number[] = [];
    const fontSize = 14;
    // Cyberpunk/Hacker style chars: 01, hex, and katakana
    const chars = '010101ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ'.split('');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (let x = 0; x < columns; x++) {
        // Randomize initial drops completely so they don't start as a solid wall
        drops[x] = Math.random() * (canvas.height / fontSize) * -1;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = 0;
    const fps = 24; // 24 FPS for retro effect
    const interval = 1000 / fps;

    const draw = (time: number) => {
      animationFrameId = requestAnimationFrame(draw);
      
      const deltaTime = time - lastTime;
      if (deltaTime < interval) return;
      lastTime = time - (deltaTime % interval);

      // Fade out previous frames to create a trailing effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Predominantly subtle cyan, rare bright purple for "glitch" feel
        const isPurple = Math.random() > 0.98;
        const opacity = Math.random() * 0.3 + 0.1; // random opacity between 0.1 and 0.4
        
        ctx.fillStyle = isPurple ? `rgba(188, 19, 254, ${opacity + 0.2})` : `rgba(0, 243, 255, ${opacity})`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to the top randomly to keep vertical variation
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-30] opacity-40 pointer-events-none mix-blend-screen"
    />
  );
}
