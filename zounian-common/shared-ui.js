(() => {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  const menuButton = document.querySelector(".site-header__menu-button, .hamburger");
  const nav = document.querySelector(".site-header__nav, .global-nav");

  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    const currentY = window.scrollY;
    const heroLimit = hero ? hero.offsetTop + hero.offsetHeight - 96 : 160;
    const isPastHero = currentY > heroLimit;
    const isScrollingDown = currentY > lastScrollY + 4;
    const isScrollingUp = currentY < lastScrollY - 4;

    header.classList.toggle("site-header--scrolled", currentY > 24);
    header.classList.toggle("is-scrolled", currentY > 24);

    if (currentY < 24 || (isPastHero && isScrollingUp)) {
      header.classList.remove("site-header--hidden", "is-hidden");
    } else if (isPastHero && isScrollingDown) {
      header.classList.add("site-header--hidden", "is-hidden");
    }

    lastScrollY = currentY;
    ticking = false;
  };

  const requestHeaderUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHeader);
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open") ?? false;
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  updateHeader();
  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", updateHeader);
})();
