/* =========================================
   Bella Sicilia - Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var target = document.querySelector(targetId);
            if (target) {
                var navHeight = navbar.offsetHeight;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Intersection Observer for fade-in animations ---
    var fadeElements = document.querySelectorAll(
        '.produit-card, .distribution-card, .info-card, .histoire-text, .histoire-image, ' +
        '.specialites-banner, .depot-card, .contact-form-wrapper, .contact-side-card'
    );

    fadeElements.forEach(function (el) {
        el.classList.add('fade-in');
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(function (el) {
        observer.observe(el);
    });

    // --- Animated counter ---
    var statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(element) {
        var target = parseInt(element.getAttribute('data-target'), 10);
        var duration = 2000;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }

    var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (num) {
        statsObserver.observe(num);
    });

    // --- Active nav link highlight ---
    var sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        var scrollY = window.pageYOffset + navbar.offsetHeight + 100;

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // --- Contact form handling ---
    var contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var formData = new FormData(contactForm);
        var name = formData.get('name');
        var email = formData.get('email');
        var phone = formData.get('phone');
        var subject = formData.get('subject');
        var message = formData.get('message');

        // Build mailto link as fallback
        var subjectText = subject ? 'Contact - ' + subject : 'Contact depuis le site web';
        var body = 'Nom: ' + name + '\nEmail: ' + email + '\nTéléphone: ' + (phone || 'Non renseigné') + '\n\nMessage:\n' + message;
        var mailtoLink = 'mailto:info@sprlbellasicilia.com?subject=' +
            encodeURIComponent(subjectText) +
            '&body=' + encodeURIComponent(body);

        window.location.href = mailtoLink;

        // Show confirmation
        var btn = contactForm.querySelector('.btn-submit');
        var originalText = btn.textContent;
        btn.textContent = 'Message préparé !';
        btn.style.backgroundColor = '#2D6A4F';
        btn.style.borderColor = '#2D6A4F';

        setTimeout(function () {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.style.borderColor = '';
        }, 3000);
    });

});
