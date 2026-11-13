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
  refreshStyles.href = "ui-refresh.css";
  document.head.appendChild(refreshStyles);

  const profileSection = document.getElementById("profile-picture");
  const setupProfilePhotoEditor = (section) => {
    if (!section) return;

    const changeButton = section.querySelector(".profile-picture-change");
    const resetButton = section.querySelector(".profile-picture-reset");
    const photoInput = section.querySelector(".profile-picture-input");
    const photoImage = section.querySelector(".profile-avatar-image");
    const fallback = section.querySelector(".profile-avatar-fallback");
    const status = section.querySelector(".profile-picture-status");
    // Use the profile.png file already included at the repository root as the default photo.
    const storageKey = "portfolio-profile-picture-v2";
    const defaultPhoto = "profile.png";

    const showPhoto = (source, isCustom) => {
      if (source) {
        photoImage.src = source;
        photoImage.hidden = false;
        fallback.hidden = true;
      } else {
        photoImage.removeAttribute("src");
        photoImage.hidden = true;
        fallback.hidden = false;
      }
      if (resetButton) resetButton.hidden = !isCustom;
    };

    if (changeButton && photoInput) {
      changeButton.addEventListener("click", () => photoInput.click());
    }

    if (photoInput) {
      photoInput.addEventListener("change", () => {
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
            const maxDimension = 640;
            const scale = Math.min(1, maxDimension / Math.max(source.width, source.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(source.width * scale));
            canvas.height = Math.max(1, Math.round(source.height * scale));
            const context = canvas.getContext("2d");

            if (!context) {
              if (status) status.textContent = "Photo editing isn't supported by this browser.";
              return;
            }

            context.drawImage(source, 0, 0, canvas.width, canvas.height);
            const compressedPhoto = canvas.toDataURL("image/jpeg", 0.82);

            try {
              localStorage.setItem(storageKey, compressedPhoto);
              showPhoto(compressedPhoto, true);
              if (status) status.textContent = "Profile photo saved in this browser. You can change it anytime.";
            } catch {
              showPhoto(compressedPhoto, false);
              if (status) status.textContent = "Photo preview updated, but browser storage is full. Try a smaller image.";
            }
            photoInput.value = "";
          };

          source.src = String(reader.result);
        };

        reader.readAsDataURL(file);
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        try {
          localStorage.removeItem(storageKey);
        } catch {
          // Ignore storage failures and keep the default image preview.
        }

        showPhoto(defaultPhoto, false);
        if (status) status.textContent = "Restored profile.png as your profile photo.";
      });
    }

    try {
      const savedPhoto = localStorage.getItem(storageKey);
      if (savedPhoto) showPhoto(savedPhoto, true);
      else showPhoto(defaultPhoto, false);
    } catch {
      showPhoto(defaultPhoto, false);
    }
  };

  setupProfilePhotoEditor(profileSection);

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    const [address, ...query] = link.href.slice(7).split("?");
    if (address) {
      link.href = `mailto:${contactEmail}${query.length ? `?${query.join("?")}` : ""}`;
    }
  });

  const emailText = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let textNode;
  while ((textNode = emailText.nextNode())) {
    if (textNode.nodeValue && textNode.nodeValue.includes("abhijeettiwari955@gmail.com")) {
      textNode.nodeValue = textNode.nodeValue.replaceAll("abhijeettiwari955@gmail.com", contactEmail);
    }
  }

  const updateThemeButtons = () => {
    document.querySelectorAll(".theme").forEach((button) => {
      button.textContent = root.dataset.theme === "dark" ? "☼" : "☾";
      button.setAttribute(
        "aria-label",
        root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    });
  };

  try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      root.dataset.theme = savedTheme;
    }
  } catch {
    // The page still works when browser storage is unavailable.
  }
  updateThemeButtons();

  document.querySelectorAll(".theme").forEach((button) => {
    button.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      updateThemeButtons();
      try {
        localStorage.setItem("portfolio-theme", root.dataset.theme);
      } catch {
        // Theme switching remains available for this visit.
      }
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
  } else {
    revealSite();
  }

  if (menu && hamburger) {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (typed) {
    const words = [
      "Software Development",
      "Problem Solving",
      "Web Development",
      "Programming",
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
      const word = words[wordIndex];
      if (!word) return;

      charIndex += deleting ? -1 : 1;
      typed.textContent = word.slice(0, charIndex);

      let delay = deleting ? 45 : 85;
      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1200;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 350;
      }

      window.setTimeout(type, delay);
    };

    type();
  }

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  if (year) year.textContent = String(new Date().getFullYear());

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const subject = encodeURIComponent(formData.get("subject") || "Portfolio inquiry");
      const body = encodeURIComponent(
        `Name: ${formData.get("name") || ""}\nEmail: ${formData.get("email") || ""}\n\n${formData.get("message") || ""}`
      );
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    });
  }

  if (canvas) {
    const context = canvas.getContext("2d");
    if (context) {
      let stars = [];

      const resizeCanvas = () => {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * pixelRatio;
        canvas.height = window.innerHeight * pixelRatio;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        stars = Array.from({ length: 75 }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 1.4 + 0.2,
          speed: Math.random() * 0.8 + 0.04,
        }));
      };

      const drawStars = () => {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        stars.forEach((star) => {
          context.fillStyle = "rgba(120, 190, 240, 0.7)";
          context.beginPath();
          context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          context.fill();
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
      cursorDot.style.left = `${event.clientX}px`;
      cursorDot.style.top = `${event.clientY}px`;
      cursorRing.style.left = `${event.clientX}px`;
      cursorRing.style.top = `${event.clientY}px`;
    });

    document.querySelectorAll("a, button").forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursorRing.style.width = "48px";
        cursorRing.style.height = "48px";
      });
      element.addEventListener("mouseleave", () => {
        cursorRing.style.width = "30px";
        cursorRing.style.height = "30px";
      });
    });
  }
})();
