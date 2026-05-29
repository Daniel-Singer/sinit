// ==========================================================================
// sinit · Main JavaScript
// ==========================================================================

// --- Mobile nav toggle -----------------------------------------------------
const hamburger = document.querySelector('.navbar__hamburger');
const drawer    = document.querySelector('.navbar__drawer');

if (hamburger && drawer) {
  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close drawer when a drawer link is clicked
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// --- FAQ accordion ---------------------------------------------------------
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item     = btn.closest('.faq__item');
    const answer   = item.querySelector('.faq__answer');
    const isOpen   = btn.getAttribute('aria-expanded') === 'true';

    // Collapse all
    document.querySelectorAll('.faq__question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.closest('.faq__item').querySelector('.faq__answer').style.maxHeight = '0';
    });

    // Open clicked if it was closed
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// --- Sticky navbar shadow on scroll ----------------------------------------
const navbar = document.querySelector('.navbar');

if (navbar) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: `-${navbar.offsetHeight}px 0px 0px 0px` }
  );

  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;pointer-events:none;';
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}

// --- Smooth scroll for anchor links ----------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = (navbar ? navbar.offsetHeight : 0) + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// --- Cursor dot ------------------------------------------------------------
const cursorDot = document.querySelector('.cursor-dot');

if (cursorDot && window.matchMedia('(hover: hover)').matches) {
  let mouseX = 0, mouseY = 0;
  let dotX   = 0, dotY   = 0;
  const LERP = 0.1; // lower = more lag

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.classList.add('is-active');
  });

  window.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('is-active');
  });

  // Scale up on interactive elements
  const interactives = 'a, button, [role="button"], label, input, textarea, select';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('is-hovering'));
  });

  (function loop() {
    dotX += (mouseX - dotX) * LERP;
    dotY += (mouseY - dotY) * LERP;
    cursorDot.style.transform = `translate(${dotX - 5}px, ${dotY - 5}px)`;
    requestAnimationFrame(loop);
  })();
}

// --- Scroll animations via IntersectionObserver ----------------------------
const animateEls = document.querySelectorAll('.animate-fade-up, .animate-stagger');

if ('IntersectionObserver' in window && animateEls.length) {
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animateEls.forEach(el => scrollObserver.observe(el));
}

// --- Contact form submission (placeholder) ---------------------------------
const contactForm = document.querySelector('.contact__form');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Nachricht gesendet!';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Nachricht senden';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}
