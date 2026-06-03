(() => {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    if (!header) return;

    const currentY = window.scrollY;
    const heroLimit = hero ? hero.offsetTop + hero.offsetHeight - 96 : 120;
    const isPastHero = currentY > heroLimit;
    const isScrollingDown = currentY > lastScrollY + 4;
    const isScrollingUp = currentY < lastScrollY - 4;

    header.classList.toggle("site-header--scrolled", currentY > 24);

    if (currentY < 24 || (isPastHero && isScrollingUp)) {
      header.classList.remove("site-header--hidden");
    } else if (isPastHero && isScrollingDown) {
      header.classList.add("site-header--hidden");
    }

    lastScrollY = currentY;
    ticking = false;
  };

  const requestHeaderUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", updateHeader);
})();
