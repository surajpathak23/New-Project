/* =================================================================     
   DIVINE MASTER - LUXURY INTERACTIVE JAVASCRIPT
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Luxury Loader
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 600);
    });

    // Fallback loader removal
    setTimeout(() => {
        if (!loader.classList.contains('fade-out')) {
            loader.classList.add('fade-out');
        }
    }, 2000);

    // 2. Custom Cursor & Spotlight
    const cursorDot = document.getElementById('cursorDot');
    const cursorGlow = document.getElementById('cursorGlow');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursorGlow.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover effect on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .service-card, .package-card, .faq-item, .blog-card');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.style.width = '65px';
            cursorGlow.style.height = '65px';
            cursorGlow.style.borderColor = 'var(--gold-primary)';
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.style.width = '40px';
            cursorGlow.style.height = '40px';
            cursorGlow.style.borderColor = 'rgba(212, 175, 55, 0.4)';
        });
    });

    // 3. Reading Progress Bar & Navbar Scroll
    const navbar = document.getElementById('navbar');
    const readingProgress = document.getElementById('readingProgress');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        readingProgress.style.width = scrollPercent + '%';

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollTop > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 5. Dark / Light Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('divine_theme') || 'light';
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('divine_theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // 6. About Section Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(btn.getAttribute('data-tab'));
            if (targetPane) targetPane.classList.add('active');
        });
    });

    // 7. Testimonials Slider
    const testimonialWrapper = document.getElementById('testimonialSlider');
    const testimonialTrack = document.getElementById('testimonialTrack');
    const prevTestimonial = document.getElementById('prevTestimonial');
    const nextTestimonial = document.getElementById('nextTestimonial');

    if (testimonialWrapper && testimonialTrack && prevTestimonial && nextTestimonial) {
        const gap = 24;
        let currentSlide = 0;
        let autoRotate;
        let dragStartX = 0;
        let dragDelta = 0;
        let isDragging = false;
        let isPaused = false;

        function getCardsPerView() {
            return window.innerWidth <= 768 ? 1 : 2;
        }

        function getCardWidth() {
            const firstCard = testimonialTrack.querySelector('.testimonial-card');
            if (!firstCard) return 0;
            return firstCard.getBoundingClientRect().width + gap;
        }

        function updateSlider() {
            const step = getCardWidth();
            testimonialTrack.style.transition = 'transform 0.45s ease';
            testimonialTrack.style.transform = `translateX(-${currentSlide * step}px)`;
        }

        function nextSlide() {
            const maxSlide = testimonialTrack.children.length - getCardsPerView();
            currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
            updateSlider();
        }

        function prevSlide() {
            const maxSlide = testimonialTrack.children.length - getCardsPerView();
            currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
            updateSlider();
        }

        function startAutoRotate() {
            if (autoRotate) clearInterval(autoRotate);
            autoRotate = setInterval(() => {
                if (!isPaused) {
                    nextSlide();
                }
            }, 5000);
        }

        prevTestimonial.addEventListener('click', () => {
            prevSlide();
        });

        nextTestimonial.addEventListener('click', () => {
            nextSlide();
        });

        testimonialWrapper.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        testimonialWrapper.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        testimonialWrapper.addEventListener('focusin', () => {
            isPaused = true;
        });

        testimonialWrapper.addEventListener('focusout', () => {
            isPaused = false;
        });

        testimonialWrapper.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                prevSlide();
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                nextSlide();
            }
        });

        testimonialTrack.addEventListener('pointerdown', (event) => {
            isDragging = true;
            dragStartX = event.clientX;
            dragDelta = 0;
            testimonialTrack.style.transition = 'none';
        });

        testimonialTrack.addEventListener('pointermove', (event) => {
            if (!isDragging) return;
            dragDelta = event.clientX - dragStartX;
            const step = getCardWidth();
            testimonialTrack.style.transform = `translateX(calc(-${currentSlide * step}px + ${dragDelta}px))`;
        });

        const releaseDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            if (dragDelta <= -55) {
                nextSlide();
            } else if (dragDelta >= 55) {
                prevSlide();
            } else {
                updateSlider();
            }
        };

        testimonialTrack.addEventListener('pointerup', releaseDrag);
        testimonialTrack.addEventListener('pointerleave', releaseDrag);
        testimonialTrack.addEventListener('pointercancel', releaseDrag);

        window.addEventListener('resize', () => {
            currentSlide = 0;
            updateSlider();
        });

        updateSlider();
        startAutoRotate();
    }

    // 8. Blog Expand / Collapse Toggle
    const blogGrid = document.getElementById('blogGrid');
    const blogToggleBtn = document.getElementById('blogToggleBtn');

    if (blogGrid && blogToggleBtn) {
        blogToggleBtn.addEventListener('click', () => {
            const isExpanded = blogGrid.classList.toggle('expanded');
            blogToggleBtn.textContent = isExpanded ? 'Show Less' : 'View All Articles';
            blogToggleBtn.setAttribute('aria-expanded', String(isExpanded));
        });
    }

    // 9. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 10. Search Modal
    const searchTrigger = document.getElementById('searchTrigger');
    const searchModal = document.getElementById('searchModal');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchInput = document.getElementById('searchInput');
    const searchResultsList = document.getElementById('searchResultsList');

    const searchDatabase = [
        { title: 'Astrology & Horoscope', category: 'Service', link: '#services' },
        { title: 'Tarot Reading', category: 'Service', link: '#services' },
        { title: 'Numerology Blueprint', category: 'Service', link: '#services' },
        { title: 'Vastu Shastra Alignment', category: 'Service', link: '#services' },
        { title: 'Gemstone Prescription', category: 'Service', link: '#services' },
        { title: 'Chakra Healing', category: 'Service', link: '#services' },
        { title: 'Master Blueprint Package', category: 'Pricing', link: '#packages' },
        { title: 'Navigating Planetary Retrogrades', category: 'Journal', link: '#blog' },
        { title: 'Meet Divine Master Pavneesh', category: 'About', link: '#about' }
    ];

    searchTrigger.addEventListener('click', () => {
        searchModal.classList.add('active');
        searchInput.focus();
    });

    closeSearchBtn.addEventListener('click', () => {
        searchModal.classList.remove('active');
    });

    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) searchModal.classList.remove('active');
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        searchResultsList.innerHTML = '';
        if (query.length === 0) return;

        const results = searchDatabase.filter(item => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));

        if (results.length === 0) {
            searchResultsList.innerHTML = '<p style="color: #fff; margin-top: 15px;">No matching cosmic wisdom found.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.style.marginTop = '20px';
        ul.style.textAlign = 'left';

        results.forEach(res => {
            const li = document.createElement('li');
            li.style.padding = '12px 15px';
            li.style.background = 'rgba(255,255,255,0.08)';
            li.style.marginBottom = '8px';
            li.style.borderRadius = '10px';
            li.style.cursor = 'pointer';
            li.innerHTML = `<a href="${res.link}" style="color: #fff; display: flex; justify-content: space-between;" onclick="closeSearchModal()"><span>${res.title}</span><span style="color: var(--gold-primary); font-size: 0.8rem;">${res.category}</span></a>`;
            ul.appendChild(li);
        });
        searchResultsList.appendChild(ul);
    });

    // 10. Appointment Modal
    window.openBookingModal = function() {
        document.getElementById('bookingModal').classList.add('active');
    }

    window.closeBookingModal = function() {
        document.getElementById('bookingModal').classList.remove('active');
    }

    document.getElementById('openModalBtn').addEventListener('click', openBookingModal);
    document.getElementById('closeBookingBtn').addEventListener('click', closeBookingModal);

    document.getElementById('bookingModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('bookingModal')) closeBookingModal();
    });

    // 11. Booking Form EmailJS Integration
    const bookingForm = document.getElementById('bookingForm');
    let isSubmitting = false;

    if (bookingForm) {
        emailjs.init({
            publicKey: "inUSgJ_PeaJJUbqz2"
        });

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (isSubmitting) return;
            isSubmitting = true;

            const submittedOn = new Date().toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });

            const templateParams = {
                fullName: document.getElementById('fullName')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                consultationType: document.getElementById('consultationType')?.value || '',
                message: document.getElementById('message')?.value || '',
                submittedOn: submittedOn
            };

            const bookingDateInput = document.getElementById('bookingDate') || document.getElementById('date') || document.querySelector('input[name="bookingDate"], input[name="date"]');
            const bookingTimeInput = document.getElementById('bookingTime') || document.getElementById('time') || document.querySelector('input[name="bookingTime"], input[name="time"]');

            templateParams.bookingDate = bookingDateInput ? bookingDateInput.value : "";
            templateParams.bookingTime = bookingTimeInput ? bookingTimeInput.value : "";

            try {
                await Promise.all([
                    emailjs.send(
                        "service_6klabmu",
                        "template_booking_admin",
                        templateParams
                    ),
                    emailjs.send(
                        "service_6klabmu",
                        "template_booking_reply",
                        templateParams
                    )
                ]);

                showToast('Appointment request received! We will contact you shortly.');
                bookingForm.reset();
                closeBookingModal();
            } catch (error) {
                console.error('Booking email failed:', error);
                showToast('Unable to send your appointment request. Please try again.');
            } finally {
                isSubmitting = false;
            }
        });
    }

    // 12. Toast Notification System
    window.showToast = function(msg) {
        const toast = document.getElementById('toastNotification');
        const toastMsg = document.getElementById('toastMessage');
        toastMsg.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // 12. Animated Statistics Counters
    const counters = document.querySelectorAll('.counter');
    let counted = false;

    window.addEventListener('scroll', () => {
        const heroSection = document.getElementById('hero');
        const rect = heroSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && !counted) {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const speed = target / 35;
                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        counter.textContent = Math.ceil(count);
                        setTimeout(updateCount, 40);
                    } else {
                        counter.textContent = target;
                    }
                };
                updateCount();
            });
            counted = true;
        }
    });

});

function closeSearchModal() {
    document.getElementById('searchModal').classList.remove('active');
}
