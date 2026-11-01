
const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enterBtn");

if (intro && enterBtn) {
  enterBtn.addEventListener("click", () => {
    intro.classList.add("hide");
    document.body.style.overflow = "auto";
  });
}

document.body.style.overflow = intro ? "hidden" : "auto";

const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

const setMenuState = (isOpen) => {
  if (!navbar || !menuToggle) return;

  navbar.classList.toggle("open", isOpen);
  const icon = menuToggle.querySelector("i");

  if (icon) {
    icon.classList.toggle("fa-bars", !isOpen);
    icon.classList.toggle("fa-xmark", isOpen);
  }

  menuToggle.setAttribute("aria-expanded", String(isOpen));
};

if (menuToggle && navbar) {
  menuToggle.addEventListener("click", () => {
    const isOpen = !navbar.classList.contains("open");
    setMenuState(isOpen);
  });

  document.querySelectorAll(".navbar a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (!navbar.classList.contains("open")) return;

    const clickedInsideMenu = navbar.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      setMenuState(false);
    }
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

const tiltCards = document.querySelectorAll(".tilt-card");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 800) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / 18;
    const rotateY = (x - centerX) / 18;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0)";
  });
});

const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 450);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
