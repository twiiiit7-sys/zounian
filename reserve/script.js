const reservationForm = document.getElementById("reservation");
const courses = document.querySelectorAll(".course-card");
const guestCount = document.getElementById("guestCount");
const summaryGuests = document.getElementById("summaryGuests");
const summaryCourse = document.getElementById("summaryCourse");
const summaryPrice = document.getElementById("summaryPrice");
const summaryDateTime = document.getElementById("summaryDateTime");
const plus = document.getElementById("plus");
const minus = document.getElementById("minus");
const statusMessage = document.querySelector(".form-status");
const submitButton = document.querySelector(".submit-button");

let selectedPrice = Number(document.querySelector(".course-card.is-selected")?.dataset.price || 8800);
let selectedCourse = document.querySelector(".course-card.is-selected")?.dataset.course || "";
let guests = Number(guestCount?.textContent || 2);
let selectedDate = "";
let selectedTime = document.querySelector(".time-list .is-selected")?.textContent?.trim() || "";

const weekdayMap = [
  "\u65e5",
  "\u6708",
  "\u706b",
  "\u6c34",
  "\u6728",
  "\u91d1",
  "\u571f"
];

const messages = {
  selectCourseDateTime: "\u30b3\u30fc\u30b9\u30fb\u65e5\u4ed8\u30fb\u6642\u9593\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
  fillRequired: "\u304a\u540d\u524d\u30fb\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u30fb\u96fb\u8a71\u756a\u53f7\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
  invalidEmail: "\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u306e\u5f62\u5f0f\u3092\u3054\u78ba\u8a8d\u304f\u3060\u3055\u3044\u3002",
  missingApi: "API\u8a2d\u5b9a\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002",
  sending: "\u9001\u4fe1\u3057\u3066\u3044\u307e\u3059...",
  success: "\u4e88\u7d04\u5185\u5bb9\u3092\u9001\u4fe1\u3057\u307e\u3057\u305f\u3002\u78ba\u8a8d\u306e\u3054\u9023\u7d61\u3092\u304a\u5f85\u3061\u304f\u3060\u3055\u3044\u3002",
  failed: "\u9001\u4fe1\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\u6642\u9593\u3092\u304a\u3044\u3066\u518d\u5ea6\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002"
};

const setStatus = (message, type = "") => {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.classList.remove("is-success", "is-error");
  if (type) statusMessage.classList.add(type);
};

const buildSelectedDate = () => {
  const calendarTitle = document.querySelector(".calendar__head strong")?.textContent?.trim() || "";
  const selectedDayText = document.querySelector(".calendar__grid button.is-selected")?.textContent?.trim() || "";
  const match = calendarTitle.match(/(\d{4})\u5e74(\d{1,2})\u6708/);
  const day = Number(selectedDayText);

  if (!match || !day) return "";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const date = new Date(year, month - 1, day);
  const weekday = weekdayMap[date.getDay()];
  return `${year}\u5e74${month}\u6708${day}\u65e5\uff08${weekday}\uff09`;
};

const updateSummary = () => {
  selectedDate = buildSelectedDate();
  if (guestCount) guestCount.textContent = String(guests);
  if (summaryGuests) summaryGuests.textContent = String(guests);
  if (summaryCourse) summaryCourse.textContent = selectedCourse;
  if (summaryPrice) summaryPrice.textContent = (selectedPrice * guests).toLocaleString("ja-JP");
  if (summaryDateTime) summaryDateTime.textContent = [selectedDate, selectedTime].filter(Boolean).join(" ");
};

const validateReservation = (payload) => {
  if (!payload.course || !payload.date || !payload.time) {
    return messages.selectCourseDateTime;
  }
  if (!payload.name || !payload.email || !payload.phone) {
    return messages.fillRequired;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return messages.invalidEmail;
  }
  return "";
};

courses.forEach((card) => {
  card.addEventListener("click", () => {
    courses.forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
    selectedPrice = Number(card.dataset.price || 8800);
    selectedCourse = card.dataset.course || "";
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
    updateSummary();
  });
});

document.querySelectorAll(".time-list button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".time-list button").forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
    selectedTime = button.textContent.trim();
    updateSummary();
  });
});

reservationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(reservationForm);
  const payload = {
    course: selectedCourse,
    date: selectedDate,
    time: selectedTime,
    guests,
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    note: String(formData.get("note") || "").trim()
  };

  const errorMessage = validateReservation(payload);
  if (errorMessage) {
    setStatus(errorMessage, "is-error");
    return;
  }

  if (!window.ZounianApi) {
    setStatus(messages.missingApi, "is-error");
    return;
  }

  try {
    setStatus(messages.sending);
    if (submitButton) submitButton.disabled = true;

    await window.ZounianApi.post("/api/reservations", payload);
    setStatus(messages.success, "is-success");
    reservationForm.reset();
    guests = 2;
    selectedCourse = document.querySelector(".course-card.is-selected")?.dataset.course || selectedCourse;
    selectedPrice = Number(document.querySelector(".course-card.is-selected")?.dataset.price || selectedPrice);
    selectedTime = document.querySelector(".time-list .is-selected")?.textContent?.trim() || selectedTime;
    updateSummary();
  } catch (error) {
    setStatus(error.message || messages.failed, "is-error");
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

updateSummary();
