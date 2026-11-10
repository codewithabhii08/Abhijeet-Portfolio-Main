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

  // Keep the theme controls synchronized and remember the visitor's preference.
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

  // Reveal the portfolio when Enter exists; otherwise don't leave the page hidden.
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

  // Accessible mobile navigation.
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

  // Optional typing animation (safe on pages without the target element).
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

  // Progressive reveal, with a fallback for browsers without IntersectionObserver.
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

  // Open the visitor's email app with the contact form contents.
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const subject = encodeURIComponent(formData.get("subject") || "Portfolio inquiry");
      const body = encodeURIComponent(
        `Name: ${formData.get("name") || ""}\nEmail: ${formData.get("email") || ""}\n\n${formData.get("message") || ""}`
      );
      window.location.href = `mailto:abhijeettiwari955@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // Animated star background.
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

  // Hide custom cursor behavior on touch devices or if cursor elements are absent.
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
