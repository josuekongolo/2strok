/**
 * 2 STRØK AS - Main JavaScript
 * Handles navigation, animations, form validation, and lightbox
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initHeader();
  initMobileNav();
  initScrollAnimations();
  initContactForm();
  initLightbox();
  initSmoothScroll();
});

/**
 * Header - Sticky behavior on scroll
 */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.pageYOffset;

    // Add shadow when scrolled
    if (currentScroll > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  }

  // Throttle scroll events for performance
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Mobile Navigation
 */
function initMobileNav() {
  const menuToggle = document.querySelector('.header__menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav__overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

  if (!menuToggle || !mobileNav) return;

  function openNav() {
    menuToggle.classList.add('header__menu-toggle--open');
    mobileNav.classList.add('mobile-nav--open');
    if (mobileNavOverlay) {
      mobileNavOverlay.classList.add('mobile-nav__overlay--visible');
    }
    document.body.style.overflow = 'hidden';
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    menuToggle.classList.remove('header__menu-toggle--open');
    mobileNav.classList.remove('mobile-nav--open');
    if (mobileNavOverlay) {
      mobileNavOverlay.classList.remove('mobile-nav__overlay--visible');
    }
    document.body.style.overflow = '';
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleNav() {
    if (mobileNav.classList.contains('mobile-nav--open')) {
      closeNav();
    } else {
      openNav();
    }
  }

  menuToggle.addEventListener('click', toggleNav);

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeNav);
  }

  // Close nav when clicking a link
  mobileNavLinks.forEach(function(link) {
    link.addEventListener('click', closeNav);
  });

  // Close nav on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--open')) {
      closeNav();
    }
  });

  // Close nav on window resize if open
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768 && mobileNav.classList.contains('mobile-nav--open')) {
      closeNav();
    }
  });
}

/**
 * Scroll Animations - Intersection Observer
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');

  if (!animatedElements.length || !('IntersectionObserver' in window)) {
    // Fallback: just show all elements
    animatedElements.forEach(function(el) {
      el.classList.add(el.classList.contains('fade-in') ? 'fade-in--visible' :
                       el.classList.contains('fade-in-left') ? 'fade-in-left--visible' :
                       el.classList.contains('fade-in-right') ? 'fade-in-right--visible' :
                       'scale-in--visible');
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;

        if (el.classList.contains('fade-in')) {
          el.classList.add('fade-in--visible');
        } else if (el.classList.contains('fade-in-left')) {
          el.classList.add('fade-in-left--visible');
        } else if (el.classList.contains('fade-in-right')) {
          el.classList.add('fade-in-right--visible');
        } else if (el.classList.contains('scale-in')) {
          el.classList.add('scale-in--visible');
        }

        observer.unobserve(el);
      }
    });
  }, observerOptions);

  animatedElements.forEach(function(el) {
    observer.observe(el);
  });
}

/**
 * Contact Form Validation
 */
function initContactForm() {
  const form = document.querySelector('.contact-form__form');
  if (!form) return;

  const fields = {
    name: {
      element: form.querySelector('#name'),
      validate: function(value) {
        if (!value.trim()) return 'Vennligst oppgi ditt navn';
        if (value.trim().length < 2) return 'Navn må være minst 2 tegn';
        return '';
      }
    },
    email: {
      element: form.querySelector('#email'),
      validate: function(value) {
        if (!value.trim()) return 'Vennligst oppgi din e-postadresse';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Vennligst oppgi en gyldig e-postadresse';
        return '';
      }
    },
    phone: {
      element: form.querySelector('#phone'),
      validate: function(value) {
        if (!value.trim()) return ''; // Phone is optional
        const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
        if (!phoneRegex.test(value)) return 'Vennligst oppgi et gyldig telefonnummer';
        return '';
      }
    },
    projectType: {
      element: form.querySelector('#project-type'),
      validate: function(value) {
        if (!value) return 'Vennligst velg prosjekttype';
        return '';
      }
    },
    message: {
      element: form.querySelector('#message'),
      validate: function(value) {
        if (!value.trim()) return 'Vennligst skriv din melding';
        if (value.trim().length < 10) return 'Meldingen må være minst 10 tegn';
        return '';
      }
    }
  };

  // Validate single field
  function validateField(fieldName) {
    const field = fields[fieldName];
    if (!field || !field.element) return true;

    const error = field.validate(field.element.value);
    const errorElement = field.element.parentElement.querySelector('.error-message');

    if (error) {
      field.element.classList.add('error');
      if (errorElement) {
        errorElement.textContent = error;
        errorElement.style.display = 'block';
      }
      return false;
    } else {
      field.element.classList.remove('error');
      if (errorElement) {
        errorElement.style.display = 'none';
      }
      return true;
    }
  }

  // Validate all fields
  function validateForm() {
    let isValid = true;
    Object.keys(fields).forEach(function(fieldName) {
      if (!validateField(fieldName)) {
        isValid = false;
      }
    });
    return isValid;
  }

  // Add blur event listeners for real-time validation
  Object.keys(fields).forEach(function(fieldName) {
    const field = fields[fieldName];
    if (field.element) {
      field.element.addEventListener('blur', function() {
        validateField(fieldName);
      });

      // Clear error on input
      field.element.addEventListener('input', function() {
        if (field.element.classList.contains('error')) {
          validateField(fieldName);
        }
      });

      // For select elements
      if (field.element.tagName === 'SELECT') {
        field.element.addEventListener('change', function() {
          validateField(fieldName);
        });
      }
    }
  });

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (validateForm()) {
      // Show success message
      const successMessage = form.querySelector('.form-success');
      if (successMessage) {
        successMessage.classList.add('form-success--visible');
      }

      // Reset form
      form.reset();

      // Hide success message after 5 seconds
      setTimeout(function() {
        if (successMessage) {
          successMessage.classList.remove('form-success--visible');
        }
      }, 5000);

      // In a real implementation, you would send the form data here
      console.log('Form submitted successfully');
    }
  });
}

/**
 * Lightbox for Project Gallery
 */
function initLightbox() {
  const projectCards = document.querySelectorAll('.project-card');
  const lightbox = document.querySelector('.lightbox');

  if (!projectCards.length || !lightbox) return;

  const lightboxImage = lightbox.querySelector('.lightbox__image');
  const lightboxCaption = lightbox.querySelector('.lightbox__caption');
  const lightboxClose = lightbox.querySelector('.lightbox__close');
  const lightboxPrev = lightbox.querySelector('.lightbox__nav--prev');
  const lightboxNext = lightbox.querySelector('.lightbox__nav--next');

  let currentIndex = 0;
  const images = [];

  // Collect all project images and data
  projectCards.forEach(function(card, index) {
    const img = card.querySelector('.project-card__image');
    const title = card.querySelector('.project-card__title');
    const type = card.querySelector('.project-card__type');
    const location = card.querySelector('.project-card__location');

    images.push({
      src: img ? img.src : '',
      alt: img ? img.alt : '',
      title: title ? title.textContent : '',
      type: type ? type.textContent : '',
      location: location ? location.textContent : ''
    });

    card.addEventListener('click', function() {
      openLightbox(index);
    });

    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Vis prosjekt: ' + (title ? title.textContent : 'Prosjekt ' + (index + 1)));

    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';

    // Focus trap
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';

    // Return focus to the clicked card
    if (projectCards[currentIndex]) {
      projectCards[currentIndex].focus();
    }
  }

  function updateLightboxContent() {
    const image = images[currentIndex];
    if (lightboxImage) {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
    }
    if (lightboxCaption) {
      lightboxCaption.innerHTML = '<strong>' + image.title + '</strong> - ' + image.type + ' ' + image.location;
    }
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxContent();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxContent();
  }

  // Event listeners
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function(e) {
      e.stopPropagation();
      showPrev();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function(e) {
      e.stopPropagation();
      showNext();
    });
  }

  // Close on background click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('lightbox--open')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrev();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Skip if just "#"
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(function() {
        inThrottle = false;
      }, limit);
    }
  };
}
