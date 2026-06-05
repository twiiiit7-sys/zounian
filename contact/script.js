const contactForm = document.querySelector(".contact-form");
const contactMessage = document.querySelector(".contact-form__message");

const messages = {
  fillRequired: "\u5fc5\u9808\u9805\u76ee\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
  invalidEmail: "\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u306e\u5f62\u5f0f\u3092\u3054\u78ba\u8a8d\u304f\u3060\u3055\u3044\u3002",
  missingApi: "API\u8a2d\u5b9a\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002",
  sending: "\u9001\u4fe1\u3057\u3066\u3044\u307e\u3059...",
  success: "\u304a\u554f\u3044\u5408\u308f\u305b\u3092\u9001\u4fe1\u3057\u307e\u3057\u305f\u30022\u301c3\u55b6\u696d\u65e5\u4ee5\u5185\u306b\u3054\u8fd4\u4fe1\u3044\u305f\u3057\u307e\u3059\u3002",
  failed: "\u9001\u4fe1\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\u6642\u9593\u3092\u304a\u3044\u3066\u518d\u5ea6\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002"
};

const setMessage = (message, type = "") => {
  if (!contactMessage) return;
  contactMessage.textContent = message;
  contactMessage.classList.remove("is-success", "is-error");
  if (type) contactMessage.classList.add(type);
};

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const payload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    subject: String(formData.get("subject") || "").trim(),
    message: String(formData.get("message") || "").trim()
  };

  if (!payload.name || !payload.email || !payload.subject || !payload.message) {
    setMessage(messages.fillRequired, "is-error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    setMessage(messages.invalidEmail, "is-error");
    return;
  }

  if (!window.ZounianApi) {
    setMessage(messages.missingApi, "is-error");
    return;
  }

  const submitButton = contactForm.querySelector(".contact-form__submit");

  try {
    setMessage(messages.sending);
    if (submitButton) submitButton.disabled = true;
    await window.ZounianApi.post("/api/contact", payload);
    setMessage(messages.success, "is-success");
    contactForm.reset();
  } catch (error) {
    setMessage(error.message || messages.failed, "is-error");
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});
