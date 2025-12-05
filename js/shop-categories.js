export function initShopCategories() {
  const categoryItems = document.querySelectorAll(".shop__categories-item");
  const shopGrid = document.querySelector(".shop__grid");

  if (!categoryItems.length || !shopGrid) return;

  // Обробник для переключення активного класу у меню
  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Видаляємо активний клас зі всіх пунктів
      categoryItems.forEach((el) => {
        el.classList.remove("shop__categories-item--active");
      });

      // Додаємо активний клас до натисненого пункту
      item.classList.add("shop__categories-item--active");
    });
  });

  // HTMX подія для плавної анімації при завантаженні нових карток
  document.body.addEventListener("htmx:beforeSwap", (evt) => {
    if (evt.detail.target === shopGrid) {
      // Перед заміною контенту додаємо анімацію зникнення
      shopGrid.style.opacity = "0";
      shopGrid.style.transition = "opacity 0.3s ease-in-out";
    }
  });

  document.body.addEventListener("htmx:afterSettle", (evt) => {
    if (evt.detail.target === shopGrid) {
      // Після завантаження нового контенту показуємо картки з анімацією
      setTimeout(() => {
        shopGrid.style.opacity = "1";
      }, 0);
    }
  });
}
