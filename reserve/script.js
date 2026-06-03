const courses = document.querySelectorAll(".course-card");
const guestCount = document.getElementById("guestCount");
const summaryGuests = document.getElementById("summaryGuests");
const summaryCourse = document.getElementById("summaryCourse");
const summaryPrice = document.getElementById("summaryPrice");
const plus = document.getElementById("plus");
const minus = document.getElementById("minus");

let selectedPrice = 8800;
let guests = 2;

const updateSummary = () => {
  if (!guestCount || !summaryGuests || !summaryPrice) return;
  guestCount.textContent = String(guests);
  summaryGuests.textContent = String(guests);
  summaryPrice.textContent = (selectedPrice * guests).toLocaleString("ja-JP");
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

updateSummary();
