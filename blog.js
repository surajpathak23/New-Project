/* =================================================================
   DIVINE MASTER - LUXURY BLOG SYSTEM JAVASCRIPT
   Handles navbar, modals, reading progress, TOC, comments, share.
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Luxury Loader
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) loader.classList.add('fade-out');
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

        const interactiveEls = document.querySelectorAll('a, button, .blog-article-body h2, .blog-article-body h3, .blog-faq-q, .comment-submit, .sidebar-widget, .blog-author-card');
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

    // 3. Navbar Scroll, Article Scroll Progress, Back to Top
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('blogScrollProgress');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (scrollProgress) scrollProgress.style.width = scrollPercent + '%';

        if (navbar) {
            navbar.classList.toggle('scrolled', scrollTop > 50);
        }

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('show', scrollTop > 400);
        }

        // TOC visibility + active heading
        const toc = document.getElementById('blogToc');
        const article = document.getElementById('articleBody');
        if (toc && article) {
            const articleBottom = article.getBoundingClientRect().bottom;
            toc.classList.toggle('hidden', articleBottom < 100 || scrollTop < 200);
        }

        const tocLinks = document.querySelectorAll('.blog-toc a');
        if (tocLinks.length) {
            let currentId = '';
            tocLinks.forEach(link => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const rect = target.getBoundingClientRect();
                    if (rect.top <= 140) {
                        currentId = target.getAttribute('id');
                    }
                }
            });
            tocLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
            });
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

    // 6. Smooth scrolling for TOC links
    document.querySelectorAll('.blog-toc a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 110;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // 7. Reading Time estimation & word count
    const articleBody = document.getElementById('articleBody');
    const readingTimeEl = document.getElementById('readingTime');
    if (articleBody && readingTimeEl) {
        const text = articleBody.innerText || articleBody.textContent;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.max(1, Math.round(words / 220));
        readingTimeEl.textContent = minutes + ' min read';
    }

    // 8. FAQ Accordion
    document.querySelectorAll('.blog-faq-item').forEach(item => {
        const q = item.querySelector('.blog-faq-q');
        if (q) {
            q.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                document.querySelectorAll('.blog-faq-item.open').forEach(openItem => {
                    openItem.classList.remove('open');
                });
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        }
    });

    // 9. Share buttons
    document.querySelectorAll('[data-share]').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const type = btn.getAttribute('data-share');

            let shareUrl = '';
            switch (type) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + window.location.href)}`;
                    break;
                case 'copy':
                    copyLink();
                    return;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=650,height=500');
            }
        });
    });

    function copyLink() {
        const tempInput = document.createElement('textarea');
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Article link copied to clipboard.');
    }

    // 10. Comments form (no backend)
    const commentForm = document.getElementById('commentForm');
    const commentList = document.getElementById('commentList');
    const commentEmpty = document.getElementById('commentEmpty');

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('commentName').value.trim();
            const comment = document.getElementById('commentText').value.trim();

            if (!name || !comment) {
                showToast('Please fill in your name and comment.');
                return;
            }

            if (commentList && commentEmpty) {
                commentEmpty.style.display = 'none';

                const item = document.createElement('div');
                item.className = 'comment-item glass-panel';

                const avatarLetter = name.charAt(0).toUpperCase();
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                item.innerHTML = `
                    <div class="comment-avatar">${avatarLetter}</div>
                    <div class="comment-body">
                        <div class="comment-meta">
                            <strong>${escapeHtml(name)}</strong>
                            <time>${dateStr}</time>
                        </div>
                        <p>${escapeHtml(comment)}</p>
                    </div>
                `;

                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                commentList.prepend(item);

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 30);
                });

                commentForm.reset();
                showToast('Thank you! Your comment has been posted.');
            }
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // 11. Sidebar search (filters sidebar posts)
    const sidebarSearchInput = document.getElementById('sidebarSearchInput');
    if (sidebarSearchInput) {
        sidebarSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.sidebar-post').forEach(post => {
                const title = (post.querySelector('h4')?.textContent || '').toLowerCase();
                post.style.display = (!query || title.includes(query)) ? '' : 'none';
            });
        });
    }

    // 12. Newsletter forms
    document.querySelectorAll('.blog-newsletter-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && input.value.trim()) {
                form.reset();
                showToast('Successfully subscribed to the Inner Circle!');
            }
        });
    });

    // 13. Search Modal
    const searchTrigger = document.getElementById('searchTrigger');
    const searchModal = document.getElementById('searchModal');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchInput = document.getElementById('searchInput');
    const searchResultsList = document.getElementById('searchResultsList');

    const searchDatabase = [
        { title: 'Navigating Planetary Retrogrades with Grace', category: 'Astrology', link: 'blog-planetary-retrogrades.html' },
        { title: 'The Power of Sacred Numbers in Business Branding', category: 'Numerology', link: 'blog-sacred-numbers.html' },
        { title: 'Vastu Principles for Ultimate Wealth Attraction', category: 'Vastu', link: 'blog-vastu-wealth.html' },
        { title: 'Finding Inner Peace Through Spiritual Discipline', category: 'Spirituality', link: 'blog-inner-peace.html' },
        { title: 'Spiritual Leadership in the Modern World', category: 'Leadership', link: 'blog-spiritual-leadership.html' },
        { title: 'Ancient Wisdom for a Modern Life', category: 'Wisdom', link: 'blog-ancient-wisdom.html' },
        { title: 'Book Consultation', category: 'Service', link: 'index.html#contact' }
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

    // 14. Booking Modal
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

    // 15. Booking Form
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

    // 16. Toast Notification System
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