(() => {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  const menuButton = document.querySelector(".site-header__menu-button, .hamburger");
  const nav = document.querySelector(".site-header__nav, .global-nav");
  const closeMenu = () => {
    nav?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  if (menuButton && nav && !nav.id) {
    nav.id = "site-header-menu";
  }

  if (menuButton && nav) {
    menuButton.setAttribute("aria-controls", nav.id);
  }

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

  menuButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = nav?.classList.toggle("is-open") ?? false;
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!nav?.classList.contains("is-open")) return;
    if (header.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeMenu();
  });

  updateHeader();
  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", updateHeader);
})();

(() => {
  document.querySelectorAll('a[href^="#"], a[href*="/#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", url.hash);
    });
  });
})();

(() => {
  document.querySelectorAll(".faq-card").forEach((card) => {
    const trigger = card.querySelector(".faq-card__button");
    const answer = card.querySelector(".faq-card__answer");
    if (!trigger || !answer) return;
    const answerInner = answer.querySelector("p");
    answer.style.overflow = "hidden";
    answer.style.maxHeight = "0";
    answer.style.transition = "max-height .25s ease";
    answer.hidden = true;

    const toggle = () => {
      const isOpen = card.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      answer.hidden = false;
      const expandedHeight = answer.scrollHeight;
      answer.style.maxHeight = isOpen ? `${expandedHeight}px` : "0";
      if (!isOpen) {
        window.setTimeout(() => {
          if (!card.classList.contains("is-open")) answer.hidden = true;
        }, 250);
      } else if (answerInner) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    };

    trigger.addEventListener("click", toggle);
  });
})();


