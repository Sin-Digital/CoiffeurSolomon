(() => {
    'use strict';

    /* ========== PRELOADER ========== */
    const preloader = document.getElementById('preloader');
    const preloaderCounter = document.getElementById('preloaderCounter');
    const preloaderBar = document.getElementById('preloaderBar');
    let loadProgress = 0;

    function animatePreloader() {
        const target = 100;
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            loadProgress = Math.round(eased * target);
            preloaderCounter.textContent = loadProgress;
            preloaderBar.style.width = loadProgress + '%';

            if (t < 1) {
                requestAnimationFrame(tick);
            } else {
                finishPreloader();
            }
        }
        requestAnimationFrame(tick);
    }

    function finishPreloader() {
        preloader.classList.add('done');
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            document.querySelector('.hero').classList.add('loaded');
            triggerHeroAnimations();
        }, 1000);
    }

    document.body.classList.add('no-scroll');
    animatePreloader();

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    /* ========== SCROLL PROGRESS ========== */
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    /* ========== NAVBAR ========== */
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    /* ========== HERO ANIMATIONS ========== */
    function triggerHeroAnimations() {
        const titleLines = document.querySelectorAll('.hero .title-line-inner');
        titleLines.forEach((line, i) => {
            setTimeout(() => line.classList.add('visible'), 200 + i * 150);
        });

        const subtitle = document.querySelector('.hero-subtitle');
        const buttons = document.querySelector('.hero-buttons');
        const badge = document.querySelector('.hero-badge');

        setTimeout(() => badge && badge.classList.add('visible'), 100);
        setTimeout(() => subtitle && subtitle.classList.add('visible'), 600);
        setTimeout(() => buttons && buttons.classList.add('visible'), 800);
    }

    /* ========== SCROLL REVEAL ========== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('img-reveal')) {
                    entry.target.classList.add('revealed');
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    /* ========== CTA TITLE ANIMATION ========== */
    const ctaTitleLines = document.querySelectorAll('.cta .title-line-inner');
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lines = entry.target.querySelectorAll('.title-line-inner');
                lines.forEach((line, i) => {
                    setTimeout(() => line.classList.add('visible'), i * 150);
                });
                ctaObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const ctaTitle = document.querySelector('.cta-title');
    if (ctaTitle) ctaObserver.observe(ctaTitle);

    /* ========== COUNTER ANIMATION ========== */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.trust-number[data-count]').forEach(el => counterObserver.observe(el));

    function animateCounter(element) {
        const target = parseFloat(element.dataset.count);
        const suffix = element.dataset.suffix || '';
        const isDecimal = target % 1 !== 0;
        const duration = 2200;
        const start = performance.now();

        function update(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 4);
            const current = target * eased;

            element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

            if (t < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    /* ========== 3D TILT EFFECT ========== */
    if (!isTouchDevice) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

                const shine = card.querySelector('.trust-card-shine, .review-card-glow');
                if (shine) {
                    shine.style.setProperty('--mouse-x', x + 'px');
                    shine.style.setProperty('--mouse-y', y + 'px');
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => { card.style.transition = ''; }, 500);
            });
        });
    }

    /* ========== MAGNETIC BUTTONS (disabled for stable button hover) ========== */

    /* ========== GALLERY DRAG SCROLL ========== */
    const galleryTrack = document.getElementById('galleryTrack');
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    if (galleryTrack) {
        galleryTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - galleryTrack.offsetLeft;
            scrollLeft = galleryTrack.scrollLeft;
            galleryTrack.style.cursor = 'grabbing';
        });

        galleryTrack.addEventListener('mouseleave', () => {
            isDragging = false;
            galleryTrack.style.cursor = 'grab';
        });

        galleryTrack.addEventListener('mouseup', () => {
            isDragging = false;
            galleryTrack.style.cursor = 'grab';
        });

        galleryTrack.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - galleryTrack.offsetLeft;
            const walk = (x - startX) * 1.5;
            galleryTrack.scrollLeft = scrollLeft - walk;
        });
    }

    /* ========== GALLERY LIGHTBOX ========== */
    const galleryItems = document.querySelectorAll('.gallery-item-inner');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCounter = document.getElementById('lightboxCounter');
    let currentIndex = 0;
    let clickStartX = 0;

    const images = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return { src: img.src.replace('w=800', 'w=1600'), alt: img.alt };
    });

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    function updateLightbox() {
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    galleryItems.forEach((item, i) => {
        item.addEventListener('mousedown', (e) => { clickStartX = e.pageX; });
        item.addEventListener('mouseup', (e) => {
            if (Math.abs(e.pageX - clickStartX) < 5) openLightbox(i);
        });
    });

    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev')?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    });
    document.querySelector('.lightbox-next')?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    });

    lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        }
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        }
    });

    /* ========== SMOOTH ANCHOR SCROLL ========== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });

    /* ========== PARALLAX (disabled for consistent hero framing) ========== */

    /* ========== ACTIVE NAV LINK ========== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function updateActiveLink() {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

})();
