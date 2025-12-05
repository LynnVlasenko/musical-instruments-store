// Partners carousel: true infinite loop using cloned blocks + autoplay every 3s
export function initPartnersCarousel() {
  const sections = document.querySelectorAll('.partners');
  if (!sections.length) return;

  sections.forEach((section) => {
    // avoid double-initialization
    if (section.dataset.carouselInitialized === 'true') return;

    const list = section.querySelector('.partners__list');
    const nextBtn = section.querySelector('.carousel-arrow--next');
    const prevBtn = section.querySelector('.carousel-arrow--prev');
    if (!list || !nextBtn || !prevBtn) return;

    const originalItems = Array.from(list.children).map((n) => n.cloneNode(true));
    if (!originalItems.length) return;

    const cs = getComputedStyle(list);
    const gap = cs.gap ? parseFloat(cs.gap) : 0;

    // Prepare loop: prepend a clone-block and append a clone-block so originals sit in the middle
    // Prepend reversed clones
    originalItems.slice().reverse().forEach((node) => {
      list.insertBefore(node.cloneNode(true), list.firstChild);
    });
    // Append clones
    originalItems.forEach((node) => list.appendChild(node.cloneNode(true)));

    const allItems = Array.from(list.querySelectorAll('.partners__item'));
    const originalCount = originalItems.length;

    // compute width of one original block
    let originalWidth = 0;
    for (let i = originalCount; i < originalCount * 2; i++) {
      originalWidth += allItems[i].offsetWidth;
      if (i !== originalCount * 2 - 1) originalWidth += gap;
    }

    // start in the middle block
    list.scrollLeft = originalWidth;

    const stepWidth = () => {
      const firstIndex = originalCount; // start of middle block
      return Math.round(allItems[firstIndex].offsetWidth + gap);
    };

    const scrollNext = (smooth = true) => {
      list.scrollBy({ left: stepWidth(), behavior: smooth ? 'smooth' : 'auto' });
    };

    const scrollPrev = (smooth = true) => {
      list.scrollBy({ left: -stepWidth(), behavior: smooth ? 'smooth' : 'auto' });
    };

    // When the visible window moves outside the middle block, jump it back by one block
    const adjustIfNeeded = () => {
      // if past the end of middle block
      if (list.scrollLeft >= originalWidth * 2 - 1) {
        list.scrollLeft = list.scrollLeft - originalWidth;
      }
      // if before the start of middle block
      if (list.scrollLeft <= 1) {
        list.scrollLeft = list.scrollLeft + originalWidth;
      }
    };

    let scrollTick = null;
    list.addEventListener('scroll', () => {
      clearTimeout(scrollTick);
      scrollTick = setTimeout(adjustIfNeeded, 60);
    });

    nextBtn.addEventListener('click', () => {
      scrollNext(true);
      nextBtn.blur();
      restartAuto();
    });

    prevBtn.addEventListener('click', () => {
      scrollPrev(true);
      prevBtn.blur();
      restartAuto();
    });

    // Autoplay
    let autoId = null;
    const startAuto = () => {
      stopAuto();
      autoId = setInterval(() => scrollNext(true), 3000);
    };
    const stopAuto = () => {
      if (autoId) {
        clearInterval(autoId);
        autoId = null;
      }
    };
    const restartAuto = () => startAuto();

    // Pause on hover/focus
    section.addEventListener('mouseenter', stopAuto);
    section.addEventListener('mouseleave', startAuto);
    section.addEventListener('focusin', stopAuto);
    section.addEventListener('focusout', startAuto);

    // Recompute sizes on resize
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const refreshed = Array.from(list.querySelectorAll('.partners__item'));
        // recompute originalWidth
        originalWidth = 0;
        for (let i = originalCount; i < originalCount * 2; i++) {
          originalWidth += refreshed[i].offsetWidth;
          if (i !== originalCount * 2 - 1) originalWidth += gap;
        }
        // ensure position remains inside middle block
        if (list.scrollLeft < originalWidth || list.scrollLeft > originalWidth * 2) {
          list.scrollLeft = originalWidth;
        }
      }, 150);
    });

    section.dataset.carouselInitialized = 'true';

    startAuto();
  });
}
