// Частицы фона
function initParticles() {
    // Простая реализация частиц без внешних библиотек
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        z-index: -1; pointer-events: none;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = 'rgba(215, 185, 213, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Запуск частиц
document.addEventListener('DOMContentLoaded', initParticles);

// Дополнительные эффекты
function createMagicSparkle() {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: fixed; width: 6px; height: 6px; background: #ff69b4;
        border-radius: 50%; pointer-events: none; z-index: 9999;
        left: ${Math.random() * 100}vw; top: ${Math.random() * 100}vh;
        animation: sparkleFloat 3s ease-out forwards;
    `;
    sparkle.innerHTML = '✨';
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 3000);
}

// Автоматические блеск
setInterval(createMagicSparkle, 5000);
