const sections = document.querySelectorAll(".hero, .intro, .gallery, .access, .commitment, .page-cta");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  sections.forEach((section) => observer.observe(section));
}
