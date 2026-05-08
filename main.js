/* ===========================================
   PROJETO STEM — Main JavaScript
   =========================================== */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '258826311111';

  // ---------------------------------------------
  // AOS Animations
  // ---------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  // ---------------------------------------------
  // Header scroll effect
  // ---------------------------------------------
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------------------------------------------
  // Mobile menu toggle
  // ---------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isActive = mainNav.classList.toggle('active');
      menuToggle.classList.toggle('active', isActive);
      menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------------------------------------------
  // Countdown timer (auto-renews every 7 days)
  // ---------------------------------------------
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const STORAGE_KEY = 'projetoStem_countdownEnd';
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    let endTime = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (!endTime || isNaN(endTime) || endTime < Date.now()) {
      endTime = Date.now() + SEVEN_DAYS;
      localStorage.setItem(STORAGE_KEY, String(endTime));
    }

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    const pad = n => String(n).padStart(2, '0');

    const updateCountdown = () => {
      let diff = endTime - Date.now();
      if (diff <= 0) {
        endTime = Date.now() + SEVEN_DAYS;
        localStorage.setItem(STORAGE_KEY, String(endTime));
        diff = endTime - Date.now();
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(mins);
      if (sEl) sEl.textContent = pad(secs);
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ---------------------------------------------
  // Animated counters (hero stats)
  // ---------------------------------------------
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length && 'IntersectionObserver' in window) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(c => observer.observe(c));
  }

  // ---------------------------------------------
  // Contact form → send to WhatsApp
  // ---------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = (document.getElementById('nome')?.value || '').trim();
      const telefone = (document.getElementById('telefone')?.value || '').trim();
      const servico = (document.getElementById('servico')?.value || '').trim();
      const mensagem = (document.getElementById('mensagem')?.value || '').trim();

      if (!nome || !telefone || !servico) {
        alert('Por favor preencha os campos obrigatórios: Nome, Telefone e Serviço.');
        return;
      }

      const texto =
        `*Nova inscrição - Projeto STEM*%0A%0A` +
        `*Nome:* ${encodeURIComponent(nome)}%0A` +
        `*Telefone:* ${encodeURIComponent(telefone)}%0A` +
        `*Serviço de interesse:* ${encodeURIComponent(servico)}%0A` +
        (mensagem ? `*Mensagem:* ${encodeURIComponent(mensagem)}%0A` : '') +
        `%0AVim pelo site. Aguardo o contacto!`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, '_blank');

      setTimeout(() => {
        contactForm.reset();
        alert('✅ Obrigado! Será redirecionado para o WhatsApp. Responderemos em breve.');
      }, 300);
    });
  }

  // ---------------------------------------------
  // Rotating floating WhatsApp (attention grab)
  // ---------------------------------------------
  const floatWa = document.getElementById('floatWhatsapp');
  if (floatWa) {
    setInterval(() => {
      floatWa.classList.add('shake');
      setTimeout(() => floatWa.classList.remove('shake'), 700);
    }, 8000);
  }

  // ---------------------------------------------
  // Exit intent → shake WhatsApp button
  // ---------------------------------------------
  let exitTriggered = false;
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 10 && !exitTriggered && floatWa) {
      exitTriggered = true;
      floatWa.classList.add('shake');
      setTimeout(() => floatWa.classList.remove('shake'), 700);
    }
  });

  // ---------------------------------------------
  // Smooth scroll (enhancement for older browsers)
  // ---------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------------------------------------------
  // Current year in footer
  // ---------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
