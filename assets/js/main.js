/* ==========================================================================
   OLEA — main.js
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.querySelector('.hero').classList.add('is-ready');
    }, 500);
  });
  // fallback in case load already fired
  setTimeout(() => { loader && loader.classList.add('hidden'); document.querySelector('.hero')?.classList.add('is-ready'); }, 2200);

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('progress');
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progress) progress.style.width = scrolled + '%';

    // nav
    const nav = document.querySelector('header.nav');
    if (nav) nav.classList.toggle('scrolled', h.scrollTop > 40);

    // back to top
    const top = document.querySelector('.fab.top');
    if (top) top.classList.toggle('show', h.scrollTop > 700);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu-close');
  burger?.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const decimals = el.dataset.count.includes('.') ? 1 : 0;
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterIO.observe(c));

  /* ---------- Menu item enrichment: icons, chef picks, prep time/calories, wine pairing ---------- */
  const dietaryIcons = {
    'Vegetarian': '🌿', 'Vegan': '🌱', 'Gluten-Free': '✦', 'Halal Option': '☾',
    'Signature': '★', 'Sharing': '⟡', 'Kids': '✳', 'Non-Alcoholic': '◇',
    'Caffeine-Free': '◈', '21+': '◆', 'Pairing Guide': '⚘'
  };
  const winePairings = ['Santorini Assyrtiko', 'Nemea Agiorgitiko Reserve', 'Grande Maison Champagne Brut', "Sommelier's Pairing Flight"];
  const hashStr = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

  document.querySelectorAll('.menu-item').forEach((item) => {
    const nameEl = item.querySelector('.menu-item-top h4');
    if (!nameEl) return;
    const name = nameEl.textContent.trim();
    const h = hashStr(name);

    // dietary icons
    item.querySelectorAll('.menu-tags span').forEach(tagEl => {
      const label = tagEl.textContent.trim();
      if (dietaryIcons[label]) tagEl.textContent = `${dietaryIcons[label]} ${label}`;
    });

    // chef pick flag for Signature items
    const isSignature = Array.from(item.querySelectorAll('.menu-tags span')).some(t => t.textContent.includes('Signature'));
    const body = item.querySelector('.menu-item-body');
    if (isSignature && body) {
      const flag = document.createElement('div');
      flag.className = 'chefpick-flag';
      flag.innerHTML = '★ Chef\'s Recommendation';
      body.insertBefore(flag, body.firstChild);
    }

    // prep time + calories (deterministic, not random on reload)
    const prep = 8 + (h % 24);
    const cals = 220 + (h % 480);
    const meta = document.createElement('div');
    meta.className = 'menu-meta';
    meta.innerHTML = `
      <span>⏱ ${prep} min prep</span>
      <span>◐ ${cals} kcal (approx.)</span>
    `;
    item.querySelector('p')?.after(meta);

    // wine pairing for mains
    const panel = item.closest('.menu-panel');
    const isMain = panel && ['panel-signature', 'panel-seafood', 'panel-steaks', 'panel-pasta'].includes(panel.id);
    if (isMain) {
      const wine = winePairings[h % winePairings.length];
      const pairing = document.createElement('div');
      pairing.className = 'wine-pairing';
      pairing.innerHTML = `🍷 Pairs with ${wine}`;
      meta.after(pairing);
    }
  });

  /* ---------- Wallet / save / share buttons (placeholders) ---------- */
  document.getElementById('appleWalletBtn')?.addEventListener('click', (e) => {
    e.currentTarget.querySelector('span').textContent = 'Added ✓';
    setTimeout(() => e.currentTarget.querySelector('span').textContent = 'Apple Wallet', 2200);
  });
  document.getElementById('googleWalletBtn')?.addEventListener('click', (e) => {
    e.currentTarget.querySelector('span').textContent = 'Added ✓';
    setTimeout(() => e.currentTarget.querySelector('span').textContent = 'Google Wallet', 2200);
  });
  ['saveMenuBtn', 'shareMenuBtn', 'downloadMenuBtn', 'downloadMenuBtn2', 'allergenBtn'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      e.preventDefault();
      const span = e.currentTarget.querySelector('span');
      const original = span.textContent;
      span.textContent = id.includes('save') ? 'Saved ✓' : id.includes('share') ? 'Link Copied ✓' : 'Ready ✓';
      setTimeout(() => span.textContent = original, 2200);
    });
  });

  /* ---------- Hero parallax on mouse move ---------- */
  const heroSection = document.querySelector('.hero');
  const heroBgWrap = document.querySelector('.hero-bg');
  if (heroSection && heroBgWrap) {
    let mx = 0, my = 0;
    const applyParallax = () => {
      const sy = Math.min(window.scrollY, window.innerHeight) * 0.22;
      heroBgWrap.style.transform = `translate(${mx}px, ${my - sy}px)`;
    };
    if (window.matchMedia('(pointer:fine)').matches) {
      heroSection.addEventListener('mousemove', (e) => {
        const r = heroSection.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * -16;
        my = ((e.clientY - r.top) / r.height - 0.5) * -10;
        applyParallax();
      });
      heroSection.addEventListener('mouseleave', () => { mx = 0; my = 0; applyParallax(); });
    }
    window.addEventListener('scroll', applyParallax, { passive: true });
  }

  /* ---------- Menu tabs ---------- */
  const tabs = document.querySelectorAll('.menu-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + tab.dataset.tab)?.classList.add('active');
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null; });
      if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---------- Testimonials carousel ---------- */
  const track = document.querySelector('.test-track');
  if (track) {
    const cards = track.children.length;
    let visible = window.innerWidth < 620 ? 1 : window.innerWidth < 900 ? 2 : 3;
    let index = 0;
    const move = () => {
      visible = window.innerWidth < 620 ? 1 : window.innerWidth < 900 ? 2 : 3;
      const max = Math.max(cards - visible, 0);
      index = Math.min(index, max);
      const pct = (100 / visible) * index;
      track.style.transform = `translateX(-${pct}%)`;
    };
    document.querySelector('.test-controls .next')?.addEventListener('click', () => {
      const max = Math.max(cards - visible, 0);
      index = index >= max ? 0 : index + 1;
      move();
    });
    document.querySelector('.test-controls .prev')?.addEventListener('click', () => {
      const max = Math.max(cards - visible, 0);
      index = index <= 0 ? max : index - 1;
      move();
    });
    window.addEventListener('resize', move);
  }

  /* ---------- Gallery lightbox ---------- */
  const galleryImgs = Array.from(document.querySelectorAll('.gallery-item img'));
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  let lbIndex = 0;
  const openLightbox = (i) => {
    lbIndex = i;
    lightboxImg.src = galleryImgs[i].src;
    lightboxImg.alt = galleryImgs[i].alt;
    lightbox.classList.add('open');
  };
  galleryImgs.forEach((img, i) => img.closest('.gallery-item').addEventListener('click', () => openLightbox(i)));
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  lightbox?.querySelector('.next')?.addEventListener('click', () => openLightbox((lbIndex + 1) % galleryImgs.length));
  lightbox?.querySelector('.prev')?.addEventListener('click', () => openLightbox((lbIndex - 1 + galleryImgs.length) % galleryImgs.length));
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowRight') openLightbox((lbIndex + 1) % galleryImgs.length);
    if (e.key === 'ArrowLeft') openLightbox((lbIndex - 1 + galleryImgs.length) % galleryImgs.length);
  });

  /* ---------- Reservation form ---------- */
  const form = document.getElementById('reservation-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('res-name').value || 'Guest';
    form.style.display = 'none';
    const success = document.querySelector('.reserve-success');
    success.classList.add('show');
    const dateVal = document.getElementById('res-date').value;
    const timeVal = document.getElementById('res-time').value;
    const guestsVal = document.getElementById('res-guests').value;
    const tableVal = document.getElementById('res-table')?.value;
    const occasionVal = document.getElementById('res-occasion')?.value;
    let detail = `A member of our maître d' team will confirm your table for ${guestsVal || '2'} guest(s)` +
      (dateVal ? ` on ${dateVal}` : '') + (timeVal ? ` at ${timeVal}` : '') + `.`;
    if (tableVal && tableVal !== 'No Preference') detail += ` We'll do our best to seat you at ${tableVal}.`;
    if (occasionVal && occasionVal !== 'Just Dining') detail += ` We've noted this is for a ${occasionVal.toLowerCase()} — we'll make sure it feels that way.`;
    detail += ` A confirmation has been sent to your email, ${name.split(' ')[0]}.`;
    document.getElementById('success-detail').textContent = detail;
  });
  document.querySelector('.reserve-again')?.addEventListener('click', () => {
    document.querySelector('.reserve-success').classList.remove('show');
    form.reset();
    form.style.display = 'block';
  });

  /* ---------- Newsletter ---------- */
  document.querySelectorAll('.newsletter').forEach(nl => {
    nl.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = nl.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      nl.querySelector('input').value = '';
      setTimeout(() => btn.textContent = original, 2500);
    });
  });

  /* ---------- Cookie consent ---------- */
  const cookie = document.querySelector('.cookie');
  if (cookie && !localStorage.getItem('olea-cookie-consent')) {
    setTimeout(() => cookie.classList.add('show'), 1400);
  }
  document.querySelectorAll('[data-cookie]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('olea-cookie-consent', btn.dataset.cookie);
      cookie.classList.remove('show');
    });
  });

  /* ---------- Back to top ---------- */
  document.querySelector('.fab.top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Utility dropdowns (language / currency) ---------- */
  document.querySelectorAll('.util-select').forEach(sel => {
    const btn = sel.querySelector('button');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.util-select').forEach(s => { if (s !== sel) s.classList.remove('open'); });
      sel.classList.toggle('open');
    });
    sel.querySelectorAll('.dd button').forEach(opt => {
      opt.addEventListener('click', () => {
        btn.querySelector('.val').textContent = opt.textContent;
        sel.classList.remove('open');
      });
    });
  });
  document.addEventListener('click', () => document.querySelectorAll('.util-select').forEach(s => s.classList.remove('open')));

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = 'translate(0,0)');
  });

  /* ---------- Card tilt (signature experience cards) ---------- */
  document.querySelectorAll('.exp-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = 'perspective(800px) rotateY(0) rotateX(0)');
  });

  /* ---------- Smooth anchor scroll (accounting for fixed nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ---------- Year in footer ---------- */
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

});
