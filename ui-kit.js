/* =============================================
   UI KIT — interacciones de demo
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initSwatchCopy();
  initAccordionDemo();
  initFlipCardDemo();
});

/* ── Colores: click para copiar el hex ── */
function initSwatchCopy() {
  const swatches = document.querySelectorAll('.kit-swatch');

  swatches.forEach((swatch) => {
    const hex = swatch.getAttribute('data-hex');
    const nameEl = swatch.querySelector('.kit-swatch__name');
    const originalText = nameEl ? nameEl.textContent : '';

    swatch.addEventListener('click', () => {
      if (!hex) return;

      navigator.clipboard.writeText(hex).then(() => {
        if (!nameEl) return;
        nameEl.textContent = 'Copiado ✓';
        nameEl.classList.add('kit-swatch__copied');

        setTimeout(() => {
          nameEl.textContent = originalText;
          nameEl.classList.remove('kit-swatch__copied');
        }, 1200);
      });
    });
  });
}

/* ── Acordeón: mismo patrón que FAQ (sin imagen dinámica acá) ── */
function initAccordionDemo() {
  const items = document.querySelectorAll('#accordionKit .accordion__item');
  if (!items.length) return;

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

      if (isActive) return;

      item.classList.add('accordion__item--active');
      header.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  });
}

/* ── Flip card: click para dar vuelta ── */
function initFlipCardDemo() {
  const cards = document.querySelectorAll('#cards .flip-card');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const isFlipped = card.classList.toggle('flip-card--flipped');
      card.setAttribute('aria-pressed', String(isFlipped));
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}
