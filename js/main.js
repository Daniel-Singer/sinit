// ==========================================================================
// sinit · Main JavaScript
// ==========================================================================

// --- Mobile nav toggle -----------------------------------------------------
const hamburger = document.querySelector(".navbar__hamburger");
const drawer = document.querySelector(".navbar__drawer");

if (hamburger && drawer) {
  hamburger.addEventListener("click", () => {
    const isOpen = drawer.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  // Close drawer when a drawer link is clicked
  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      drawer.classList.remove("is-open");
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// --- FAQ accordion ---------------------------------------------------------
document.querySelectorAll(".faq__question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq__item");
    const answer = item.querySelector(".faq__answer");
    const isOpen = btn.getAttribute("aria-expanded") === "true";

    // Collapse all
    document.querySelectorAll(".faq__question").forEach((b) => {
      b.setAttribute("aria-expanded", "false");
      b.closest(".faq__item").querySelector(".faq__answer").style.maxHeight =
        "0";
    });

    // Open clicked if it was closed
    if (!isOpen) {
      btn.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// --- Sticky navbar shadow on scroll ----------------------------------------
const navbar = document.querySelector(".navbar");

if (navbar) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      navbar.classList.toggle("navbar--scrolled", !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: `-${navbar.offsetHeight}px 0px 0px 0px` },
  );

  const sentinel = document.createElement("div");
  sentinel.style.cssText =
    "position:absolute;top:0;height:1px;pointer-events:none;";
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}

// --- Smooth scroll for anchor links ----------------------------------------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = (navbar ? navbar.offsetHeight : 0) + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

// --- Button spotlight fill -------------------------------------------------
document.querySelectorAll(".btn").forEach((btn) => {
  // Wrap existing content so it stays above the fill
  const textSpan = document.createElement("span");
  textSpan.className = "btn__text";
  while (btn.firstChild) textSpan.appendChild(btn.firstChild);
  btn.appendChild(textSpan);

  // Prepend fill so it sits beneath the text wrapper
  const fill = document.createElement("span");
  fill.className = "btn__fill";
  fill.setAttribute("aria-hidden", "true");
  btn.prepend(fill);

  btn.addEventListener("mouseenter", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.sqrt(rect.width ** 2 + rect.height ** 2) * 2;

    fill.style.width = `${size}px`;
    fill.style.height = `${size}px`;
    fill.style.left = `${x - size / 2}px`;
    fill.style.top = `${y - size / 2}px`;
    fill.style.transform = "scale(1)";
  });

  btn.addEventListener("mouseleave", () => {
    fill.style.transform = "scale(0)";
  });
});

// --- Cursor dot ------------------------------------------------------------
const cursorDot = document.querySelector(".cursor-dot");

if (cursorDot && window.matchMedia("(hover: hover)").matches) {
  let mouseX = 0,
    mouseY = 0;
  let dotX = 0,
    dotY = 0;
  const LERP = 0.1; // lower = more lag

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.classList.add("is-active");
  });

  window.addEventListener("mouseleave", () => {
    cursorDot.classList.remove("is-active");
  });

  // Scale up on interactive elements
  const interactives =
    'a, button, [role="button"], label, input, textarea, select';
  document.querySelectorAll(interactives).forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursorDot.classList.add("is-hovering"),
    );
    el.addEventListener("mouseleave", () =>
      cursorDot.classList.remove("is-hovering"),
    );
  });

  (function loop() {
    dotX += (mouseX - dotX) * LERP;
    dotY += (mouseY - dotY) * LERP;
    cursorDot.style.transform = `translate(${dotX - 5}px, ${dotY - 5}px)`;
    requestAnimationFrame(loop);
  })();
}

// --- Scroll animations via IntersectionObserver ----------------------------
const animateEls = document.querySelectorAll(
  ".animate-fade-up, .animate-stagger",
);

if ("IntersectionObserver" in window && animateEls.length) {
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  animateEls.forEach((el) => scrollObserver.observe(el));
}

// --- Cookie consent banner -------------------------------------------------
const cookieBanner = document.getElementById("cookie-banner");
const cookieAccept = document.getElementById("cookie-accept");
const cookieDecline = document.getElementById("cookie-decline");

if (cookieBanner && !localStorage.getItem("cookieConsent")) {
  // Slight delay so the banner slides in after the page settles
  setTimeout(() => cookieBanner.classList.remove("is-hidden"), 600);
}

function dismissCookieBanner(choice) {
  localStorage.setItem("cookieConsent", choice);
  cookieBanner.classList.add("is-hidden");
}

cookieAccept &&
  cookieAccept.addEventListener("click", () => dismissCookieBanner("accepted"));
cookieDecline &&
  cookieDecline.addEventListener("click", () =>
    dismissCookieBanner("declined"),
  );

// --- Contact form submission ------------------------------------------------
const contactForm = document.querySelector(".contact__form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = "Wird gesendet…";
    btn.disabled = true;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactForm.elements["name"].value.trim(),
          email: contactForm.elements["email"].value.trim(),
          subject: contactForm.elements["subject"].value.trim(),
          message: contactForm.elements["message"].value.trim(),
        }),
      });

      if (!res.ok) throw new Error(res.status);

      btn.textContent = "Nachricht gesendet!";
      contactForm.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 4000);
    } catch {
      btn.textContent = "Fehler – bitte erneut versuchen";
      btn.disabled = false;

      setTimeout(() => {
        btn.textContent = originalText;
      }, 4000);
    }
  });
}
