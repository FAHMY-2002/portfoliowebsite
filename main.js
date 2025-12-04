// Mobile Menu Logic
const burger = document.querySelector("#burger");
const menu = document.querySelector(".content");

if (burger && menu) {
    burger.addEventListener("change", () => {
        if (burger.checked) {
            menu.classList.add("active");
            // Prevent scrolling when menu is open
            document.body.style.overflow = "hidden";
        } else {
            menu.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });

    // Close menu when clicking a link
    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            burger.checked = false;
            menu.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    });
}

// Project Filtering Logic
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove("active", "bg-accent", "text-white", "border-accent"));
        filterButtons.forEach(btn => btn.classList.add("bg-bg", "border-white/10", "text-gray-200"));

        // Add active class to clicked button
        button.classList.add("active", "bg-accent", "text-white", "border-accent");
        button.classList.remove("bg-bg", "border-white/10", "text-gray-200");

        const filterValue = button.getAttribute("data-filter");

        projectCards.forEach(card => {
            if (filterValue === "All" || card.getAttribute("data-project") === filterValue) {
                card.style.display = "block";
                // Add a small animation for reappearing items
                card.animate([
                    { transform: 'scale(0.9)', opacity: 0 },
                    { transform: 'scale(1)', opacity: 1 }
                ], {
                    duration: 300,
                    easing: 'ease-out'
                });
            } else {
                card.style.display = "none";
            }
        });
    });
});

// tsparticles Initialization
if (window.tsParticles) {
    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: true,
            },
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "#38bdf8",
            },
            links: {
                color: "#38bdf8",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
            },
            collisions: {
                enable: true,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 60,
            },
            opacity: {
                value: 0.3,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 3 },
            },
        },
        detectRetina: true,
        fullScreen: { enable: false, zIndex: 0 }
    });
}

// Parallax Fade-out Animation for Hero Section
const heroSection = document.querySelector('#about');
const heroContent = heroSection ? heroSection.querySelector('.container') : null;

if (heroSection && heroContent) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroHeight = heroSection.offsetHeight;

        // Calculate opacity (starts at 1, goes to 0 as we scroll down 70% of hero height)
        const opacity = 1 - (scrollPosition / (heroHeight * 0.7));

        // Calculate translation (moves up slightly)
        const translateY = scrollPosition * 0.4;

        if (scrollPosition < heroHeight) {
            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${translateY}px)`;
        }
    });
}
