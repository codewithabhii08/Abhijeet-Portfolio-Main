/* =========================================
   ABHIJEET TIWARI — PORTFOLIO JAVASCRIPT
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // SELECT ELEMENTS
    // =====================================

    const header = document.getElementById("header");
    const navMenu = document.getElementById("navMenu");
    const menuToggle = document.getElementById("menuToggle");
    const themeToggle = document.getElementById("themeToggle");
    const typingText = document.getElementById("typingText");
    const scrollProgress = document.getElementById("scrollProgress");
    const contactForm = document.getElementById("contactForm");
    const formNote = document.getElementById("formNote");
    const currentYear = document.getElementById("currentYear");

    const navLinks = document.querySelectorAll(".nav-link");
    const revealElements = document.querySelectorAll(".reveal");
    const profilePreview = document.getElementById("profilePreview");
    const profileInput = document.getElementById("profilePhotoInput");
    const certificateInput = document.getElementById("certificateUploadInput");
    const certificateName = document.getElementById("certificateName");

    // =====================================
    // CURRENT YEAR
    // =====================================

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    function closeMenu() {
        if (!navMenu || !menuToggle) return;

        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.className = "fas fa-bars";
        }
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.className = isOpen
                    ? "fas fa-xmark"
                    : "fas fa-bars";
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.addEventListener("click", (event) => {
            const clickedInsideMenu = navMenu.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        });
    }

    // =====================================
    // LIGHT / DARK THEME
    // =====================================

    const THEME_KEY = "abhijeet-portfolio-theme";

    function updateThemeButton(isLight) {
        if (!themeToggle) return;

        const icon = themeToggle.querySelector("i");

        if (icon) {
            icon.className = isLight
                ? "fas fa-moon"
                : "fas fa-sun";
        }

        themeToggle.setAttribute(
            "aria-label",
            isLight
                ? "Switch to dark theme"
                : "Switch to light theme"
        );
    }

    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem(THEME_KEY);
    } catch (error) {
        // Theme switching still works if storage is unavailable.
    }

    const prefersLight = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches;

    const startWithLight = savedTheme
        ? savedTheme === "light"
        : prefersLight;

    document.body.classList.toggle("light-theme", startWithLight);
    updateThemeButton(startWithLight);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isLight = document.body.classList.toggle("light-theme");

            updateThemeButton(isLight);

            try {
                localStorage.setItem(
                    THEME_KEY,
                    isLight ? "light" : "dark"
                );
            } catch (error) {
                // The selected theme remains active for this page view.
            }
        });
    }

    // =====================================
    // TYPING ANIMATION
    // =====================================

    if (typingText) {
        const words = [
            "Software Development",
            "Web Development",
            "Python Programming",
            "Problem Solving",
            "Building Projects"
        ];

        let wordIndex = 0;
        let characterIndex = 0;
        let deleting = false;

        const typingSpeed = 85;
        const deletingSpeed = 45;
        const pauseAfterWord = 1300;

        function typeNext() {
            const currentWord = words[wordIndex];

            if (!deleting) {
                characterIndex++;

                typingText.textContent = currentWord.slice(
                    0,
                    characterIndex
                );

                if (characterIndex >= currentWord.length) {
                    deleting = true;

                    window.setTimeout(typeNext, pauseAfterWord);
                    return;
                }

                window.setTimeout(typeNext, typingSpeed);
                return;
            }

            characterIndex--;

            typingText.textContent = currentWord.slice(
                0,
                characterIndex
            );

            if (characterIndex <= 0) {
                deleting = false;

                wordIndex = (wordIndex + 1) % words.length;

                window.setTimeout(typeNext, 350);
                return;
            }

            window.setTimeout(typeNext, deletingSpeed);
        }

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            typeNext();
        } else {
            typingText.textContent = words[0];
        }
    }

    // =====================================
    // SCROLL REVEAL ANIMATION
    // =====================================

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }

    // =====================================
    // SCROLL EFFECTS
    // =====================================

    let scrollTicking = false;

    function updateScrollEffects() {
        const scrollY = window.scrollY;
        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        // Header background and border.

        if (header) {
            header.classList.toggle("scrolled", scrollY > 20);
        }

        // Reading progress indicator.

        if (scrollProgress) {
            const progress = documentHeight > 0
                ? (scrollY / documentHeight) * 100
                : 0;

            scrollProgress.style.width =
                `${Math.min(progress, 100)}%`;
        }

        scrollTicking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(updateScrollEffects);
                scrollTicking = true;
            }
        },
        { passive: true }
    );

    updateScrollEffects();

    // =====================================
    // ACTIVE NAVIGATION LINK
    // =====================================

    const sections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio - a.intersectionRatio
                    );

                if (!visibleSections.length) return;

                const activeId = visibleSections[0].target.id;

                navLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${activeId}`;

                    link.classList.toggle("active", isActive);
                });
            },
            {
                rootMargin: "-25% 0px -55% 0px",
                threshold: [0, 0.1, 0.25, 0.5]
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    // =====================================
    // PROFILE PHOTO & CERTIFICATE UPLOAD
    // =====================================

    if (profileInput && profilePreview) {
        profileInput.addEventListener("change", (event) => {
            const file = event.target.files && event.target.files[0];

            if (!file || !file.type.startsWith("image/")) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                profilePreview.src = loadEvent.target.result;
                profilePreview.style.display = "block";
                profilePreview.parentElement.querySelector(".avatar-symbol").style.display = "none";
            };
            reader.readAsDataURL(file);
        });
    }

    if (certificateInput && certificateName) {
        certificateInput.addEventListener("change", (event) => {
            const file = event.target.files && event.target.files[0];

            if (!file) {
                return;
            }

            const cleanName = file.name.length > 26
                ? `${file.name.slice(0, 23)}...`
                : file.name;

            certificateName.textContent = cleanName;
        });
    }

    // =====================================
    // CONTACT FORM
    // =====================================

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            const name = document
                .getElementById("name")
                .value.trim();

            const email = document
                .getElementById("email")
                .value.trim();

            const subject = document
                .getElementById("subject")
                .value.trim();

            const message = document
                .getElementById("message")
                .value.trim();

            if (!name || !email || !subject || !message) {
                if (formNote) {
                    formNote.textContent =
                        "Please complete all fields before continuing.";
                }

                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                if (formNote) {
                    formNote.textContent =
                        "Please enter a valid email address.";
                }

                return;
            }

            const recipient = "abhijeettiwari955@gmail.com";

            const emailSubject = encodeURIComponent(subject);

            const emailBody = encodeURIComponent(
                `Hello Abhijeet,\n\n` +
                `${message}\n\n` +
                `Regards,\n${name}\n` +
                `Reply email: ${email}`
            );

            const mailtoURL =
                `mailto:${recipient}` +
                `?subject=${emailSubject}` +
                `&body=${emailBody}`;

            if (formNote) {
                formNote.textContent =
                    "Opening your email application. If it doesn't open, email me directly at abhijeettiwari955@gmail.com.";
            }

            // Open the visitor's email application.
            window.location.href = mailtoURL;
        });
    }

    // =====================================
    // DOWNLOAD CV LINK CHECK
    // =====================================

    const cvLink = document.querySelector(
        'a[download][href*="CV.pdf"]'
    );

    if (cvLink) {
        cvLink.addEventListener("click", (event) => {
            // Prevent a broken download if the file was not added.
            // Keep the download action available when the file exists.
            fetch(cvLink.href, { method: "HEAD" })
                .then((response) => {
                    if (!response.ok) {
                        event.preventDefault();

                        if (formNote) {
                            formNote.textContent =
                                "Please add your CV PDF to the assets folder before downloading.";
                        }
                    }
                })
                .catch(() => {
                    // Do not block the normal download on network errors.
                });
        });
    }

});


    // =====================================
    // AI ASSISTANT
    // =====================================

    const aiToggle = document.getElementById("aiToggle");
    const aiClose = document.getElementById("aiClose");
    const aiPanel = document.getElementById("aiPanel");
    const aiForm = document.getElementById("aiForm");
    const aiInput = document.getElementById("aiInput");
    const aiMessages = document.getElementById("aiMessages");
    const aiSuggestionButtons = document.querySelectorAll(".ai-suggestion");

    function addAiMessage(content, sender = "bot") {
        if (!aiMessages) return;

        const message = document.createElement("div");
        message.className = `ai-message ai-${sender}`;
        message.textContent = content;
        aiMessages.appendChild(message);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    function createAiReply(prompt) {
        const text = prompt.toLowerCase();

        if (text.includes("skill") || text.includes("technology") || text.includes("stack")) {
            return "I am currently building my foundation in C, C++, Python, Java, HTML, CSS, and JavaScript. My focus is on problem-solving, clean coding, and web development.";
        }

        if (text.includes("project") || text.includes("work") || text.includes("portfolio")) {
            return "My portfolio showcases a personal developer portfolio, Python practice programs, and responsive web experiments. I also keep learning by building small projects and improving my frontend skills.";
        }

        if (text.includes("edu") || text.includes("study") || text.includes("education") || text.includes("learning")) {
            return "I have a Diploma in Mechanical Engineering and training in AutoCAD, and I am actively learning software development through an Advanced Diploma in Software Programming and self-directed practice.";
        }

        if (text.includes("contact") || text.includes("reach") || text.includes("mail") || text.includes("email") || text.includes("instagram") || text.includes("github")) {
            return "You can contact me by email at abhijeettiwari955@gmail.com, connect on GitHub at github.com/codewithaviiee08, or follow my Instagram and X profiles linked on this page.";
        }

        if (text.includes("hello") || text.includes("hi")) {
            return "Hello! I'm Abhijeet's portfolio assistant. Ask me about his skills, projects, education, or contact details.";
        }

        if (text.includes("goal") || text.includes("future") || text.includes("aspire") || text.includes("career")) {
            return "My goal is to become a professional software engineer by strengthening fundamentals, improving problem-solving, and building complete applications with modern tools.";
        }

        return "I can tell you about Abhijeet's current skills, learning journey, project work, and how to contact him. Try asking about projects, education, or contact details.";
    }

    function toggleAiPanel(forceOpen) {
        if (!aiToggle || !aiPanel) return;

        const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : aiPanel.hasAttribute("hidden");
        aiPanel.toggleAttribute("hidden", !shouldOpen);
        aiToggle.setAttribute("aria-expanded", String(shouldOpen));
    }

    if (aiToggle && aiPanel) {
        aiToggle.addEventListener("click", () => toggleAiPanel());
    }

    if (aiClose && aiPanel) {
        aiClose.addEventListener("click", () => toggleAiPanel(false));
    }

    aiSuggestionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (!aiInput) return;
            aiInput.value = button.textContent.trim();
            aiInput.focus();
            if (aiForm) {
                aiForm.requestSubmit();
            }
        });
    });

    if (aiForm && aiInput) {
        aiForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const prompt = aiInput.value.trim();
            if (!prompt) {
                aiInput.focus();
                return;
            }

            addAiMessage(prompt, "user");
            aiInput.value = "";

            window.setTimeout(() => {
                addAiMessage(createAiReply(prompt), "bot");
            }, 250);
        });
    }

