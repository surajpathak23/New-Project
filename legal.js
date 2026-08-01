/* =================================================================
   DIVINE MASTER - LEGAL PAGES INTERACTIVE JAVASCRIPT
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
        if (loader && !loader.classList.contains('fade-out')) {
            loader.classList.add('fade-out');
        }
    }, 2000);

    // 2. Custom Cursor
    const cursorDot = document.getElementById('cursorDot');
    const cursorGlow = document.getElementById('cursorGlow');

    if (cursorDot && cursorGlow) {
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

        const interactiveEls = document.querySelectorAll('a, button, .legal-card, .legal-mini-card, .legal-side-nav a, .faq-item, .contact-list li');
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
    }

    // 3. Scroll Progress Bar, Navbar Scroll, Back to Top
    const navbar = document.getElementById('navbar');
    const readingProgress = document.getElementById('readingProgress');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (readingProgress) readingProgress.style.width = scrollPercent + '%';

        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
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
    }

    // 5. Dark / Light Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    if (themeToggle) {
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
            if (themeIcon) {
                themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
        }
    }

    // 6. Scroll Reveal Animation for Legal Cards
    const revealSections = document.querySelectorAll('.reveal-section');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealSections.forEach(section => revealObserver.observe(section));

    // 7. Sticky Page Navigation - Active Section Highlighting
    const sideNavLinks = document.querySelectorAll('.legal-side-nav a');
    const legalCards = document.querySelectorAll('.legal-card[id]');

    if (sideNavLinks.length && legalCards.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    sideNavLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
                    });
                }
            });
        }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });

        legalCards.forEach(card => navObserver.observe(card));
    }

    // 8. Search Modal
    const searchTrigger = document.getElementById('searchTrigger');
    const searchModal = document.getElementById('searchModal');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchInput = document.getElementById('searchInput');
    const searchResultsList = document.getElementById('searchResultsList');

    const searchDatabase = [
        { title: 'Astrology & Horoscope', category: 'Service', link: 'index.html#services' },
        { title: 'Tarot Reading', category: 'Service', link: 'index.html#services' },
        { title: 'Numerology Blueprint', category: 'Service', link: 'index.html#services' },
        { title: 'Vastu Shastra Alignment', category: 'Service', link: 'index.html#services' },
        { title: 'Gemstone Prescription', category: 'Service', link: 'index.html#services' },
        { title: 'Chakra Healing', category: 'Service', link: 'index.html#services' },
        { title: 'Master Blueprint Package', category: 'Pricing', link: 'index.html#packages' },
        { title: 'Meet Divine Master Pavneesh', category: 'About', link: 'index.html#about' }
    ];

    if (searchTrigger && searchModal && closeSearchBtn) {
        searchTrigger.addEventListener('click', () => {
            searchModal.classList.add('active');
            if (searchInput) searchInput.focus();
        });

        closeSearchBtn.addEventListener('click', () => {
            searchModal.classList.remove('active');
        });

        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) searchModal.classList.remove('active');
        });

        if (searchInput && searchResultsList) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                searchResultsList.innerHTML = '';
                if (query.length === 0) return;

                const results = searchDatabase.filter(item =>
                    item.title.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query)
                );

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
                    li.innerHTML = `<a href="${res.link}" class="close-search-modal-link" style="color: #fff; display: flex; justify-content: space-between;"><span>${res.title}</span><span style="color: var(--gold-primary); font-size: 0.8rem;">${res.category}</span></a>`;
                    ul.appendChild(li);
                });
                searchResultsList.appendChild(ul);

                document.querySelectorAll('.close-search-modal-link').forEach(link => {
                    link.addEventListener('click', () => {
                        searchModal.classList.remove('active');
                    });
                });
            });
        }
    }

    // 9. Booking Modal
    const openModalBtn = document.getElementById('openModalBtn');
    const closeBookingBtn = document.getElementById('closeBookingBtn');
    const bookingModal = document.getElementById('bookingModal');

    window.openBookingModal = function() {
        if (bookingModal) bookingModal.classList.add('active');
    };

    window.closeBookingModal = function() {
        if (bookingModal) bookingModal.classList.remove('active');
    };

    if (openModalBtn) {
        openModalBtn.addEventListener('click', openBookingModal);
    }

    if (closeBookingBtn) {
        closeBookingBtn.addEventListener('click', closeBookingModal);
    }

    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeBookingModal();
        });
    }

    // 10. Booking Form
    const bookingForm = document.getElementById('bookingForm');
    let isSubmitting = false;

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;

            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                showToast('Appointment request received! We will contact you shortly.');
                bookingForm.reset();
                closeBookingModal();
            } catch (error) {
                console.error('Booking submission failed:', error);
                showToast('Unable to send your appointment request. Please try again.');
            } finally {
                isSubmitting = false;
            }
        });
    }

    // 11. Toast Notification System
    window.showToast = function(msg) {
        const toast = document.getElementById('toastNotification');
        const toastMsg = document.getElementById('toastMessage');
        if (toast && toastMsg) {
            toastMsg.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    };

});