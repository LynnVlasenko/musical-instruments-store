// New Arrivals carousel: infinite loop with button controls (no autoplay)
export function initNewArrivalsCarousel() {
  const sections = document.querySelectorAll('.new-arrivals');
  if (!sections.length) return;

  sections.forEach((section) => {
    // avoid double-initialization
    if (section.dataset.carouselInitialized === 'true') return;

    const track = section.querySelector('.new-arrivals__track');
    const nextBtn = section.querySelector('.carousel-arrow--next');
    const prevBtn = section.querySelector('.carousel-arrow--prev');
    if (!track || !nextBtn || !prevBtn) return;

    const originalItems = Array.from(track.children).map((n) => n.cloneNode(true));
    if (!originalItems.length) return;

    const cs = getComputedStyle(track);
    const gap = cs.gap ? parseFloat(cs.gap) : 0;

    // Clone items: 3x copies (before, original, after) for seamless infinite loop
    const clonedBefore = originalItems.map((n) => n.cloneNode(true));
    const clonedAfter = originalItems.map((n) => n.cloneNode(true));

    // Append clones WITHOUT clearing: insert before and append after
    clonedBefore.reverse().forEach((item) => {
      track.insertBefore(item, track.firstChild);
    });
    clonedAfter.forEach((item) => {
      track.appendChild(item);
    });

    const allItems = Array.from(track.querySelectorAll('.new-arrivals__item'));
    const itemCount = originalItems.length;

    // Calculate width of one item block (all original items + gaps)
    let blockWidth = 0;
    for (let i = itemCount; i < itemCount * 2; i++) {
      blockWidth += allItems[i].offsetWidth;
      if (i !== itemCount * 2 - 1) blockWidth += gap;
    }

    // Start at the beginning of the original block WITHOUT visual jump
    requestAnimationFrame(() => {
      track.scrollLeft = blockWidth;
    });

    const getItemWidth = () => {
      return allItems[itemCount] ? allItems[itemCount].offsetWidth + gap : 0;
    };

    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;

      // If scrolled past the last original block, jump to first
      if (track.scrollLeft >= blockWidth * 2 - 10) {
        isScrolling = true;
        track.scrollLeft = blockWidth;
        isScrolling = false;
      }
      // If scrolled before the first original block, jump to last
      else if (track.scrollLeft <= 10) {
        isScrolling = true;
        track.scrollLeft = blockWidth;
        isScrolling = false;
      }
    };

    track.addEventListener('scroll', handleScroll, { passive: true });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({
        left: getItemWidth(),
        behavior: 'smooth',
      });
      nextBtn.blur();
    });

    prevBtn.addEventListener('click', () => {
      track.scrollBy({
        left: -getItemWidth(),
        behavior: 'smooth',
      });
      prevBtn.blur();
    });

    // Handle resize
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Recompute block width
        blockWidth = 0;
        const refreshed = Array.from(track.querySelectorAll('.new-arrivals__item'));
        for (let i = itemCount; i < itemCount * 2; i++) {
          blockWidth += refreshed[i].offsetWidth;
          if (i !== itemCount * 2 - 1) blockWidth += gap;
        }
        // Ensure we're in the original block range
        if (track.scrollLeft < 10 || track.scrollLeft > blockWidth * 2 - 10) {
          track.scrollLeft = blockWidth;
        }
      }, 150);
    });

    section.dataset.carouselInitialized = 'true';
  });
}
