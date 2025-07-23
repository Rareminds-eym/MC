import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'dust' | 'magic' | 'ember';
}

interface CanvasParticlesProps {
  className?: string;
  particleCount?: number;
}

const CanvasParticles: React.FC<CanvasParticlesProps> = ({
  className = "",
  particleCount = 100
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        const type = Math.random() < 0.6 ? 'dust' : Math.random() < 0.8 ? 'magic' : 'ember';
        particlesRef.current.push(createParticle(canvas.width, canvas.height, type));
      }
    };

    const createParticle = (width: number, height: number, type: Particle['type']): Particle => {
      const baseColors = {
        dust: ['rgba(255, 255, 255, 0.3)', 'rgba(200, 200, 255, 0.2)', 'rgba(255, 255, 200, 0.25)'],
        magic: ['rgba(167, 139, 250, 0.6)', 'rgba(96, 165, 250, 0.5)', 'rgba(52, 211, 153, 0.4)'],
        ember: ['rgba(251, 191, 36, 0.7)', 'rgba(245, 158, 11, 0.6)', 'rgba(239, 68, 68, 0.5)']
      };

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (type === 'dust' ? 0.5 : type === 'magic' ? 1 : 0.8),
        vy: (Math.random() - 0.5) * (type === 'dust' ? 0.3 : type === 'magic' ? 0.8 : -1.2),
        size: type === 'dust' ? Math.random() * 2 + 0.5 : type === 'magic' ? Math.random() * 4 + 2 : Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: baseColors[type][Math.floor(Math.random() * baseColors[type].length)],
        life: 0,
        maxLife: type === 'dust' ? Math.random() * 300 + 200 : type === 'magic' ? Math.random() * 400 + 300 : Math.random() * 200 + 100,
        type
      };
    };

    const updateParticle = (particle: Particle, width: number, height: number) => {
      particle.life++;
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Apply different behaviors based on type
      if (particle.type === 'dust') {
        particle.vy += 0.001; // Slight gravity
        particle.vx += (Math.random() - 0.5) * 0.01; // Brownian motion
      } else if (particle.type === 'magic') {
        particle.vx += Math.sin(particle.life * 0.02) * 0.02;
        particle.vy += Math.cos(particle.life * 0.015) * 0.02;
      } else if (particle.type === 'ember') {
        particle.vy -= 0.02; // Rise upward
        particle.vx += (Math.random() - 0.5) * 0.05;
      }

      // Fade out over lifetime
      const lifeRatio = particle.life / particle.maxLife;
      particle.opacity = Math.max(0, 1 - lifeRatio);

      // Wrap around screen or reset
      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;

      // Reset particle if it's dead
      if (particle.life >= particle.maxLife) {
        const newParticle = createParticle(width, height, particle.type);
        Object.assign(particle, newParticle);
      }
    };

    const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;

      if (particle.type === 'dust') {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (particle.type === 'magic') {
        // Draw magical sparkle
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add inner glow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else if (particle.type === 'ember') {
        // Draw ember with tail
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add tail
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);
        ctx.stroke();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        updateParticle(particle, canvas.width, canvas.height);
        drawParticle(ctx, particle);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

export default CanvasParticles;
