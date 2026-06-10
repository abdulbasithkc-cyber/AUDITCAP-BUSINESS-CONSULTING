document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const header = document.getElementById('site-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const inquiryForm = document.getElementById('inquiryForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submit-btn');
    const resetFormBtn = document.getElementById('reset-form-btn');
    const revealElements = document.querySelectorAll('.scroll-reveal');

    // --- Sticky Header Scroll Effect ---
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader();

    // --- Mobile Menu Toggle ---
    const toggleMobileMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // --- Active Link Indicator on Scroll ---
    const sections = document.querySelectorAll('section, footer');
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', scrollSpy);
    scrollSpy();

    // --- Offset Smooth Scrolling for Sticky Header ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Interactive Canvas Particle Network Animation ---
    const initHeroCanvas = () => {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;

        // Size adjustment
        let width = (canvas.width = container.offsetWidth);
        let height = (canvas.height = container.offsetHeight);

        const particles = [];
        const particleCount = Math.min(65, Math.floor((width * height) / 4000)); // Dynamic count based on size
        const connectionDistance = 100;
        const mouse = { x: null, y: null, radius: 150 };

        // Handle resize
        window.addEventListener('resize', () => {
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        });

        // Track mouse movement inside canvas container
        container.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        container.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Class definition
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2.5 + 1.5;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#ffd43b';
                ctx.fill();
            }

            update() {
                // Bounce on boundaries
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction / push away effect
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        
                        // Soft push
                        this.x += Math.cos(angle) * force * 1.2;
                        this.y += Math.sin(angle) * force * 1.2;
                    }
                }
                this.draw();
            }
        }

        // Initialize particles array
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Render loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            particles.forEach(p => p.update());

            // Draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255, 212, 59, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                // Connect to mouse cursor
                if (mouse.x !== null && mouse.y !== null) {
                    const p = particles[i];
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const alpha = (1 - dist / mouse.radius) * 0.35;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(255, 212, 59, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        animate();
    };
    initHeroCanvas();

    // --- Form Validation & Simulation ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+0-9\s-]{7,15}$/;

    const validateInput = (inputEl, errorEl, validationFn) => {
        const isValid = validationFn(inputEl.value.trim());
        const formGroup = inputEl.closest('.form-group');
        
        if (!isValid) {
            formGroup.classList.add('has-error');
        } else {
            formGroup.classList.remove('has-error');
        }
        return isValid;
    };

    const validations = [
        {
            input: document.getElementById('form-name'),
            error: document.getElementById('error-name'),
            fn: val => val.length >= 2
        },
        {
            input: document.getElementById('form-mobile'),
            error: document.getElementById('error-mobile'),
            fn: val => phoneRegex.test(val)
        },
        {
            input: document.getElementById('form-email'),
            error: document.getElementById('error-email'),
            fn: val => emailRegex.test(val)
        },
        {
            input: document.getElementById('form-service'),
            error: document.getElementById('error-service'),
            fn: val => val !== ""
        },
        {
            input: document.getElementById('form-message'),
            error: document.getElementById('error-message'),
            fn: val => val.length >= 10
        }
    ];

    validations.forEach(item => {
        item.input.addEventListener('blur', () => {
            validateInput(item.input, item.error, item.fn);
        });
        
        item.input.addEventListener('input', () => {
            item.input.closest('.form-group').classList.remove('has-error');
        });
    });

    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;
        validations.forEach(item => {
            const isValid = validateInput(item.input, item.error, item.fn);
            if (!isValid) isFormValid = false;
        });

        if (isFormValid) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            setTimeout(() => {
                // Retrieve form input values
                const name = document.getElementById('form-name').value.trim();
                const mobile = document.getElementById('form-mobile').value.trim();
                const email = document.getElementById('form-email').value.trim();
                const service = document.getElementById('form-service').value;
                const message = document.getElementById('form-message').value.trim();

                // Format WhatsApp query text
                const formattedMessage = `*New Business Inquiry - AUDITCAP*\n\n` +
                                         `*Name:* ${name}\n` +
                                         `*Mobile:* ${mobile}\n` +
                                         `*Email:* ${email}\n` +
                                         `*Service Required:* ${service}\n\n` +
                                         `*Message:* ${message}`;
                
                const encodedMessage = encodeURIComponent(formattedMessage);
                const whatsappUrl = `https://wa.me/97333456321?text=${encodedMessage}`;

                inquiryForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                
                const headerHeight = header.offsetHeight;
                const formSection = document.getElementById('inquiry');
                const offsetPosition = formSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                inquiryForm.reset();
                validations.forEach(item => {
                    item.input.closest('.form-group').classList.remove('has-error');
                });

                // Launch WhatsApp Chat in new window tab
                window.open(whatsappUrl, '_blank');
            }, 1500);
        } else {
            const firstError = document.querySelector('.form-group.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    resetFormBtn.addEventListener('click', () => {
        successMessage.style.display = 'none';
        inquiryForm.style.display = 'flex';
    });


    // --- IntersectionObserver Scroll Reveal Animations ---
    const revealOnScroll = () => {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.15
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            revealElements.forEach(el => {
                observer.observe(el);
            });
        } else {
            revealElements.forEach(el => {
                el.classList.add('active');
            });
        }
    };
    revealOnScroll();
});
