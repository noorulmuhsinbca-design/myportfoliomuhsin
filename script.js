/* ─────────────────────────────────────────────
   Portfolio Script — Noorul Muhsin
   ───────────────────────────────────────────── */

// ─── LOADER ────────────────────────────────────
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader')?.classList.add('hidden');
    }, 1700);
});

// ─── CUSTOM CURSOR ──────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (cursor && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    (function animateFollower() {
        fx += (mouseX - fx) * 0.1;
        fy += (mouseY - fy) * 0.1;
        cursorFollower.style.left = fx + 'px';
        cursorFollower.style.top = fy + 'px';
        requestAnimationFrame(animateFollower);
    })();
}

// ─── THEME TOGGLE ──────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'sunny') {
    body.classList.add('sunny-theme');
}

themeToggle?.addEventListener('click', () => {
    body.classList.toggle('sunny-theme');
    const isSunny = body.classList.contains('sunny-theme');
    localStorage.setItem('theme', isSunny ? 'sunny' : 'dark');

    // Impactful visual feedback
    themeToggle.style.transform = 'scale(0.8) rotate(45deg)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 200);
});

// ─── NAVBAR SCROLL ─────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── HAMBURGER MENU ────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // animate hamburger spans
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
});

// Close mobile menu on link click
document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
});

// ─── REVEAL ON SCROLL ──────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealOpts = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // stagger children
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, revealOpts);

revealEls.forEach(el => revealObserver.observe(el));

// ─── ACTIVE NAV LINK ────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            active?.classList.add('active');
        }
    });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

// ─── CONTACT FORM ───────────────────────────────
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');

form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = sendBtn;
    const span = btn.querySelector('span');
    const icon = btn.querySelector('i');

    const formData = new FormData(form);
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'New'
    };

    // Loading state
    span.textContent = 'Sending…';
    icon.className = 'fas fa-spinner fa-spin';
    btn.disabled = true;

    // Save to localStorage for Admin Dashboard
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.unshift(data);
    localStorage.setItem('messages', JSON.stringify(messages));

    // Manually trigger storage event for same-page listeners (if admin is open in another tab)
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
        span.textContent = 'Message Sent!';
        icon.className = 'fas fa-check';
        btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';

        setTimeout(() => {
            span.textContent = 'Send Message';
            icon.className = 'fas fa-paper-plane';
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 3000);
    }, 1200);
});

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── SKILL TILES HOVER GLOW ────────────────────
document.querySelectorAll('.skill-tile').forEach(tile => {
    tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        tile.style.setProperty('--gx', x + '%');
        tile.style.setProperty('--gy', y + '%');
    });
});

// ─── PROJECT CARD TILT ─────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        card.style.transform = `translateY(-6px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ─── HIRE ME BUTTON MAGNETIC ────────────────────
const hireMeBtn = document.getElementById('hireMeBtn');
if (hireMeBtn) {
    hireMeBtn.addEventListener('mousemove', (e) => {
        const rect = hireMeBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        hireMeBtn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    hireMeBtn.addEventListener('mouseleave', () => {
        hireMeBtn.style.transform = '';
    });
}

// ─── VISITOR COUNTER ────────────────────────────
(async function trackVisitors() {
    // Only count unique visits per session
    if (!sessionStorage.getItem('pageVisited')) {
        try {
            await fetch('https://api.counterapi.dev/v1/noorulmuhsin/portfolio/up');
            sessionStorage.setItem('pageVisited', 'true');
        } catch (err) {
            console.error('Counter error:', err);
        }
    }
})();
