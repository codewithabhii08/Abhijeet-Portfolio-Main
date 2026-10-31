document.addEventListener("DOMContentLoaded", () => {
  const welcome = document.getElementById("welcomeScreen");
  const shell = document.getElementById("siteShell");
  const enterButton = document.getElementById("enterButton");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  document.body.classList.add("locked");

  enterButton.addEventListener("click", () => {
    welcome.classList.add("exit");
    shell.classList.add("visible");
    shell.setAttribute("aria-hidden", "false");
    document.body.classList.remove("locked");
    window.setTimeout(() => welcome.remove(), 850);
  });

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // Typing animation for the hero role.
  const typing = document.getElementById("typingText");
  const phrases = [
    "Mechanical Engineering & Software",
    "Aspiring Software Developer",
    "Mechanical Design & CAD Learning",
    "Always Learning. Always Building."
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;
  function typeLoop() {
    const phrase = phrases[phraseIndex];
    typing.textContent = phrase.substring(0, charIndex);
    if (!deleting && charIndex < phrase.length) {
      charIndex++;
      setTimeout(typeLoop, 75);
    } else if (deleting && charIndex > 0) {
      charIndex--;
      setTimeout(typeLoop, 35);
    } else {
      deleting = !deleting;
      if (!deleting) phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, deleting ? 1300 : 350);
    }
  }
  typeLoop();

  // Contact form opens the visitor's email application; no backend is required.
  document.getElementById("contactForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const subject = form.get("subject");
    const message = form.get("message");
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:abhijeettiwari955@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });

  // Three.js animated particle field with a slowly rotating wireframe gear-like torus.
  function initThreeScene() {
    if (!window.THREE) return;
    const canvas = document.getElementById("scene-canvas");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const particleCount = 850;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(geometry, new THREE.PointsMaterial({
      color: 0x16c8ff, size: 0.035, transparent: true, opacity: 0.8
    }));
    scene.add(points);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(3.1, 0.018, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x087cf5, wireframe: false, transparent: true, opacity: 0.28 })
    );
    torus.position.set(5.5, 0, -3);
    scene.add(torus);

    function animate() {
      requestAnimationFrame(animate);
      points.rotation.y += 0.00035;
      points.rotation.x += 0.00012;
      torus.rotation.x += 0.001;
      torus.rotation.y += 0.0015;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  initThreeScene();
});
