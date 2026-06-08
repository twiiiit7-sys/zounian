(() => {
  const carousel = document.querySelector("[data-menu-carousel]");

  if (!carousel) {
    return;
  }

  const viewport = carousel.querySelector("[data-menu-viewport]");
  const track = carousel.querySelector("[data-menu-track]");
  const prevButton = carousel.querySelector("[data-menu-prev]");
  const nextButton = carousel.querySelector("[data-menu-next]");
  const dotsContainer = document.querySelector("[data-menu-dots]");

  if (!viewport || !track || !dotsContainer) {
    return;
  }

  const originals = Array.from(track.children);
  let segmentStart = 0;
  let segmentWidth = 0;
  let stepWidth = 0;
  let scrollPosition = 0;
  let activeIndex = 0;
  let initialized = false;
  let autoTimer = null;
  let settleTimer = null;
  let isInteractionPaused = false;
  const autoDelay = 4200;

  const beforeItems = document.createDocumentFragment();
  const afterItems = document.createDocumentFragment();

  originals.forEach((item) => {
    const beforeClone = item.cloneNode(true);
    const afterClone = item.cloneNode(true);
    beforeClone.setAttribute("aria-hidden", "true");
    afterClone.setAttribute("aria-hidden", "true");
    beforeItems.appendChild(beforeClone);
    afterItems.appendChild(afterClone);
  });

  track.prepend(beforeItems);
  track.appendChild(afterItems);

  const toDotIndex = (index) => (originals.length - index) % originals.length;

  const dots = originals.map((_, index) => {
    const existing = dotsContainer.children[index];
    const dot = existing || document.createElement("button");
    dot.type = "button";
    dot.className = "menu__dot";
    dot.setAttribute("aria-label", `${index + 1}ページ目`);
    dot.addEventListener("click", () => {
      goTo(toDotIndex(index));
      restartAuto();
    });

    if (!existing) {
      dotsContainer.appendChild(dot);
    }

    return dot;
  });

  Array.from(dotsContainer.children).forEach((dot, index) => {
    if (index >= originals.length) {
      dot.remove();
    }
  });

  const measure = () => {
    const firstItem = track.children[0];
    const firstOriginal = originals[0];
    const firstAfterClone = track.children[originals.length * 2];

    if (!firstItem || !firstOriginal || !firstAfterClone) {
      return;
    }

    segmentStart = firstOriginal.offsetLeft - firstItem.offsetLeft;
    segmentWidth = firstAfterClone.offsetLeft - firstOriginal.offsetLeft;
    stepWidth = segmentWidth / originals.length;
  };

  const getNormalized = () => ((scrollPosition - segmentStart) % segmentWidth + segmentWidth) % segmentWidth;

  const getCurrentIndex = () => {
    if (!stepWidth) {
      return 0;
    }

    return Math.round(getNormalized() / stepWidth) % originals.length;
  };

  const normalizeToCenter = () => {
    if (!segmentWidth) {
      return;
    }

    scrollPosition = segmentStart + getNormalized();
    viewport.scrollLeft = scrollPosition;
    updateDots();
  };

  const initializePosition = () => {
    measure();

    if (!segmentWidth) {
      return;
    }

    scrollPosition = segmentStart + activeIndex * stepWidth;
    viewport.scrollLeft = scrollPosition;
    initialized = true;
    updateDots();
  };

  const updateDots = () => {
    if (!stepWidth) {
      return;
    }

    const normalized = getNormalized();
    const nextIndex = Math.round(normalized / stepWidth) % originals.length;

    if (nextIndex !== activeIndex) {
      activeIndex = nextIndex;
    }

    const dotIndex = toDotIndex(activeIndex);
    dots.forEach((dot, index) => {
      const active = index === dotIndex;
      dot.classList.toggle("menu__dot--active", active);
      dot.toggleAttribute("aria-current", active);
    });
  };

  const goTo = (index, direction = 0) => {
    if (!stepWidth || !segmentWidth) {
      return;
    }

    const normalized = getNormalized();
    const current = getCurrentIndex();
    let base = scrollPosition - normalized;

    if (direction < 0 && index > current) {
      base -= segmentWidth;
    } else if (direction > 0 && index < current) {
      base += segmentWidth;
    }

    scrollPosition = base + index * stepWidth;
    viewport.scrollTo({
      left: scrollPosition,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
    clearTimeout(settleTimer);
    settleTimer = setTimeout(normalizeToCenter, 720);
  };

  const scheduleAuto = () => {
    clearTimeout(autoTimer);

    if (isInteractionPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    autoTimer = setTimeout(() => {
      moveBy(-1, false);
      scheduleAuto();
    }, autoDelay);
  };

  const restartAuto = () => {
    scheduleAuto();
  };

  const moveBy = (direction, shouldRestartAuto = true) => {
    if (!stepWidth || !segmentWidth) {
      return;
    }

    const current = getCurrentIndex();
    goTo((current + direction + originals.length) % originals.length, direction);

    if (shouldRestartAuto) {
      restartAuto();
    }
  };

  prevButton?.addEventListener("click", () => moveBy(1));
  nextButton?.addEventListener("click", () => moveBy(-1));
  viewport.addEventListener("mouseenter", () => {
    isInteractionPaused = true;
    clearTimeout(autoTimer);
  });
  viewport.addEventListener("mouseleave", () => {
    isInteractionPaused = false;
    scheduleAuto();
  });
  viewport.addEventListener("focusin", () => {
    isInteractionPaused = true;
    clearTimeout(autoTimer);
  });
  viewport.addEventListener("focusout", () => {
    isInteractionPaused = false;
    scheduleAuto();
  });
  viewport.addEventListener("scroll", () => {
    scrollPosition = viewport.scrollLeft;
    updateDots();
  }, { passive: true });
  window.addEventListener("resize", () => {
    initializePosition();
    scheduleAuto();
  });
  window.addEventListener("load", () => {
    initializePosition();
    scheduleAuto();
  });

  initializePosition();
  scheduleAuto();
})();
