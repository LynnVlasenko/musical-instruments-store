function init() {
  import("./global.header-burger.js").then((module) => {
    module.initHeaderBurger(); // ←here we launch a burger
  });

  // Remove focus from menu links and social icons after click
  const menuLinks = document.querySelectorAll(".header-nav__menu-link");
  const socialLinks = document.querySelectorAll(".social-links__link");

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      link.blur();
    });
  });

  socialLinks.forEach((link) => {
    link.addEventListener("click", () => {
      link.blur();
    });
  });
}

const totalPartials = document.querySelectorAll(
  '[hx-trigger="load"], [data-hx-trigger="load"]'
).length;
let loadedPartialsCount = 0;

document.body.addEventListener("htmx:afterOnLoad", () => {
  loadedPartialsCount++;
  if (loadedPartialsCount === totalPartials) init();
});
