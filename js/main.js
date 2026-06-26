// ── Split the about lede into words for a staggered reveal ──
const lede = document.querySelector('.lede');
if (lede) {
    const words = lede.textContent.trim().split(/\s+/);
    lede.innerHTML = words
        .map((w, i) => `<span class="word" style="transition-delay:${(i * 0.035).toFixed(3)}s">${w}</span>`)
        .join(' ');
}

// ── Reveal sections on scroll ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Scroll-spy: highlight the nav link of the section in view ──
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');

const setActive = (id) => {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.target === id);
    });
};

const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setActive(entry.target.id);
        }
    });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(section => spyObserver.observe(section));
