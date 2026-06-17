

/* =============================================
   WINTER GALLERY — script.js
   ============================================= */

/* ---------- Snowflakes ---------- */
(function(){
  const container = document.getElementById('snowflakes');
  if(!container) return;
  const symbols = ['❄','❅','❆','*'];
  for(let i=0;i<22;i++){
    const el = document.createElement('div');
    el.className = 'snowflake';
    el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    const size = 0.7 + Math.random()*1.2;
    el.style.cssText = [
      'left:' + (Math.random()*100) + '%',
      'font-size:' + size + 'rem',
      'animation-duration:' + (6+Math.random()*10) + 's',
      'animation-delay:' + (Math.random()*10) + 's',
      'opacity:' + (0.2+Math.random()*0.5)
    ].join(';');
    container.appendChild(el);
  }
})();

/* ---------- Navbar ---------- */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 60
    ? '0 4px 24px rgba(44,62,80,0.15)'
    : '0 2px 16px rgba(44,62,80,0.07)';
  highlightNav();
  toggleScrollTop();
});

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  const s = navToggle.querySelectorAll('span');
  s[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)'  : '';
  s[1].style.opacity   = isOpen ? '0' : '';
  s[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    const s = navToggle.querySelectorAll('span');
    s[0].style.transform = s[2].style.transform = '';
    s[1].style.opacity = '';
  });
});

function highlightNav(){
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;
  sections.forEach(sec => {
    if(scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight){
      navLinks.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if(a) a.classList.add('active');
    }
  });
}

/* ---------- Hero Slideshow ---------- */
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.dot');
let cur = 0, timer;

function goTo(n){
  slides[cur].classList.remove('active');
  dots[cur].classList.remove('active');
  cur = (n + slides.length) % slides.length;
  slides[cur].classList.add('active');
  dots[cur].classList.add('active');
}
function startSlider(){ timer = setInterval(() => goTo(cur+1), 5200); }

dots.forEach(d => d.addEventListener('click', () => {
  clearInterval(timer);
  goTo(parseInt(d.dataset.slide));
  startSlider();
}));
startSlider();

/* ---------- Gallery Filter ---------- */
const filterBtns   = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    galleryItems.forEach(item => {
      const match = f === 'all' || item.dataset.category === f;
      item.classList.toggle('hidden', !match);
      if(match){
        item.style.animation = 'none';
        item.offsetHeight;
        item.style.animation = 'fadeInUp 0.42s ease forwards';
      }
    });
  });
});

/* ---------- Lightbox ---------- */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbCounter = document.getElementById('lbCounter');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');
let lbIdx = 0, visible = [];

function getVisible(){ return Array.from(galleryItems).filter(i => !i.classList.contains('hidden')); }

function openLb(idx){
  visible = getVisible();
  lbIdx   = idx;
  renderLb();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderLb(){
  const item = visible[lbIdx];
  lbImg.src  = item.querySelector('img').src;
  lbImg.alt  = item.querySelector('img').alt;
  const cap  = item.querySelector('.gallery-overlay p');
  lbCaption.textContent = cap ? cap.textContent : '';
  lbCounter.textContent = (lbIdx+1) + ' / ' + visible.length;
}

function closeLb(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    visible = getVisible();
    const i = visible.indexOf(item);
    if(i !== -1) openLb(i);
  });
});

lbClose.addEventListener('click', closeLb);
lbPrev.addEventListener('click',  () => { lbIdx = (lbIdx-1+visible.length)%visible.length; renderLb(); });
lbNext.addEventListener('click',  () => { lbIdx = (lbIdx+1)%visible.length; renderLb(); });
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLb(); });

document.addEventListener('keydown', e => {
  if(!lightbox.classList.contains('open')) return;
  if(e.key==='ArrowLeft')  { lbIdx=(lbIdx-1+visible.length)%visible.length; renderLb(); }
  if(e.key==='ArrowRight') { lbIdx=(lbIdx+1)%visible.length; renderLb(); }
  if(e.key==='Escape')     { closeLb(); }
});

/* ---------- Skill Bars ---------- */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const skillList = document.querySelector('.skill-list');
if(skillList) skillObserver.observe(skillList);

/* ---------- Scroll Animations ---------- */
const animateEls = document.querySelectorAll(
  '.about-grid, .stat-box, .service-item, .contact-grid, .section-header, .gallery-item, .quote-inner'
);
const aObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
      aObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

animateEls.forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(28px)';
  el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  aObserver.observe(el);
});

/* ---------- Contact Form ---------- */
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
form.addEventListener('submit', e => {
  e.preventDefault();
  success.classList.add('show');
  form.reset();
  setTimeout(() => success.classList.remove('show'), 5500);
});

/* ---------- Scroll To Top ---------- */
const scrollTopBtn = document.getElementById('scrollTop');
function toggleScrollTop(){ scrollTopBtn.classList.toggle('show', window.scrollY > 500); }
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

/* ---------- Inject Keyframes ---------- */
const s = document.createElement('style');
s.textContent = `
  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;
document.head.appendChild(s);
