const contactForm = document.querySelector(".contact-form");
const contactMessage = document.querySelector(".contact-form__message");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const requiredFields = contactForm.querySelectorAll("[required]");
  const hasEmptyField = Array.from(requiredFields).some((field) => !field.value.trim());

  if (hasEmptyField) {
    if (contactMessage) contactMessage.textContent = "必須項目をご入力ください。";
    return;
  }

  if (contactMessage) contactMessage.textContent = "お問い合わせ内容を確認しました。送信処理はデモです。";
});
