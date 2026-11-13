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

  const refreshStyles = document.createElement("link");
  refreshStyles.rel = "stylesheet";
  refreshStyles.href = "ui-refresh.css?v=profile-cert-fix";
  document.head.appendChild(refreshStyles);

  // Fix certificate URLs (including case-sensitive folder/file naming on GitHub Pages).
  document.querySelectorAll(".certificate-image-link").forEach((link) => {
    const image = link.querySelector("img");
    const certificatePath = "assets/certificates/Certificate.jpeg";
    link.href = certificatePath;
    if (image) {
      image.src = certificatePath;
      image.alt = image.alt || "Abhijeet Tiwari's programming certificate";
      image.loading = "lazy";
      image.addEventListener("error", () => {
        link.hidden = true;
      }, { once: true });
    }
  });
  document.querySelectorAll(".cert-strip, .certificate-showcase").forEach((card) => {
    card.classList.add("certificate-card-fixed");
    card.hidden = false;
    card.classList.add("visible");
  });

  // Profile photo picker: profile.png is the default; uploaded image is local to this browser.
  const profileSection = document.getElementById("profile-picture");
  if (profileSection) {
    const changeButton = profileSection.querySelector(".profile-picture-change");
    const resetButton = profileSection.querySelector(".profile-picture-reset");
    const photoInput = profileSection.querySelector(".profile-picture-input");
    const photoImage = profileSection.querySelector(".profile-avatar-image");
    const fallback = profileSection.querySelector(".profile-avatar-fallback");
    const status = profileSection.querySelector(".profile-picture-status");
    const storageKey = "portfolio-profile-picture-v2";
    const defaultPhoto = "profile.png";

    if (changeButton) {
      changeButton.textContent = "＋ Upload / change photo";
      changeButton.setAttribute("aria-label", "Upload or change profile photo");
      changeButton.addEventListener("click", () => photoInput?.click());
    }
    if (resetButton) resetButton.textContent = "↺ Reset to profile.png";

    const showPhoto = (source, custom) => {
      if (source) {
        photoImage.src = source;
        photoImage.hidden = false;
        fallback.hidden = true;
      } else {
        photoImage.removeAttribute("src");
        photoImage.hidden = true;
        fallback.hidden = false;
      }
      if (resetButton) resetButton.hidden = !custom;
    };

    if (photoImage) {
      photoImage.addEventListener("error", () => {
        if (photoImage.getAttribute("src") === defaultPhoto) {
          photoImage.hidden = true;
          fallback.hidden = false;
          if (status) status.textContent = "Could not load profile.png. Check that the file is in the repository root.";
        }
      });
    }

    photoInput?.addEventListener("change", () => {
      const file = photoInput.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        if (status) status.textContent = "Please choose an image file.";
        photoInput.value = "";
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        if (status) status.textContent = "That image is over 10 MB. Choose a smaller file.";
        photoInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        if (status) status.textContent = "We couldn't read that image. Please try another one.";
        photoInput.value = "";
      };
      reader.onload = () => {
        const source = new Image();
        source.onerror = () => {
          if (status) status.textContent = "That image couldn't be opened. Please try another one.";
          photoInput.value = "";
        };
        source.onload = () => {
          const scale = Math.min(1, 640 / Math.max(source.width, source.height));
          const resized = document.createElement("canvas");
          resized.width = Math.max(1, Math.round(source.width * scale));
          resized.height = Math.max(1, Math.round(source.height * scale));
          const context = resized.getContext("2d");
          if (!context) {
            if (status) status.textContent = "Photo editing isn't supported by this browser.";
            return;
          }
          context.drawImage(source, 0, 0, resized.width, resized.height);
          const photo = resized.toDataURL("image/jpeg", 0.8);
          try {
            localStorage.setItem(storageKey, photo);
            showPhoto(photo, true);
            if (status) status.textContent = "Photo saved on this browser. You can change or reset it anytime.";
          } catch {
            showPhoto(photo, false);
            if (status) status.textContent = "Preview updated, but browser storage is full; try a smaller photo.";
          }
          photoInput.value = "";
        };
        source.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });

    resetButton?.addEventListener("click", () => {
      try { localStorage.removeItem(storageKey); } catch { /* Continue with default photo. */ }
      showPhoto(defaultPhoto, false);
      if (status) status.textContent = "Reset to profile.png.";
    });

    try {
      const saved = localStorage.getItem(storageKey);
      showPhoto(saved || defaultPhoto, Boolean(saved));
    } catch {
      showPhoto(defaultPhoto, false);
    }
  }

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
  try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme;
  } catch { /* The page still works without browser storage. */ }
  updateThemeButtons();
  document.querySelectorAll(".theme").forEach((button) => {
    button.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      updateThemeButtons();
      try { localStorage.setItem("portfolio-theme", root.dataset.theme); } catch { /* Optional preference. */ }
    });
  });

  const revealSite = () => {
    if (site) site.classList.add("ready");
    if (intro) intro.classList.add("done");
  };
  if (enter && intro && site) {
    enter.addEventListener("click", () => {
      revealSite();
      window.setTimeout(() => intro.remove(), 900);
    });
  } else revealSite();

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
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const subject = encodeURIComponent(data.get("subject") || "Portfolio inquiry");
      const body = encodeURIComponent(`Name: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\n\n${data.get("message") || ""}`);
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    });
  }

  if (canvas) {
    const context = canvas.getContext("2d");
    if (context) {
      let stars = [];
      const resizeCanvas = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        stars = Array.from({ length: 75 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, radius: Math.random() * 1.4 + 0.2, speed: Math.random() * 0.8 + 0.04 }));
      };
      const drawStars = () => {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        stars.forEach((star) => {
          context.fillStyle = "rgba(120, 190, 240, 0.7)";
          context.beginPath(); context.arc(star.x, star.y, star.radius, 0, Math.PI * 2); context.fill();
          star.y += star.speed;
          if (star.y > window.innerHeight) star.y = 0;
        });
        window.requestAnimationFrame(drawStars);
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      drawStars();
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
