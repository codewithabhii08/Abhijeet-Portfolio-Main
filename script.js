(() => {
  const root = document.documentElement;
  const intro = document.getElementById("intro");
  const site = document.getElementById("site");
  const enter = document.getElementById("enter");
  const menu = document.getElementById("nav");
  const hamburger = document.getElementById("hamb");
  const typed = document.getElementById("typed");
  const year = document.getElementById("year");
  const contactForm = document.getElementById("contactForm");
  const canvas = document.getElementById("stars");
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  const contactEmail = "abhijeettiwari0408@gmail.com";

  // Load newer styling so a deployed/static page won't keep using a stale browser cache.
  const refreshStyles = document.createElement("link");
  refreshStyles.rel = "stylesheet";
  refreshStyles.href = "ui-refresh.css?v=interview-layout-2";
  document.head.appendChild(refreshStyles);

  // A real Enter button is required before revealing the portfolio.
  const introCenter = intro?.querySelector(".intro-center");
  let enterButton = enter || document.getElementById("enter");
  if (intro && site && introCenter && !enterButton) {
    enterButton = document.createElement("button");
    enterButton.id = "enter";
    enterButton.type = "button";
    enterButton.className = "intro-enter";
    enterButton.innerHTML = 'Enter to Portfolio <span aria-hidden="true">↗</span>';
    introCenter.appendChild(enterButton);
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

  // Style tech-stack heading and its description on one line on desktop, stacked on mobile.
  const skillsHeadingStyles = document.createElement("style");
  skillsHeadingStyles.textContent = `
    #skills > .section-head { display:grid; grid-template-columns:minmax(0,1fr) minmax(260px,.82fr); align-items:end; column-gap:clamp(28px,5vw,64px); row-gap:10px; max-width:930px; margin-bottom:30px; }
    #skills > .section-head > .mono { grid-column:1/-1; margin:0 0 4px; }
    #skills > .section-head > h2 { grid-column:1; grid-row:2; margin:0; font-size:clamp(28px,3.5vw,40px); line-height:1.16; }
    #skills > .section-head > p:last-child { grid-column:2; grid-row:2; align-self:center; max-width:390px; margin:0; font-size:15px; line-height:1.7; }
    @media(max-width:680px) { #skills > .section-head { grid-template-columns:minmax(0,1fr); row-gap:8px; } #skills > .section-head > .mono,#skills > .section-head > h2,#skills > .section-head > p:last-child { grid-column:1; grid-row:auto; } #skills > .section-head > h2 { font-size:clamp(27px,8vw,34px); } #skills > .section-head > p:last-child { max-width:100%; font-size:14px; } }
  `;
  document.head.appendChild(skillsHeadingStyles);

  // Correct the case-sensitive certificate path and retain a useful link if preview fails.
  document.querySelectorAll(".certificate-image-link").forEach((link) => {
    const image = link.querySelector("img");
    const certificatePath = "assets/certificates/Certificate.jpeg";
    link.href = certificatePath;
    link.target = "_blank";
    link.rel = "noopener";
    if (!image) return;
    image.src = certificatePath;
    image.alt = "Abhijeet Tiwari's programming certificate";
    image.addEventListener("error", () => {
      link.classList.add("certificate-image-unavailable");
      if (!link.querySelector(".certificate-image-fallback")) {
        const fallbackLink = document.createElement("span");
        fallbackLink.className = "certificate-image-fallback";
        fallbackLink.textContent = "Open certificate ↗";
        link.appendChild(fallbackLink);
      }
    }, { once: true });
  });

  // Compact social-style avatar, with upload/reset controls remaining beside it.
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
      if (!change.dataset.photoBound) { change.addEventListener("click", () => input.click()); change.dataset.photoBound = "true"; }
    }
    if (reset) reset.textContent = "↺ Reset to original photo";
    image?.addEventListener("error", () => {
      if (image.getAttribute("src") === defaultPhoto) {
        image.hidden = true; if (fallback) fallback.hidden = false;
        if (status) status.textContent = "Could not load profile.png. Check the deployed site files.";
      }
    });
    if (input && !input.dataset.photoBound) {
      input.addEventListener("change", () => {
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
            const resized = document.createElement("canvas");
            resized.width = Math.max(1, Math.round(source.width * scale));
            resized.height = Math.max(1, Math.round(source.height * scale));
            const context = resized.getContext("2d");
            if (!context) return;
            context.drawImage(source, 0, 0, resized.width, resized.height);
            const photo = resized.toDataURL("image/jpeg", 0.82);
            try { localStorage.setItem(storageKey, photo); showPhoto(photo, true); if (status) status.textContent = "Photo saved in this browser."; }
            catch { showPhoto(photo, false); if (status) status.textContent = "Preview updated, but browser storage is full."; }
            input.value = "";
          };
          source.src = String(reader.result);
        };
        reader.readAsDataURL(file);
      });
      input.dataset.photoBound = "true";
    }
    if (reset && !reset.dataset.photoBound) {
      reset.addEventListener("click", () => {
        try { localStorage.removeItem(storageKey); } catch { /* Restore visible default anyway. */ }
        showPhoto(defaultPhoto, false);
        if (status) status.textContent = "Restored your original profile photo.";
      });
      reset.dataset.photoBound = "true";
    }
    try { const saved = localStorage.getItem(storageKey); showPhoto(saved || defaultPhoto, Boolean(saved)); }
    catch { showPhoto(defaultPhoto, false); }
  }

  // Normalize contact links to the requested address.
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    const [address, ...query] = link.href.slice(7).split("?");
    if (address) link.href = `mailto:${contactEmail}${query.length ? `?${query.join("?")}` : ""}`;
  });

  const updateThemeButtons = () => {
    document.querySelectorAll(".theme").forEach((button) => {
      button.textContent = root.dataset.theme === "dark" ? "☼" : "☾";
      button.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  };
  try { const savedTheme = localStorage.getItem("portfolio-theme"); if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme; } catch { /* Optional preference. */ }
  updateThemeButtons();
  document.querySelectorAll(".theme").forEach((button) => button.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    updateThemeButtons();
    try { localStorage.setItem("portfolio-theme", root.dataset.theme); } catch { /* Toggle still works without storage. */ }
  }));

  if (menu && hamburger) {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.addEventListener("click", () => { const open = menu.classList.toggle("open"); hamburger.setAttribute("aria-expanded", String(open)); });
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { menu.classList.remove("open"); hamburger.setAttribute("aria-expanded", "false"); }));
  }

  if (typed) {
    const words = ["Software Development", "Problem Solving", "Web Development", "Programming"];
    let wordIndex = 0, charIndex = 0, deleting = false;
    const type = () => {
      const word = words[wordIndex]; charIndex += deleting ? -1 : 1; typed.textContent = word.slice(0, charIndex);
      let delay = deleting ? 45 : 85;
      if (!deleting && charIndex === word.length) { deleting = true; delay = 1200; }
      else if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 350; }
      window.setTimeout(type, delay);
    };
    type();
  }

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealElements.forEach((element) => observer.observe(element));
  } else revealElements.forEach((element) => element.classList.add("visible"));

  if (year) year.textContent = String(new Date().getFullYear());
  if (contactForm) contactForm.addEventListener("submit", (event) => {
    event.preventDefault(); const data = new FormData(contactForm);
    const subject = encodeURIComponent(data.get("subject") || "Portfolio inquiry");
    const body = encodeURIComponent(`Name: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\n\n${data.get("message") || ""}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  });

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
