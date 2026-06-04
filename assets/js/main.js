(() => {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  const menuButton = document.querySelector(".site-header__menu-button, .hamburger");
  const nav = document.querySelector(".site-header__nav, .global-nav");
  const closeMenu = () => {
    nav?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

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
    const answer = card.querySelector("p");
    const icon = card.querySelector("span");
    if (!answer) return;
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-expanded", "false");
    answer.style.maxHeight = "0";
    answer.style.overflow = "hidden";
    answer.style.transition = "max-height .25s ease";

    const toggle = () => {
      const isOpen = card.classList.toggle("is-open");
      card.setAttribute("aria-expanded", String(isOpen));
      answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : "0";
      if (icon) icon.textContent = isOpen ? "|" : "{";
    };

    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle();
    });
  });
})();

(() => {
  const courses = document.querySelectorAll(".course-card");
  const guestCount = document.getElementById("guestCount");
  const summaryGuests = document.getElementById("summaryGuests");
  const summaryCourse = document.getElementById("summaryCourse");
  const summaryPrice = document.getElementById("summaryPrice");
  const plus = document.getElementById("plus");
  const minus = document.getElementById("minus");
  let selectedPrice = Number(document.querySelector(".course-card.is-selected")?.dataset.price || 8800);
  let guests = Number(guestCount?.textContent || 2);

  const updateSummary = () => {
    if (guestCount) guestCount.textContent = String(guests);
    if (summaryGuests) summaryGuests.textContent = String(guests);
    if (summaryPrice) summaryPrice.textContent = (selectedPrice * guests).toLocaleString("ja-JP");
  };

  courses.forEach((card) => {
    card.addEventListener("click", () => {
      courses.forEach((item) => item.classList.remove("is-selected"));
      card.classList.add("is-selected");
      selectedPrice = Number(card.dataset.price || 8800);
      if (summaryCourse) summaryCourse.textContent = card.dataset.course || "";
      updateSummary();
    });
  });

  plus?.addEventListener("click", () => {
    guests = Math.min(8, guests + 1);
    updateSummary();
  });

  minus?.addEventListener("click", () => {
    guests = Math.max(1, guests - 1);
    updateSummary();
  });

  document.querySelectorAll(".calendar__grid button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-muted")) return;
      document.querySelectorAll(".calendar__grid button").forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
    });
  });

  document.querySelectorAll(".time-list button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".time-list button").forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
    });
  });

  updateSummary();
})();

