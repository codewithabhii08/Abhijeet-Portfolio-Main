(() => {
  const root = document.documentElement;
  const intro = document.getElementById("intro");
  const site = document.getElementById("site");
  const menu = document.getElementById("nav");
  const hamburger = document.getElementById("hamb");
  const typed = document.getElementById("typed");
  const year = document.getElementById("year");
  const contactForm = document.getElementById("contactForm");
  const canvas = document.getElementById("stars");
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  const contactEmail = "abhijeettiwari0408@gmail.com";

  // Restore the welcome screen and keep the portfolio hidden until the visitor enters.
  const introStyles = document.createElement("style");
  introStyles.textContent = `
    .site:not(.ready) { visibility: hidden; opacity: 0; pointer-events: none; }
    .site.ready { visibility: visible; opacity: 1; pointer-events: auto; transition: opacity .65s ease; }
    .intro { z-index: 20; }
    .intro-center { display: flex; flex-direction: column; align-items: center; }
    .intro-enter {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      margin-top: 30px; padding: 14px 25px; border: 1px solid rgba(167,139,250,.55);
      border-radius: 999px; background: linear-gradient(120deg,#a78bfa,#67b7ff);
      color: #10101b; font: 700 14px Inter,system-ui,sans-serif; cursor: pointer;
      box-shadow: 0 10px 32px rgba(103,91,200,.25); transition: transform .2s ease, box-shadow .2s ease;
    }
    .intro-enter:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(103,91,200,.38); }
    .intro-enter:focus-visible { outline: 3px solid #fff; outline-offset: 4px; }
    @media(prefers-reduced-motion:reduce) { .site.ready,.intro-enter { transition:none; } }
  `;
  document.head.appendChild(introStyles);

  let enterButton = document.getElementById("enter");
  if (intro && site && !enterButton) {
    enterButton = document.createElement("button");
    enterButton.id = "enter";
    enterButton.type = "button";
    enterButton.className = "intro-enter";
    enterButton.innerHTML = 'Enter to Portfolio <span aria-hidden="true">↗</span>';
    intro.querySelector(".intro-center")?.appendChild(enterButton);
  }

  const revealSite = () => {
    if (site) site.classList.add("ready");
    if (intro) intro.classList.add("done");
  };
  if (enterButton && intro && site) {
    enterButton.addEventListener("click", () => {
      revealSite();
      window.setTimeout(() => intro.remove(), 700);
    }, { once: true });
  } else {
    revealSite();
  }

  // Theme switcher.
  const updateThemeButtons = () => {
    document.querySelectorAll(".theme").forEach((button) => {
      button.textContent = root.dataset.theme === "dark" ? "☼" : "☾";
      button.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  };
  try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme;
  } catch { /* Continue with the default theme if storage is unavailable. */ }
  updateThemeButtons();
  document.querySelectorAll(".theme").forEach((button) => button.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    updateThemeButtons();
    try { localStorage.setItem("portfolio-theme", root.dataset.theme); } catch { /* Theme toggle still works. */ }
  }));

  // Accessible mobile navigation.
  if (menu && hamburger) {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      menu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }));
  }

  // Type animation, if its target exists on the page.
  if (typed) {
    const words = ["Software Development", "Problem Solving", "Web Development", "Programming"];
    let wordIndex = 0, charIndex = 0, deleting = false;
    const type = () => {
      const word = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      typed.textContent = word.slice(0, charIndex);
      let delay = deleting ? 45 : 85;
      if (!deleting && charIndex === word.length) { deleting = true; delay = 1200; }
      else if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 350; }
      window.setTimeout(type, delay);
    };
    type();
  }

  // Animate visible content, but reveal immediately when the browser lacks observer support.
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealElements.forEach((element) => observer.observe(element));
  } else revealElements.forEach((element) => element.classList.add("visible"));

  if (year) year.textContent = String(new Date().getFullYear());

  // Use the requested contact address for mail links and the contact form.
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    const [address, ...query] = link.href.slice(7).split("?");
    if (address) link.href = `mailto:${contactEmail}${query.length ? `?${query.join("?")}` : ""}`;
  });
  if (contactForm) contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(data.get("subject") || "Portfolio inquiry");
    const body = encodeURIComponent(`Name: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\n\n${data.get("message") || ""}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  });

  // Profile photo picker: profile.png is the default; uploads persist in this browser only.
  const profile = document.getElementById("profile-picture");
  if (profile) {
    const change = profile.querySelector(".profile-picture-change");
    const reset = profile.querySelector(".profile-picture-reset");
    const input = profile.querySelector(".profile-picture-input");
    const image = profile.querySelector(".profile-avatar-image");
    const fallback = profile.querySelector(".profile-avatar-fallback");
    const status = profile.querySelector(".profile-picture-status");
    const storageKey = "portfolio-profile-picture-v2";
    const defaultPhoto = "profile.png";
    const showPhoto = (src, custom) => {
      if (src && image) { image.src = src; image.hidden = false; if (fallback) fallback.hidden = true; }
      else { image?.removeAttribute("src"); if (image) image.hidden = true; if (fallback) fallback.hidden = false; }
      if (reset) reset.hidden = !custom;
    };
    if (change && input) {
      change.textContent = "＋ Upload / change photo";
      change.addEventListener("click", () => input.click());
    }
    if (reset) reset.textContent = "↺ Reset to original photo";
    image?.addEventListener("error", () => {
      if (image.getAttribute("src") === defaultPhoto) {
        image.hidden = true; if (fallback) fallback.hidden = false;
        if (status) status.textContent = "Could not load profile.png. Check the deployed site files.";
      }
    });
    input?.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
        if (status) status.textContent = file.type.startsWith("image/") ? "Image is over 10 MB; choose a smaller one." : "Please choose an image file.";
        input.value = ""; return;
      }
      const reader = new FileReader();
      reader.onerror = () => { if (status) status.textContent = "Could not read the image. Please try another."; };
      reader.onload = () => {
        const source = new Image();
        source.onload = () => {
          const scale = Math.min(1, 720 / Math.max(source.width, source.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(source.width * scale));
          canvas.height = Math.max(1, Math.round(source.height * scale));
          const context = canvas.getContext("2d");
          if (!context) return;
          context.drawImage(source, 0, 0, canvas.width, canvas.height);
          const data = canvas.toDataURL("image/jpeg", 0.82);
          try { localStorage.setItem(storageKey, data); showPhoto(data, true); if (status) status.textContent = "Photo saved in this browser."; }
          catch { showPhoto(data, false); if (status) status.textContent = "Preview updated, but browser storage is full."; }
          input.value = "";
        };
        source.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
    reset?.addEventListener("click", () => {
      try { localStorage.removeItem(storageKey); } catch { /* Restore visible default anyway. */ }
      showPhoto(defaultPhoto, false);
      if (status) status.textContent = "Restored your original profile photo.";
    });
    try { const saved = localStorage.getItem(storageKey); showPhoto(saved || defaultPhoto, Boolean(saved)); }
    catch { showPhoto(defaultPhoto, false); }
  }

  // Animate the background stars.
  if (canvas) {
    const context = canvas.getContext("2d");
    if (context) {
      let stars = [];
      const resizeCanvas = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * ratio; canvas.height = window.innerHeight * ratio;
        canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        stars = Array.from({ length: 75 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, radius: Math.random() * 1.4 + 0.2, speed: Math.random() * 0.8 + 0.04 }));
      };
      const draw = () => {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        stars.forEach((star) => { context.fillStyle = "rgba(120,190,240,.7)"; context.beginPath(); context.arc(star.x, star.y, star.radius, 0, Math.PI * 2); context.fill(); star.y += star.speed; if (star.y > window.innerHeight) star.y = 0; });
        window.requestAnimationFrame(draw);
      };
      resizeCanvas(); window.addEventListener("resize", resizeCanvas); draw();
    }
  }

  if (cursorDot && cursorRing && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (event) => {
      cursorDot.style.left = `${event.clientX}px`; cursorDot.style.top = `${event.clientY}px`;
      cursorRing.style.left = `${event.clientX}px`; cursorRing.style.top = `${event.clientY}px`;
    });
    document.querySelectorAll("a, button").forEach((element) => {
      element.addEventListener("mouseenter", () => { cursorRing.style.width = "48px"; cursorRing.style.height = "48px"; });
      element.addEventListener("mouseleave", () => { cursorRing.style.width = "30px"; cursorRing.style.height = "30px"; });
    });
  }
})();
