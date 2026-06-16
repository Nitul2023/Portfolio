/* ===== MAIN INIT (waits for DOM to be ready) ===== */
document.addEventListener('DOMContentLoaded', function () {

    /* ===== CANVAS PARTICLE BACKGROUND ===== */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 70;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.4 + 0.1;
            this.life = 0;
            this.maxLife = Math.random() * 300 + 200;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;
            if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = '#ffbd39';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.save();
                    ctx.globalAlpha = (1 - dist / 120) * 0.06;
                    ctx.strokeStyle = '#ffbd39';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    /* ===== NAVBAR SCROLL ===== */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    /* ===== HAMBURGER MENU ===== */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        if (mobileMenu.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translateY(7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
    });

    /* ===== TYPED TEXT EFFECT ===== */
    const phrases = [
        // 'Networking Solutions.',
        'Web Applications.',
        'AI-Powered Tools.',
        'Practical Software.',
        'Real-World Systems.'
    ];
    const typedEl = document.getElementById('typed');
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    function typeLoop() {
        const current = phrases[phraseIndex];
        typedEl.textContent = isDeleting
            ? current.substring(0, charIndex--)
            : current.substring(0, charIndex++);

        let delay = isDeleting ? 60 : 110;
        if (!isDeleting && charIndex > current.length) {
            delay = 1800; isDeleting = true;
        } else if (isDeleting && charIndex < 0) {
            isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 400;
        }
        setTimeout(typeLoop, delay);
    }
    typeLoop();

    /* ===== SCROLL REVEAL ===== */
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ===== STAGGER REVEALS ===== */
    document.querySelectorAll('.card-container, .intern-grid, .projects-grid, .certificates-grid').forEach(container => {
        const children = container.querySelectorAll('.reveal');
        children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.1}s`;
        });
    });

    /* ===== CONTACT FORM ===== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const btnText = document.getElementById('btn-text');

            btnText.textContent = 'Sending...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            emailjs.sendForm('service_4cet1bj', 'template_6q3urha', this).then(
                function () {
                    btnText.textContent = '✓ Message Sent!';
                    btn.style.background = '#4ade80';
                    setTimeout(() => {
                        contactForm.reset();
                        btnText.textContent = 'Send Message';
                        btn.style.background = '';
                        btn.disabled = false;
                        btn.style.opacity = '1';
                    }, 3000);
                },
                function (error) {
                    btnText.textContent = '✗ Failed — Try Again';
                    btn.style.background = '#f87171';
                    btn.disabled = false;
                    setTimeout(() => {
                        btnText.textContent = 'Send Message';
                        btn.style.background = '';
                        btn.style.opacity = '1';
                    }, 3000);
                    console.error('EmailJS Error:', error);
                }
            );
        });
    }

    /* ===== SMOOTH ACTIVE NAV ===== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = 'var(--gold)';
            }
        });
    });

}); // end DOMContentLoaded