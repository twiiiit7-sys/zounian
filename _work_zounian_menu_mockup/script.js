(() => {
  const header = document.querySelector("[data-header], .site-header");
  const hero = document.querySelector(".hero");
  const menuButton = document.querySelector("[data-menu-button], .site-header__menu-button");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    if (!header) return;

    const currentY = window.scrollY;
    const heroLimit = hero ? hero.offsetTop + hero.offsetHeight - 96 : 120;
    const isPastHero = currentY > heroLimit;
    const isScrollingDown = currentY > lastScrollY + 4;
    const isScrollingUp = currentY < lastScrollY - 4;

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
    const isOpen = mobileNav?.classList.toggle("is-open") ?? false;
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav?.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLAnchorElement)) return;
    mobileNav.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });

  updateHeader();
  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", updateHeader);
})();
