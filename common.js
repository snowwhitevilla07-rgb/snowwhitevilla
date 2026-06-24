// ===== Mobile nav toggle =====
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ===== Lightbox (used on gallery + home) =====
// LB_IMAGES defaults to the global IMGS array (loaded via images.js).
// Pages may override window.LB_IMAGES before lightbox use if they show a subset.
let cur = 0;
function getLBImages() {
  return (typeof window.LB_IMAGES !== 'undefined' && window.LB_IMAGES) ? window.LB_IMAGES : (typeof IMGS !== 'undefined' ? IMGS : []);
}
function openLB(i) {
  const imgs = getLBImages();
  cur = i;
  document.getElementById('lbImg').src = imgs[i].src;
  document.getElementById('lbCaption').textContent = imgs[i].label;
  document.getElementById('lbCounter').textContent = (i+1) + ' / ' + imgs.length;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLB() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
function lbNav(dir) {
  const imgs = getLBImages();
  cur = (cur + dir + imgs.length) % imgs.length;
  document.getElementById('lbImg').src = imgs[cur].src;
  document.getElementById('lbCaption').textContent = imgs[cur].label;
  document.getElementById('lbCounter').textContent = (cur+1) + ' / ' + imgs.length;
}

document.addEventListener('DOMContentLoaded', () => {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowRight') lbNav(1);
    if (e.key === 'ArrowLeft') lbNav(-1);
  });

  // Scroll fade-up reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

  // Stagger reveal containers
  const obs2 = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.gallery-mosaic, .contact-cards, .location-grid').forEach(el => obs2.observe(el));

  // Gallery mosaic stagger
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    const galleryObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.gm');
          items.forEach((it, idx) => {
            it.style.animationDelay = (idx * 0.04) + 's';
            it.classList.add('visible');
          });
        }
      });
    }, { threshold: 0.1 });
    galleryObs.observe(galleryGrid);
  }

  // Count-up stat numbers
  function countUp(el, target, duration) {
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(0 + (target - 0) * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  const statEls = document.querySelectorAll('.qs-num');
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        const target = parseInt(entry.target.textContent, 10);
        if (!isNaN(target)) countUp(entry.target, target, 900);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObs.observe(el));
});

// ===== Amenities tab switch (amenities page) =====
function switchTab(e, id) {
  document.querySelectorAll('.atab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.atab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  e.target.classList.add('active');
}

// ===== Gallery filter (gallery page) =====
function filterGallery(e, category) {
  document.querySelectorAll('.gfilter').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  document.querySelectorAll('.gm').forEach(item => {
    if (category === 'all' || item.dataset.cat === category) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}
