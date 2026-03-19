/* ================================================
   Portfolio — JavaScript
   ================================================ */

// ── Nav scroll state ─────────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Hamburger / Mobile Menu ──────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Intersection Observer — reveal on scroll ─────
const revealItems = document.querySelectorAll('.play-card');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.children];
      const index = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, index * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealItems.forEach(el => revealObserver.observe(el));

// ── Carousel ─────────────────────────────────────
const track       = document.getElementById('carouselTrack');
const prevBtn     = document.getElementById('carouselPrev');
const nextBtn     = document.getElementById('carouselNext');
const dots        = document.querySelectorAll('.carousel-dot');
const currentEl   = document.querySelector('.carousel-current');
const slides      = document.querySelectorAll('.carousel-slide');
const total       = slides.length;
let current       = 0;
let isAnimating   = false;

function goTo(index) {
  if (isAnimating) return;
  isAnimating = true;

  current = (index + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;

  // Update counter
  currentEl.textContent = String(current + 1).padStart(2, '0');

  // Update dots
  dots.forEach((d, i) => d.classList.toggle('active', i === current));

  // Button state (no looping = disable at ends; we loop so always enabled)
  setTimeout(() => { isAnimating = false; }, 650);
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));
dots.forEach(dot => {
  dot.addEventListener('click', () => goTo(+dot.dataset.index));
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  goTo(current - 1);
  if (e.key === 'ArrowRight') goTo(current + 1);
});

// Touch / swipe support
let touchStartX = 0;
track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
});

// ── Skill bar animation ──────────────────────────
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const level = el.getAttribute('data-level');
      setTimeout(() => {
        el.style.width = level + '%';
      }, 200);
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(el => skillObserver.observe(el));

// ── Smooth active nav link ───────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--black)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

// ── Parallax on hero bg text ─────────────────────
const heroBgText = document.querySelector('.hero-bg-text');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (heroBgText) heroBgText.style.transform = `translateY(${sy * 0.15}px)`;
});

// ── Stagger hero name on load ────────────────────
// (handled in CSS via animation-delay, JS ensures it runs after fonts load)
document.fonts.ready.then(() => {
  document.body.classList.add('fonts-loaded');
});
