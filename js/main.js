// Глобальные переменные
let entries = JSON.parse(localStorage.getItem('weddingEntries')) || [];
let confirmedCount = 0;
// Глобальная переменная для админки
window.confirmedCount = confirmedCount;
window.entries = entries;
window.updateGuestCounter = updateGuestCounter;
let isNightMode = false;
const weddingDate = new Date('2027-07-07T14:00:00').getTime();

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initWeddingSite);

function initWeddingSite() {
    initAOS();
    initProgressBar();
    initCountdown();
    initRSVPForm();
    initNightMode();
    initMobileMenu();
    initSmoothScroll();
    initMap();
    updateGuestCounter();
    
    // Автоматические сердечки
    setInterval(createFloatingHeart, 10000);
}

function initAOS() {
    AOS.init({ duration: 1200, once: true, offset: 120 });
}

function initProgressBar() {
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        document.getElementById('progressBar').style.width = scrolled + '%';
    });
}

function initCountdown() {
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            const grid = document.getElementById('countdownGrid');
            if (grid) {
                grid.innerHTML = '<h2 style="grid-column: 1 / -1; color: white; font-size: 3rem; font-family: Playfair Display, serif;">СВАДЬБА! 💕</h2>';
                return;
            }
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Безопасное обновление с проверкой элементов
        const updateElement = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value.toString().padStart(2, '0');
        };
        
        updateElement('days', days);
        updateElement('hours', hours);
        updateElement('minutes', minutes);
        updateElement('seconds', seconds);
    };
    
    updateCountdown(); // Первый запуск
    setInterval(updateCountdown, 1000); // Каждую секунду
}

function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const entry = {
            id: Date.now(),
            name: document.getElementById('guestName').value,
            count: document.getElementById('guestCount').value,
            attendance: document.getElementById('attendance').value,
            diet: document.getElementById('diet').value,
            wishes: document.getElementById('wishes').value,
            timestamp: new Date().toISOString()
        };
        
        entries.push(entry);
        localStorage.setItem('weddingEntries', JSON.stringify(entries));
        
        if (entry.attendance === 'yes') confirmedCount++;
        
        updateGuestCounter();
        showNotification('✅ Спасибо за подтверждение!');
        form.reset();
        createFloatingHeart();
        launchConfetti();
    });
}

function updateGuestCounter() {
    document.getElementById('confirmedCount').textContent = confirmedCount;
}

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '💕';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}

function initNightMode() {
    const toggle = document.getElementById('modeToggle');
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        isNightMode = !isNightMode;
        toggle.querySelector('i').className = isNightMode ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('nightMode', isNightMode);
    });
    
    if (localStorage.getItem('nightMode') === 'true') {
        document.body.classList.add('night-mode');
        isNightMode = true;
        document.querySelector('.mode-toggle i').className = 'fas fa-sun';
    }
}

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.querySelector('.nav-menu');
    btn.addEventListener('click', () => menu.classList.toggle('mobile-open'));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initMap() {
    ymaps.ready(() => {
        const map = new ymaps.Map('map', {
            center: [55.7558, 37.6176],
            zoom: 16,
            controls: ['zoomControl', 'fullscreenControl']
        });
        
        const placemark = new ymaps.Placemark([55.7558, 37.6176], {
            hintContent: 'СВАДЬБА!',
            balloonContent: '<strong>ул. Ленина, 12</strong><br>ЗАЛ "Кристалл"<br>18:00 - Церемония'
        }, {
            preset: 'islands#icon',
            iconColor: '#ff69b4'
        });
        
        map.geoObjects.add(placemark);
    });
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    setTimeout(() => notification.classList.remove('show'), 4500);
}

function launchConfetti() {
    confetti({
        particleCount: 80,
        colors: ['#ff69b4', '#d7b9d5', '#f4e4f0'],
        spread: 70,
        origin: { y: 0.6 }
    });
}
