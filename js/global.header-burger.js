export function initHeaderBurger() {
  const header = document.querySelector(".header-nav");
  const burger = document.querySelector(".header-nav__burger");

  if (!header || !burger) return;

  burger.addEventListener("click", () => {
    const isOpen = header.classList.toggle("header-nav--open");
    burger.setAttribute("aria-expanded", isOpen);
  });

  // Close overlay and perform smooth scroll when a menu link is clicked
  const menuLinks = document.querySelectorAll('.header-nav__menu-link');
  if (menuLinks.length) {
    menuLinks.forEach((link) => {
      link.addEventListener('click', (ev) => {
        const href = link.getAttribute('href');

        // Add brief pressed visual state so user sees feedback
        link.classList.add('header-nav__menu-link--pressed');

        // short delay to show pressed state
        const PRESSED_DELAY = 160; // ms

        if (href && href.startsWith('#')) {
          ev.preventDefault();

          setTimeout(() => {
            // Close menu
            header.classList.remove('header-nav--open');
            burger.setAttribute('aria-expanded', 'false');

            // scroll to target after a tiny delay to allow close animation to start
            setTimeout(() => {
              const targetId = href.slice(1);
              const targetEl = document.getElementById(targetId);
              if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                window.location.hash = href;
              }
            }, 180);

            // remove pressed class (cleanup)
            link.classList.remove('header-nav__menu-link--pressed');
          }, PRESSED_DELAY);
        } else {
          // Non-anchor links: show pressed state then close
          setTimeout(() => {
            header.classList.remove('header-nav--open');
            burger.setAttribute('aria-expanded', 'false');
            link.classList.remove('header-nav__menu-link--pressed');
          }, PRESSED_DELAY);
        }
      });
    });
  }
}
