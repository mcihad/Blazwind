/**
 * Confetti - Canvas-based celebration animation
 */

interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    colors?: string[];
    duration?: number;
    gravity?: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    shape: 'square' | 'circle' | 'triangle';
}

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;
let particles: Particle[] = [];

const defaultColors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
];

function createCanvas(): void {
    if (canvas) return;

    canvas = document.createElement('canvas');
    canvas.id = 'bw-confetti-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas(): void {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function removeCanvas(): void {
    if (canvas) {
        document.body.removeChild(canvas);
        canvas = null;
        ctx = null;
    }
    window.removeEventListener('resize', resizeCanvas);
}

function createParticle(x: number, y: number, options: ConfettiOptions): Particle {
    const colors = options.colors || defaultColors;
    const spread = options.spread || 70;
    const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180);
    const velocity = 8 + Math.random() * 8;

    const shapes: ('square' | 'circle' | 'triangle')[] = ['square', 'circle', 'triangle'];

    return {
        x,
        y,
        vx: Math.sin(angle) * velocity * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.cos(angle) * velocity - Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: shapes[Math.floor(Math.random() * shapes.length)]
    };
}

function drawParticle(particle: Particle): void {
    if (!ctx) return;

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.rotation * Math.PI) / 180);
    ctx.fillStyle = particle.color;

    switch (particle.shape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -particle.size / 2);
            ctx.lineTo(-particle.size / 2, particle.size / 2);
            ctx.lineTo(particle.size / 2, particle.size / 2);
            ctx.closePath();
            ctx.fill();
            break;
        default: // square
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
    }

    ctx.restore();
}

function animate(startTime: number, duration: number, gravity: number): void {
    if (!ctx || !canvas) return;

    const elapsed = Date.now() - startTime;
    if (elapsed > duration && particles.every(p => p.y > canvas!.height)) {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        removeCanvas();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.y < canvas!.height + 100);

    for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += gravity;
        particle.vx *= 0.99;
        particle.rotation += particle.rotationSpeed;

        drawParticle(particle);
    }

    animationId = requestAnimationFrame(() => animate(startTime, duration, gravity));
}

export function launchConfetti(options: ConfettiOptions = {}): void {
    const {
        particleCount = 100,
        duration = 3000,
        gravity = 0.3
    } = options;

    createCanvas();
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const startY = canvas.height * 0.6;

    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(centerX, startY, options));
    }

    if (!animationId) {
        animate(Date.now(), duration, gravity);
    }
}

export function launchConfettiFromElement(elementId: string, options: ConfettiOptions = {}): void {
    const element = document.getElementById(elementId);
    if (!element) {
        launchConfetti(options);
        return;
    }

    const rect = element.getBoundingClientRect();
    const {
        particleCount = 50,
        duration = 2500,
        gravity = 0.25
    } = options;

    createCanvas();
    if (!canvas) return;

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(x, y, options));
    }

    if (!animationId) {
        animate(Date.now(), duration, gravity);
    }
}

export function stopConfetti(): void {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    particles = [];
    removeCanvas();
}
