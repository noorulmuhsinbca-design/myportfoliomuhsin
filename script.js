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

// ─── DYNAMIC PROJECTS RENDER ──────────────────────
function formatImgUrl(url) {
    if (!url) return 'assets/project1.webp';
    if (typeof url === 'string') {
        if (url.startsWith('http://')) return url.replace('http://', 'https://');
    }
    return url;
}

function renderPortfolioProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    const DEFAULT_PROJECTS = [
        {
            title: "Guardian Pharmacy",
            description: "A full-stack pharmacy platform with real-time ordering, prescription management, and doctor booking.",
            link: "https://guardian-pharmacy.vercel.app/",
            image: "assets/project1.webp",
            tags: ["React", "Tailwind", "Node.js"]
        },
        {
            title: "Doctor Prescription Builder",
            description: "A digital prescription platform for doctors — create, save, share and print prescriptions with live preview and patient management.",
            link: "https://guardian-doctor-prescription.vercel.app/",
            image: "assets/project2.webp",
            tags: ["React", "Firebase", "JavaScript"]
        }
    ];

    let projects = DEFAULT_PROJECTS;
    try {
        const stored = localStorage.getItem('portfolio_projects');
        if (stored) {
            projects = JSON.parse(stored);
        }
    } catch (e) {
        projects = DEFAULT_PROJECTS;
    }

    if (!projects || projects.length === 0) return;

    projectsGrid.innerHTML = projects.map((p, index) => {
        const num = String(index + 1).padStart(2, '0');
        const tagsHtml = (p.tags || []).map(t => `<span>${t}</span>`).join('');
        const imagesList = (Array.isArray(p.images) && p.images.length > 0) ? p.images : [p.image || 'assets/project1.webp'];
        const coverImg = formatImgUrl(imagesList[0]);
        const hasMultiple = imagesList.length > 1;

        const galleryControls = hasMultiple ? `
            <div class="gallery-badge" onclick="openLightbox(event, ${index}, 0)"><i class="fas fa-images"></i> ${imagesList.length} Photos</div>
            <div class="project-img-dots">
                ${imagesList.map((_, i) => `
                    <span class="img-dot ${i === 0 ? 'active' : ''}" onclick="switchProjectCardImage(event, ${index}, ${i})"></span>
                `).join('')}
            </div>
        ` : '';

        const hasLink = p.link && p.link !== '#';

        return `
            <article class="project-card reveal visible" data-index="${num}" id="project-card-${index}">
                <div class="project-img-wrap" onclick="openLightbox(event, ${index}, 0)" style="cursor: pointer;" title="Click to view full image gallery">
                    <img src="${coverImg}" alt="${p.title}" class="project-img" id="card-img-${index}" onerror="this.onerror=null;this.src='assets/project1.webp';" />
                    ${galleryControls}
                    <div class="project-overlay">
                        <span class="project-link" style="pointer-events: none;" title="View Gallery">
                            <i class="fas fa-search-plus"></i>
                        </span>
                    </div>
                </div>
                <div class="project-meta">
                    <div class="project-tags">
                        ${tagsHtml}
                    </div>
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                    ${hasLink ? `<a href="${p.link}" class="project-more" target="_blank" rel="noopener">
                        View Project <i class="fas fa-arrow-right"></i>
                    </a>` : ''}
                </div>
            </article>
        `;
    }).join('');

    // Rebind tilt animations
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
}

window.switchProjectCardImage = function (e, projIdx, imgIdx) {
    e.stopPropagation();
    const stored = localStorage.getItem('portfolio_projects');
    if (!stored) return;
    try {
        const projects = JSON.parse(stored);
        const p = projects[projIdx];
        if (!p) return;
        const imagesList = (Array.isArray(p.images) && p.images.length > 0) ? p.images : [p.image];
        const targetImgSrc = imagesList[imgIdx];

        const cardImg = document.getElementById(`card-img-${projIdx}`);
        if (cardImg && targetImgSrc) {
            cardImg.src = targetImgSrc;
        }

        const card = document.getElementById(`project-card-${projIdx}`);
        if (card) {
            const dots = card.querySelectorAll('.img-dot');
            dots.forEach((dot, idx) => {
                if (idx === imgIdx) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }
    } catch (err) {
        console.error(err);
    }
};

/* ─── LIGHTBOX MODAL VIEWER CONTROLLER ──────────────────────────── */
let lightboxState = {
    projIndex: -1,
    imgIndex: 0,
    images: [],
    title: ''
};

window.openLightbox = function (e, projIdx, imgIdx = 0) {
    if (e) e.stopPropagation();
    const stored = localStorage.getItem('portfolio_projects');
    if (!stored) return;
    try {
        const projects = JSON.parse(stored);
        const p = projects[projIdx];
        if (!p) return;

        const imgs = (Array.isArray(p.images) && p.images.length > 0) ? p.images : [p.image || 'assets/project1.webp'];
        lightboxState = {
            projIndex: projIdx,
            imgIndex: imgIdx,
            images: imgs,
            title: p.title || 'Project Image'
        };

        renderLightboxView();

        const modal = document.getElementById('lightboxModal');
        if (modal) modal.classList.add('active');
    } catch (err) {
        console.error(err);
    }
};

function renderLightboxView() {
    const { imgIndex, images, title } = lightboxState;
    const imgEl = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const counterEl = document.getElementById('lightboxCounter');
    const thumbsEl = document.getElementById('lightboxThumbs');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!imgEl) return;

    imgEl.src = images[imgIndex] || 'assets/project1.webp';
    if (titleEl) titleEl.textContent = title;
    if (counterEl) counterEl.textContent = `${imgIndex + 1} / ${images.length}`;

    if (prevBtn) prevBtn.style.display = images.length > 1 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = images.length > 1 ? 'flex' : 'none';

    if (thumbsEl) {
        if (images.length > 1) {
            thumbsEl.style.display = 'flex';
            thumbsEl.innerHTML = images.map((src, i) => `
                <div class="lightbox-thumb-item ${i === imgIndex ? 'active' : ''}" onclick="selectLightboxImage(${i})">
                    <img src="${src}" alt="Thumb ${i + 1}">
                </div>
            `).join('');
        } else {
            thumbsEl.style.display = 'none';
        }
    }
}

window.selectLightboxImage = function (i) {
    lightboxState.imgIndex = i;
    renderLightboxView();
};

window.prevLightboxImage = function () {
    if (lightboxState.images.length <= 1) return;
    lightboxState.imgIndex = (lightboxState.imgIndex - 1 + lightboxState.images.length) % lightboxState.images.length;
    renderLightboxView();
};

window.nextLightboxImage = function () {
    if (lightboxState.images.length <= 1) return;
    lightboxState.imgIndex = (lightboxState.imgIndex + 1) % lightboxState.images.length;
    renderLightboxView();
};

window.closeLightbox = function () {
    const modal = document.getElementById('lightboxModal');
    if (modal) modal.classList.remove('active');
};

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightboxModal');
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') prevLightboxImage();
    else if (e.key === 'ArrowRight') nextLightboxImage();
});

// Click outside modal content to close
document.addEventListener('click', (e) => {
    const modal = document.getElementById('lightboxModal');
    if (modal && e.target === modal) {
        closeLightbox();
    }
});

renderPortfolioProjects();

// ─── PROJECT SHOWCASE SCROLL STRIP ─────────────────
function renderProjectScrollStrip() {
    const track = document.getElementById('pssTrack');
    if (!track) return;

    const DEFAULT_PROJECTS = [
        {
            title: "Guardian Pharmacy",
            images: ["assets/project1.webp"],
            image: "assets/project1.webp",
            tags: ["React", "Tailwind", "Node.js"],
            link: "https://guardian-pharmacy.vercel.app/"
        },
        {
            title: "Doctor Prescription Builder",
            images: ["assets/project2.webp"],
            image: "assets/project2.webp",
            tags: ["React", "Firebase"],
            link: "https://guardian-doctor-prescription.vercel.app/"
        }
    ];

    let projects = DEFAULT_PROJECTS;
    try {
        const stored = localStorage.getItem('portfolio_projects');
        if (stored) projects = JSON.parse(stored);
    } catch (e) {
        projects = DEFAULT_PROJECTS;
    }

    if (!projects || projects.length === 0) {
        document.getElementById('projectShowcaseStrip')?.style.setProperty('display', 'none');
        return;
    }

    // Build a big list of images from all projects (flatten all images)
    const allItems = [];
    projects.forEach((p, pIdx) => {
        const imgs = (Array.isArray(p.images) && p.images.length > 0) ? p.images : [p.image || 'assets/project1.webp'];
        imgs.forEach((src, iIdx) => {
            allItems.push({
                title: p.title,
                tags: p.tags || [],
                src,
                projIdx: pIdx,
                imgIdx: iIdx
            });
        });
    });

    // Duplicate for seamless infinite loop
    const doubled = [...allItems, ...allItems];

    track.innerHTML = doubled.map(item => {
        const tagsHtml = item.tags.slice(0, 3).map(t => `<span>${t}</span>`).join('');
        const safeSrc = formatImgUrl(item.src);
        return `
            <div class="pss-card" onclick="openLightbox(null, ${item.projIdx}, ${item.imgIdx})" title="Click to view ${item.title}">
                <img src="${safeSrc}" alt="${item.title}" loading="lazy" onerror="this.onerror=null;this.src='assets/project1.webp';">
                <div class="pss-card-info">
                    <h4>${item.title}</h4>
                    <div class="pss-card-tags">${tagsHtml}</div>
                </div>
            </div>
        `;
    }).join('');

    // Adjust animation speed based on count
    const speed = Math.max(20, allItems.length * 8);
    track.style.animationDuration = `${speed}s`;
}

renderProjectScrollStrip();



