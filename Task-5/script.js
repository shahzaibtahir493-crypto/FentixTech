/* =============================================
   WINTER GALLERY — script.js
   ============================================= */

/* ---------- Navbar: scroll + toggle ---------- */
const navbar   = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu  = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky shadow on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.boxShadow = '0 4px 24px rgba(44,62,80,0.13)';
  } else {
    navbar.style.boxShadow = '0 2px 16px rgba(44,62,80,0.07)';
  }
  highlightNav();
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  // Animate hamburger lines
  const spans = navToggle.querySelectorAll('span');
  if (navMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// Active link highlight on scroll
function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

/* ---------- Hero Slideshow ---------- */
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.dot');
let current  = 0;
let slideInterval;

function goToSlide(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function nextSlide() { goToSlide(current + 1); }

function startSlider() {
  slideInterval = setInterval(nextSlide, 5000);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(slideInterval);
    goToSlide(parseInt(dot.dataset.slide));
    startSlider();
  });
});

startSlider();

/* ---------- Gallery Filter ---------- */
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
        // Animate in
        item.style.animation = 'none';
        item.offsetHeight; // reflow
        item.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ---------- Lightbox ---------- */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');

let lbIndex = 0;
let visibleItems = [];

function openLightbox(index) {
  visibleItems = Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));
  lbIndex = index;
  showLbImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLbImage() {
  const item   = visibleItems[lbIndex];
  const img    = item.querySelector('img');
  const caption = item.querySelector('.gallery-overlay p');
  lbImg.src           = img.src;
  lbImg.alt           = img.alt;
  lbCaption.textContent = caption ? caption.textContent : '';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// Click gallery items
galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    visibleItems = Array.from(galleryItems).filter(gi => !gi.classList.contains('hidden'));
    const visibleIndex = visibleItems.indexOf(item);
    if (visibleIndex !== -1) openLightbox(visibleIndex);
  });
});

lbClose.addEventListener('click', closeLightbox);

lbPrev.addEventListener('click', () => {
  lbIndex = (lbIndex - 1 + visibleItems.length) % visibleItems.length;
  showLbImage();
});

lbNext.addEventListener('click', () => {
  lbIndex = (lbIndex + 1) % visibleItems.length;
  showLbImage();
});

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + visibleItems.length) % visibleItems.length; showLbImage(); }
  if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % visibleItems.length; showLbImage(); }
  if (e.key === 'Escape')     { closeLightbox(); }
});

/* ---------- Contact Form ---------- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.classList.add('show');
  contactForm.reset();
  setTimeout(() => formSuccess.classList.remove('show'), 5000);
});

/* ---------- Fade-in animation on scroll ---------- */
const animateEls = document.querySelectorAll(
  '.about-grid, .stat-box, .contact-grid, .section-header, .gallery-item, .quote-section blockquote'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

animateEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

/* ---------- CSS keyframes injected via JS ---------- */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
