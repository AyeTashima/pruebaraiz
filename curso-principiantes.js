/* =============================================
   CURSO PRINCIPIANTES — acordeones + stagger
   ============================================= */

/* ── HEADER: fondo blanco + sombra al scrollear ── */
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
  handleScroll();
}

/* ── MENÚ MOBILE ── */
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

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('mobile-menu--active');
      burger.classList.remove('header__burger--active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initFaqAccordion();
  initContenidosPanels();
});

/* ── FAQ: acordeón con imagen dinámica (igual que v2) ── */
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

/* ── TESTIMONIOS: cada card entra desde abajo mientras scrolleás, una
   por tercio del scroll de la sección. Todo atado 1:1 a la rueda del
   mouse (sin transiciones CSS). Solo desktop. ── */
(function () {
  const cards = document.querySelectorAll('.testimonio-card');
  const section = document.querySelector('.curso-testimonios');
  if (!cards.length || !section) return;

  function isDesktop() {
    return window.innerWidth >= 769;
  }

  const baseTransform = {
    'testimonio-card--1': { rotate: -4, x: -40 },
    'testimonio-card--2': { rotate: 3, x: 0 },
    'testimonio-card--3': { rotate: -2, x: 40 },
  };

  const ENTRY_DISTANCE = 120; // px que recorre cada card al entrar desde abajo

 function handleScroll() {
  if (!isDesktop()) {
    cards.forEach((card) => {
      card.style.opacity = '';
      card.style.transform = '';
    });
    return;
  }

  const rect = section.getBoundingClientRect();
  const scrollableHeight = section.offsetHeight - window.innerHeight;
  const progress = scrollableHeight > 0
    ? Math.min(Math.max(-rect.top / scrollableHeight, 0), 1)
    : 0;

  const totalCards = cards.length;
  const scrollPosition = window.scrollY;

  // Las 3 cards terminan de aparecer dentro del primer 55% del scroll fijado;
  // el 45% restante queda "en pausa" con todo ya visible, para poder leer.
  const REVEAL_FRACTION = 0.55;

  cards.forEach((card, index) => {
    const segmentStart = (index / totalCards) * REVEAL_FRACTION;
    const segmentSize = REVEAL_FRACTION / totalCards;
    const localProgress = Math.min(Math.max((progress - segmentStart) / segmentSize, 0), 1);

    const modifierClass = Array.from(card.classList).find((c) => baseTransform[c]);
    const base = baseTransform[modifierClass] || { rotate: 0, x: 0 };

    const speed = (index + 1) * 0.05;
    const rotationModifier = index % 2 === 0 ? -1 : 1;
    const extraRotation = (scrollPosition * 0.01 * rotationModifier) + (index * 2);
    const extraY = scrollPosition * speed * 0.1;

    const entryOffset = (1 - localProgress) * ENTRY_DISTANCE;

    card.style.opacity = String(localProgress);
    card.style.transform =
      `rotate(${base.rotate + extraRotation * 0.2}deg) translateX(${base.x}px) translateY(${entryOffset + extraY}px)`;
  });
}

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
})();

// 5 cards desplegables

function initContenidosPanels() {
  const panels = document.querySelectorAll('#contenidosPanels [data-panel]');
  if (!panels.length) return;

  panels.forEach((panel) => {
    panel.addEventListener('click', () => {
      const isActive = panel.classList.contains('is-active');

      panels.forEach((p) => p.classList.remove('is-active'));

      if (!isActive) {
        panel.classList.add('is-active');
      }
    });
  });
}