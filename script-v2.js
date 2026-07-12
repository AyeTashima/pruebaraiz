/* ==========================================================================
   RAÍZ V2 — SCRIPT (Etapa 1: Header + Hero)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initHeroAnimation();
  initHeroReveal();
  
  initFaqAccordion();
  initStatsCounter();
  initFlipCards();
  initBeforeAfterSlider();
  initCursosStagger();
  initTestimoniosSlider();
  initContactForm();
  initCapsulaCarousel();
  initScrollAnim();
  initProcesoSteps();
});

/* --------------------------------------------------------------------------
   1. HEADER: cambia a fondo blanco + sombra al hacer scroll
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const SCROLL_THRESHOLD = 40;

  function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // estado inicial correcto si la página carga con scroll > 0
}

/* --------------------------------------------------------------------------
   2. MENÚ MOBILE: abrir/cerrar con el botón hamburguesa
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const burger = document.getElementById('headerBurger');
  const menu = document.getElementById('mobileMenu');

  function toggleMenu() {
    const isOpen = menu.classList.toggle('mobile-menu--active');
    burger.classList.toggle('header__burger--active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  burger.addEventListener('click', toggleMenu);

  // Cerrar el menú al hacer click en cualquier link (mejora la navegación)
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('mobile-menu--active');
      burger.classList.remove('header__burger--active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   3. HERO: animación de entrada (título izquierda, título derecha, botón)
   Se dispara una sola vez al cargar, con un pequeño delay escalonado.
   -------------------------------------------------------------------------- */
function initHeroAnimation() {
  const elements = document.querySelectorAll('#hero [data-anim]');

  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('is-visible');
    }, 200 + index * 150);
  });
}

/* --------------------------------------------------------------------------
   3b. HERO: Nosotros sube y tapa al Hero al hacer scroll (parallax reveal).
   -------------------------------------------------------------------------- */
function initHeroReveal() {
  const hero = document.getElementById('hero');
  const nosotros = document.getElementById('nosotros');
  if (!hero || !nosotros) return;

  const RUNWAY = window.innerHeight * 0.4;

  function update() {
    const progress = Math.min(Math.max(window.scrollY / RUNWAY, 0), 1);
    const offset = (1 - progress) * window.innerHeight;
    nosotros.style.transform = `translateY(${offset}px)`;

    // visibility + opacity en vez de display: no fuerzan un recálculo
    // de layout, así que no generan el flash blanco al cambiar.
    if (progress >= 1) {
      hero.style.visibility = 'hidden';
      hero.style.opacity = '0';
    } else {
      hero.style.visibility = 'visible';
      hero.style.opacity = '1';
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}


/* --------------------------------------------------------------------------
   4. NOSOTROS: acordeón (solo uno abierto a la vez) + imagen que cambia
   con fade según la card activa. Ninguna card abierta por defecto.
   -------------------------------------------------------------------------- */
function initNosotrosAccordion() {
  const items = document.querySelectorAll('#accordionNosotros .accordion__item');
   // imagen por defecto (ninguna card activa)

  items.forEach((item) => {
    const header = item.querySelector('.accordion__header');
    const panel = item.querySelector('.accordion__panel');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('accordion__item--active');

      // Cierra todas las cards
      items.forEach((otherItem) => {
        otherItem.classList.remove('accordion__item--active');
        otherItem.querySelector('.accordion__header').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.accordion__panel').style.maxHeight = null;
      });

      if (isActive) {
        // Si ya estaba abierta, la cerramos y volvemos a la imagen por defecto
        swapImage(defaultSrc);
        return;
      }

      // Abre la card clickeada
      item.classList.add('accordion__item--active');
      header.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';

      swapImage(item.getAttribute('data-image'));
    });
  });

  function swapImage(newSrc) {
    if (!newSrc || image.getAttribute('src') === newSrc) return;

    image.classList.add('nosotros__image--fading');

    setTimeout(() => {
      image.setAttribute('src', newSrc);
      image.classList.remove('nosotros__image--fading');
    }, 350); // debe coincidir con la transición definida en .nosotros__image
  }
}

/* --------------------------------------------------------------------------
   5b. PREGUNTAS FRECUENTES: mismo patrón de acordeón que Nosotros
   (una sola pregunta abierta a la vez, imagen cambia con fade,
   ninguna abierta por defecto).
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('#accordionFaq .accordion__item');
  const image = document.getElementById('faqImage');
  if (!items.length || !image) return;

  const defaultSrc = image.getAttribute('src');

  items.forEach((item) => {
    const header = item.querySelector('.accordion__header');
    const panel = item.querySelector('.accordion__panel');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('accordion__item--active');

      items.forEach((otherItem) => {
        otherItem.classList.remove('accordion__item--active');
        otherItem.querySelector('.accordion__header').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.accordion__panel').style.maxHeight = null;
      });

      if (isActive) {
        swapImage(defaultSrc);
        return;
      }

      item.classList.add('accordion__item--active');
      header.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';

      swapImage(item.getAttribute('data-image'));
    });
  });

  function swapImage(newSrc) {
    if (!newSrc || image.getAttribute('src') === newSrc) return;

    image.classList.add('faq__image--fading');

    setTimeout(() => {
      image.setAttribute('src', newSrc);
      image.classList.remove('faq__image--fading');
    }, 350);
  }
}

/* --------------------------------------------------------------------------
   5. FRANJA DE NÚMEROS: contador animado de 0 al valor final,
   disparado cuando la franja entra en el viewport.
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const numbers = document.querySelectorAll('.stats__number');
  if (!numbers.length) return;

  const DURATION = 1500; // ms

  function animateNumber(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / DURATION, 1);
      const value = Math.floor(progress * target);
      el.textContent = prefix + value;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target;
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        numbers.forEach(animateNumber);
        obs.disconnect(); // se anima una sola vez
      }
    });
  }, { threshold: 0.4 });

  observer.observe(document.getElementById('stats'));
}

/* --------------------------------------------------------------------------
   6. VOLVER A LAS RAÍCES: flip de las cards al hacer click/tap.
   El hover (lift + sombra) se maneja solo con CSS.
   -------------------------------------------------------------------------- */
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');

  cards.forEach((card) => {
    function toggleFlip() {
      const isFlipped = card.classList.toggle('flip-card--flipped');
      card.setAttribute('aria-pressed', String(isFlipped));
    }

    card.addEventListener('click', toggleFlip);

    // Accesibilidad: permite flip con teclado (Enter / Espacio)
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFlip();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. ANTES Y DESPUÉS: slider de comparación con barra vertical arrastrable
   (mouse en desktop, touch en mobile).
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const slider = document.getElementById('baSlider');
  if (!slider) return;

  const beforeImg = document.getElementById('baBeforeImg');
  const handle = document.getElementById('baHandle');

  let isDragging = false;

  function setPosition(percent) {
    const clamped = Math.min(Math.max(percent, 0), 100);
    beforeImg.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
    handle.style.left = clamped + '%';
  }

  function positionFromEvent(clientX) {
    const rect = slider.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(percent);
  }

  function startDrag(clientX) {
    isDragging = true;
    positionFromEvent(clientX);
  }

  function moveDrag(clientX) {
    if (!isDragging) return;
    positionFromEvent(clientX);
  }

  function endDrag() {
    isDragging = false;
  }

  // --- Mouse ---
  slider.addEventListener('mousedown', (e) => startDrag(e.clientX));
  window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
  window.addEventListener('mouseup', endDrag);

  // --- Touch ---
  slider.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (isDragging) moveDrag(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', endDrag);

  setPosition(60); // posición inicial de la barra (60% desde la izquierda)
}

/* --------------------------------------------------------------------------
   8. CURSOS: las 3 cards aparecen una por una (stagger) cuando la
   grilla entra en el viewport.
   -------------------------------------------------------------------------- */
function initCursosStagger() {
  const cards = document.querySelectorAll('.curso-card[data-stagger]');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        cards.forEach((card, index) => {
          setTimeout(() => card.classList.add('is-visible'), index * 150);
        });
        obs.disconnect(); // se anima una sola vez
      }
    });
  }, { threshold: 0.2 });

  observer.observe(document.getElementById('cursos'));
}

/* --------------------------------------------------------------------------
   9. TESTIMONIOS: slider con flechas, dots, drag (desktop) y swipe (mobile).
   -------------------------------------------------------------------------- */
function initTestimoniosSlider() {
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testimonio-card'));
  const total = cards.length;
  let currentIndex = 0;
  let dots = [];

  function visibleCount() {
    return window.innerWidth <= 700 ? 1 : 3;
  }

  function maxIndex() {
    return total - visibleCount();
  }

  // --- Dots dinámicos: uno por cada posición ALCANZABLE, no uno por card.
  // En desktop (3 visibles de 6) hay 4 posiciones posibles (0,1,2,3).
  // En mobile (1 visible de 6) hay 6 posiciones posibles (0 a 5). ---
  function buildDots() {
    dotsWrap.innerHTML = '';
    const dotCount = maxIndex() + 1;

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('button');
      dot.className = 'testimonios__dot';
      dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }

    dots = Array.from(dotsWrap.children);
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));

    const cardWidth = cards[0].getBoundingClientRect().width + 24; // + gap
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    dots.forEach((dot, i) => dot.classList.toggle('testimonios__dot--active', i === currentIndex));
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // --- Swipe táctil ---
  let touchStartX = 0;
  let touchDeltaX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    track.classList.add('dragging');
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    track.classList.remove('dragging');
    if (Math.abs(touchDeltaX) > 50) {
      goTo(touchDeltaX < 0 ? currentIndex + 1 : currentIndex - 1);
    }
    touchDeltaX = 0;
  });

  // --- Drag con mouse (desktop) ---
  let mouseStartX = 0;
  let isDragging = false;

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    mouseStartX = e.clientX;
    track.classList.add('dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    touchDeltaX = e.clientX - mouseStartX;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    if (Math.abs(touchDeltaX) > 60) {
      goTo(touchDeltaX < 0 ? currentIndex + 1 : currentIndex - 1);
    }
    touchDeltaX = 0;
  });

  // Recalcular al cambiar tamaño de pantalla (rearma los dots si cambia
  // la cantidad de posiciones alcanzables, ej. al pasar de mobile a desktop)
  let lastDotCount = null;
  window.addEventListener('resize', () => {
    const newDotCount = maxIndex() + 1;
    if (newDotCount !== lastDotCount) {
      buildDots();
      lastDotCount = newDotCount;
    }
    goTo(Math.min(currentIndex, maxIndex()));
  });

  buildDots();
  lastDotCount = maxIndex() + 1;
  goTo(0);
}

/* --------------------------------------------------------------------------
   10. CONTACTO: validación simple en JS (sin backend) + mensaje de
   confirmación al enviar correctamente.
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactoForm');
  if (!form) return;

  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const mensaje = document.getElementById('mensaje');
  const successMsg = document.getElementById('contactoSuccess');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, errorId, message) {
    const errorEl = document.getElementById(errorId);
    input.closest('.form-group').classList.toggle('form-group--error', Boolean(message));
    errorEl.textContent = message || '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.textContent = '';

    let isValid = true;

    if (!nombre.value.trim()) {
      setError(nombre, 'errorNombre', 'Ingresá tu nombre.');
      isValid = false;
    } else {
      setError(nombre, 'errorNombre', '');
    }

    if (!email.value.trim()) {
      setError(email, 'errorEmail', 'Ingresá tu email.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(email.value.trim())) {
      setError(email, 'errorEmail', 'Ingresá un email válido.');
      isValid = false;
    } else {
      setError(email, 'errorEmail', '');
    }

    if (!mensaje.value.trim()) {
      setError(mensaje, 'errorMensaje', 'Escribí tu mensaje.');
      isValid = false;
    } else {
      setError(mensaje, 'errorMensaje', '');
    }

    if (!isValid) return;

    // Sin backend: solo mostramos la confirmación y reseteamos el formulario.
    successMsg.textContent = '¡Gracias! Recibimos tu consulta, te vamos a responder pronto.';
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   11. CÁPSULA: carrusel infinito con auto-scroll continuo (más rápido que
   antes) + flechas para navegar manualmente. Al usar una flecha, el
   auto-scroll se pausa y retoma solo a los 3s de inactividad.
   -------------------------------------------------------------------------- */
function initCapsulaCarousel() {
  const track = document.getElementById('capsulaTrack');
  const prevBtn = document.getElementById('capsulaPrev');
  const nextBtn = document.getElementById('capsulaNext');
  if (!track) return;

  const AUTO_SPEED = 70; // px por segundo
  const RESUME_DELAY = 3000; // ms sin tocar las flechas para retomar el auto-scroll

  let offset = 0;
  let halfWidth = 0;
  let slideStep = 428; // se recalcula en updateMeasurements()
  let isAutoPlaying = true;
  let resumeTimeout = null;
  let lastTime = null;

  function updateMeasurements() {
    // En mobile, fija el ancho de cada slide al ancho real del panel (en px),
    // para que sea siempre exactamente "una pantalla" sin depender de vw
    // (que cuenta la scrollbar) ni de % (que no tiene base con este layout).
    const panel = document.querySelector('.capsula__carousel-panel');
    const isMobile = window.innerWidth <= 860;

    if (isMobile && panel) {
      const panelWidth = panel.getBoundingClientRect().width;
      track.querySelectorAll('.capsula__slide').forEach((slide) => {
        slide.style.width = panelWidth + 'px';
      });
    } else {
      track.querySelectorAll('.capsula__slide').forEach((slide) => {
        slide.style.width = ''; // vuelve a los 420px del CSS en desktop
      });
    }

    // El track tiene el set de imágenes duplicado: la mitad es un loop completo.
    halfWidth = track.scrollWidth / 2;

    // Ancho real del primer slide + su margin-right (se adapta a mobile/desktop)
    const firstSlide = track.children[0];
    if (firstSlide) {
      const rect = firstSlide.getBoundingClientRect();
      const marginRight = parseFloat(getComputedStyle(firstSlide).marginRight) || 0;
      slideStep = rect.width + marginRight;
    }
  }

  function applyOffset() {
    track.style.transform = `translateX(-${offset}px)`;
  }

  function normalizeOffset() {
    if (offset >= halfWidth) offset -= halfWidth;
    if (offset < 0) offset += halfWidth;
  }

  function tick(now) {
    if (lastTime === null) lastTime = now;
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    if (isAutoPlaying) {
      offset += AUTO_SPEED * delta;
      normalizeOffset();
      applyOffset();
    }

    requestAnimationFrame(tick);
  }

  function pauseAndScheduleResume() {
    isAutoPlaying = false;
    lastTime = null;

    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      isAutoPlaying = true;
    }, RESUME_DELAY);
  }

  function goToStep(direction) {
  pauseAndScheduleResume();

  // Redondea la posición actual al slide más cercano antes de moverse,
  // así el punto de partida siempre es una imagen completa (nunca a mitad).
  offset = Math.round(offset / slideStep) * slideStep;

  offset += direction * slideStep;
  normalizeOffset();
  applyOffset();
}

  prevBtn.addEventListener('click', () => goToStep(-1));
  nextBtn.addEventListener('click', () => goToStep(1));

// Pausa el auto-scroll mientras el mouse está sobre el carrusel
track.addEventListener('mouseenter', () => {
  isAutoPlaying = false;
});

track.addEventListener('mouseleave', () => {
  isAutoPlaying = true;
  lastTime = null;
});

  window.addEventListener('resize', updateMeasurements);

  updateMeasurements();
  requestAnimationFrame(tick);
}

/* --------------------------------------------------------------------------
   12. ANIMACIÓN GENÉRICA AL SCROLL: agrega .is-visible a cualquier
   sección con [data-scroll-anim] cuando entra en el viewport.
   -------------------------------------------------------------------------- */
function initScrollAnim() {
  const sections = document.querySelectorAll('[data-scroll-anim]');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   13. anim linea de tiempo
   -------------------------------------------------------------------------- */

function initProcesoSteps() {
  const items = document.querySelectorAll('#procesoSteps .proceso-step');
  const image = document.getElementById('procesoImage');
  if (!items.length || !image) return;

  const defaultSrc = image.getAttribute('src');

  items.forEach((item) => {
    const header = item.querySelector('.proceso-step__header');
    const panel = item.querySelector('.proceso-step__panel');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('proceso-step--active');

      items.forEach((otherItem) => {
        otherItem.classList.remove('proceso-step--active');
        otherItem.querySelector('.proceso-step__header').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.proceso-step__panel').style.maxHeight = null;
      });

      if (isActive) {
        swapImage(defaultSrc);
        return;
      }

      item.classList.add('proceso-step--active');
      header.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';

      swapImage(item.getAttribute('data-image'));
    });
  });

  function swapImage(newSrc) {
    if (!newSrc || image.getAttribute('src') === newSrc) return;
    image.classList.add('proceso__image--fading');
    setTimeout(() => {
      image.setAttribute('src', newSrc);
      image.classList.remove('proceso__image--fading');
    }, 350);
  }
}