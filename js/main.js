/**
 * Main JavaScript File
 * ParryApplications Portfolio Website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initScrollEffects();
    initForms();
    initAnimations();
    
    // Initialize Firebase
    if (typeof initializeFirebase === 'function') {
        initializeFirebase();
    }
});

// ===== Preloader =====
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 500);
        });
    }
}

// ===== Navigation =====
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Active link highlighting
    highlightActiveLink();
    window.addEventListener('scroll', highlightActiveLink);
}

function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== Scroll Effects =====
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===== Form Handling =====
function initForms() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // App Development Form
    const appDevForm = document.getElementById('appDevForm');
    if (appDevForm) {
        appDevForm.addEventListener('submit', handleAppDevFormSubmit);
    }

    // Tutor Form
    const tutorForm = document.getElementById('tutorForm');
    if (tutorForm) {
        tutorForm.addEventListener('submit', handleTutorFormSubmit);
    }

    // Check tutor vacancy status
    checkAndUpdateTutorButton();
}

async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const alert = document.getElementById('contactAlert');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Get form data
    const formData = {
        Name: form.querySelector('#name').value,
        Email: form.querySelector('#email').value,
        Phone: form.querySelector('#phone').value,
        Message: form.querySelector('#message')?.value || ''
    };
    
    // Validate phone number
    if (formData.Phone.length !== 10) {
        showAlert(alert, 'Please enter a valid 10-digit phone number', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        return;
    }
    
    try {
        // Submit to Firebase
        if (typeof submitContactForm === 'function') {
            const result = await submitContactForm(formData, 'Counselling');
            showAlert(alert, result.message, 'success');
            form.reset();
        } else {
            throw new Error('Firebase not initialized');
        }
    } catch (error) {
        showAlert(alert, error.message || 'Something went wrong. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
}

async function handleAppDevFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const alert = document.getElementById('appDevAlert');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Get form data
    const formData = {
        Name: form.querySelector('#devName').value,
        Email: form.querySelector('#devEmail').value,
        Phone: form.querySelector('#devPhone').value,
        AppDatabaseRequest: form.querySelector('#database')?.value || '',
        UI_Info: form.querySelector('input[name="uiDesign"]:checked')?.value || '',
        Apptype: form.querySelector('#appType').value,
        ApptypeOther: form.querySelector('#otherAppType')?.value || '',
        Features: form.querySelector('#features')?.value || '',
        Message: form.querySelector('#devMessage')?.value || ''
    };
    
    // Validate
    if (formData.Phone.length !== 10) {
        showAlert(alert, 'Please enter a valid 10-digit phone number', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Request';
        return;
    }
    
    if (!formData.UI_Info) {
        showAlert(alert, 'Please select UI design option', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Request';
        return;
    }
    
    try {
        if (typeof submitContactForm === 'function') {
            const result = await submitContactForm(formData, 'DevAppRequest');
            showAlert(alert, result.message, 'success');
            form.reset();
        } else {
            throw new Error('Firebase not initialized');
        }
    } catch (error) {
        showAlert(alert, error.message || 'Something went wrong. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Request';
    }
}

async function handleTutorFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const alert = document.getElementById('tutorAlert');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    const formData = {
        Name: form.querySelector('#tutorName').value,
        Email: form.querySelector('#tutorEmail').value,
        Phone: form.querySelector('#tutorPhone').value,
        Qualification: form.querySelector('#qualification')?.value || '',
        Subject: form.querySelector('#subject')?.value || '',
        Experience: form.querySelector('#experience')?.value || '',
        Message: form.querySelector('#tutorMessage')?.value || ''
    };
    
    if (formData.Phone.length !== 10) {
        showAlert(alert, 'Please enter a valid 10-digit phone number', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
        return;
    }
    
    try {
        if (typeof submitContactForm === 'function') {
            const result = await submitContactForm(formData, 'BecomeTutorRequests');
            showAlert(alert, result.message, 'success');
            form.reset();
        } else {
            throw new Error('Firebase not initialized');
        }
    } catch (error) {
        showAlert(alert, error.message || 'Something went wrong. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
    }
}

function showAlert(alertElement, message, type) {
    if (!alertElement) return;
    
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type} show`;
    
    setTimeout(() => {
        alertElement.classList.remove('show');
    }, 5000);
}

async function checkAndUpdateTutorButton() {
    const tutorBtn = document.getElementById('becomeTutorBtn');
    const tutorSection = document.getElementById('become-tutor');
    
    try {
        if (typeof checkTutorVacancy === 'function') {
            const isVacancyAvailable = await checkTutorVacancy();
            
            if (!isVacancyAvailable) {
                // Vacancy is NOT available (BecomeATutor = false), so HIDE everything
                if (tutorBtn) {
                    tutorBtn.style.display = 'none';
                }
                
                // Hide the entire "Become a Tutor" section
                if (tutorSection) {
                    tutorSection.style.display = 'none';
                }
                
                // Hide all footer links to become a tutor
                document.querySelectorAll('a[href*="become-tutor"]').forEach(link => {
                    if (link.id !== 'becomeTutorBtn') {
                        link.style.display = 'none';
                    }
                });
                
                console.log('Tutor vacancy not available - elements hidden');
            } else {
                // Vacancy IS available (BecomeATutor = true or null), so SHOW everything
                if (tutorBtn) {
                    tutorBtn.style.display = '';
                }
                
                if (tutorSection) {
                    tutorSection.style.display = '';
                }
                
                document.querySelectorAll('a[href*="become-tutor"]').forEach(link => {
                    link.style.display = '';
                });
                
                console.log('Tutor vacancy available - elements shown');
            }
        }
    } catch (error) {
        console.error('Error checking tutor vacancy:', error);
        // On error, show elements by default
    }
}

// ===== Animations =====
function initAnimations() {
    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle app type selection (show/hide other input)
function handleAppTypeChange(selectElement) {
    const otherInput = document.getElementById('otherAppType');
    if (otherInput) {
        if (selectElement.value === 'other') {
            otherInput.parentElement.style.display = 'block';
            otherInput.required = true;
        } else {
            otherInput.parentElement.style.display = 'none';
            otherInput.required = false;
        }
    }
}

// Export functions for global use
window.handleAppTypeChange = handleAppTypeChange;
