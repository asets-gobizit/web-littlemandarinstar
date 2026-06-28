const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const siteHeader = document.querySelector(".site-header");
const languageSwitcher = document.querySelector("[data-language-switcher]");
const languageToggle = languageSwitcher?.querySelector(".language-toggle");
const assetBase = (document.documentElement.dataset.assetBase || "").replace(/\/$/, "");
const pageLang = document.documentElement.lang || "en";
const uiText = {
  en: {
    newsletterStatus: "Local preview only. Connect newsletter service before publishing.",
    contactPopupTitle: "Your message is ready",
    contactPopupBody: "Your email app opened with the message addressed to ruby@littlemandarinstar.com. Please press Send there to complete it.",
    contactPopupButton: "OK",
    contactSubject: "New message from Little Star Mandarin School website",
    studentAlts: [
      "Student holding Chinese artwork",
      "Student holding Chinese New Year decoration",
      "Student presenting Chinese cultural craft",
      "Chinese calligraphy worksheet",
      "Student Chinese activity photo",
    ],
  },
  es: {
    newsletterStatus: "Vista previa local. Conecta el servicio de newsletter antes de publicar.",
    contactPopupTitle: "Tu mensaje esta listo",
    contactPopupBody: "Tu aplicacion de correo se abrio con el mensaje dirigido a ruby@littlemandarinstar.com. Pulsa Enviar alli para completarlo.",
    contactPopupButton: "OK",
    contactSubject: "Nuevo mensaje desde la web de Little Star Mandarin School",
    studentAlts: [
      "Estudiante sosteniendo una obra de arte china",
      "Estudiante sosteniendo una decoracion del Ano Nuevo chino",
      "Estudiante presentando una manualidad cultural china",
      "Hoja de practica de caligrafia china",
      "Foto de una actividad de chino para estudiantes",
    ],
  },
  fr: {
    newsletterStatus: "Apercu local uniquement. Connectez le service de newsletter avant publication.",
    contactPopupTitle: "Votre message est pret",
    contactPopupBody: "Votre application email s'est ouverte avec le message adresse a ruby@littlemandarinstar.com. Cliquez sur Envoyer pour terminer.",
    contactPopupButton: "OK",
    contactSubject: "Nouveau message depuis le site Little Star Mandarin School",
    studentAlts: [
      "Eleve tenant une creation artistique chinoise",
      "Eleve tenant une decoration du Nouvel An chinois",
      "Eleve presentant une activite culturelle chinoise",
      "Feuille d'exercice de calligraphie chinoise",
      "Photo d'une activite de chinois pour eleves",
    ],
  },
};
const currentText = uiText[pageLang] || uiText.en;

function updateHeaderState() {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 60);
}

function setActiveNavLink(activeLink) {
  navLinks.forEach((navLink) => navLink.classList.toggle("is-active", navLink === activeLink));
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation menu");
    setActiveNavLink(link);
  });
});

window.addEventListener("hashchange", () => {
  const activeLink = navLinks.find((link) => link.hash === window.location.hash);
  if (activeLink) setActiveNavLink(activeLink);
});

function closeLanguageMenu() {
  languageSwitcher?.classList.remove("is-open");
  languageToggle?.setAttribute("aria-expanded", "false");
}

languageToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  const isOpen = languageSwitcher?.classList.toggle("is-open") ?? false;
  languageToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (!languageSwitcher?.contains(event.target)) closeLanguageMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLanguageMenu();
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    const isNewsletter = form.closest(".newsletter");
    if (isNewsletter) {
      if (status) status.textContent = currentText.newsletterStatus;
      return;
    }
    sendContactMessage(form);
  });
});

function showSubmissionPopup() {
  const existingPopup = document.querySelector(".submission-popup");
  existingPopup?.remove();

  const popup = document.createElement("div");
  popup.className = "submission-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");
  popup.setAttribute("aria-label", currentText.contactPopupTitle);
  popup.innerHTML = `
    <div class="submission-popup-panel">
      <h2>${currentText.contactPopupTitle}</h2>
      <p>${currentText.contactPopupBody}</p>
      <button type="button">${currentText.contactPopupButton}</button>
    </div>
  `;
  document.body.appendChild(popup);

  const closeButton = popup.querySelector("button");
  closeButton?.focus();
  closeButton?.addEventListener("click", () => popup.remove());
  popup.addEventListener("click", (event) => {
    if (event.target === popup) popup.remove();
  });
}

function sendContactMessage(form) {
  const formData = new FormData(form);
  const firstName = String(formData.get("first-name") || "").trim();
  const lastName = String(formData.get("last-name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const body = [
    `Name: ${[firstName, lastName].filter(Boolean).join(" ")}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const mailto = `mailto:ruby@littlemandarinstar.com?subject=${encodeURIComponent(currentText.contactSubject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  showSubmissionPopup();
  form.reset();
}

const galleryLinks = [...document.querySelectorAll("[data-lightbox='gallery']")];
const lightbox = document.querySelector("#gallery-lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCount = lightbox?.querySelector(".lightbox-count");
const lightboxDownload = lightbox?.querySelector(".lightbox-download");
const fullscreenLightbox = lightbox?.querySelector(".lightbox-fullscreen");
const lightboxThumbs = lightbox?.querySelector(".lightbox-thumbs");
const closeLightbox = lightbox?.querySelector(".lightbox-close");
const prevLightbox = lightbox?.querySelector(".lightbox-prev");
const nextLightbox = lightbox?.querySelector(".lightbox-next");
let activeGalleryIndex = 0;

function showGalleryImage(index) {
  if (!lightbox || !lightboxImage || !galleryLinks.length) return;
  lightbox.classList.remove("is-single");
  activeGalleryIndex = (index + galleryLinks.length) % galleryLinks.length;
  const link = galleryLinks[activeGalleryIndex];
  const image = link.querySelector("img");
  lightboxImage.src = link.href;
  lightboxImage.alt = image?.alt || "Gallery image";
  if (lightboxCount) lightboxCount.textContent = `${activeGalleryIndex + 1}/${galleryLinks.length}`;
  if (lightboxDownload) lightboxDownload.href = link.href;
  lightboxThumbs?.querySelectorAll(".lightbox-thumb").forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("is-active", thumbIndex === activeGalleryIndex);
    thumb.setAttribute("aria-current", thumbIndex === activeGalleryIndex ? "true" : "false");
  });
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  closeLightbox?.focus();
}

function hideGalleryImage() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("is-open");
  lightbox.classList.remove("is-single");
  lightbox.setAttribute("aria-hidden", "true");
}

function showSingleImage(src, alt) {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.add("is-single");
  lightboxImage.src = src;
  lightboxImage.alt = alt || "Preview image";
  if (lightboxCount) lightboxCount.textContent = "1/1";
  if (lightboxDownload) lightboxDownload.href = src;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  closeLightbox?.focus();
}

galleryLinks.forEach((link, index) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showGalleryImage(index);
  });

  link.addEventListener("dblclick", (event) => {
    event.preventDefault();
    showGalleryImage(index);
  });
});

closeLightbox?.addEventListener("click", hideGalleryImage);
prevLightbox?.addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
nextLightbox?.addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));
fullscreenLightbox?.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    lightbox?.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
});

galleryLinks.forEach((link, index) => {
  const image = link.querySelector("img");
  const thumb = document.createElement("button");
  thumb.className = "lightbox-thumb";
  thumb.type = "button";
  thumb.setAttribute("aria-label", `Open gallery image ${index + 1}`);
  thumb.innerHTML = `<img src="${image?.getAttribute("src") || link.href}" alt="">`;
  thumb.addEventListener("click", () => showGalleryImage(index));
  lightboxThumbs?.appendChild(thumb);
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) hideGalleryImage();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) return;
  if (event.key === "Escape") hideGalleryImage();
  if (lightbox.classList.contains("is-single")) return;
  if (event.key === "ArrowLeft") showGalleryImage(activeGalleryIndex - 1);
  if (event.key === "ArrowRight") showGalleryImage(activeGalleryIndex + 1);
});

const contactPanda = document.querySelector(".contact-panda");
contactPanda?.addEventListener("click", () => {
  showSingleImage(`${assetBase}/assets/china/iStock-1190024309.jpg`, contactPanda.alt);
});

const studentGallery = document.querySelector("[data-student-gallery]");
const studentStageImage = studentGallery?.querySelector(".student-gallery-stage img");
const studentThumbs = studentGallery?.querySelector(".student-gallery-thumbs");
const studentPrev = studentGallery?.querySelector(".student-gallery-prev");
const studentNext = studentGallery?.querySelector(".student-gallery-next");
const studentImages = [
  {
    src: `${assetBase}/assets/gallery/IMG_20230826_152440.jpg`,
    alt: currentText.studentAlts[0],
  },
  {
    src: `${assetBase}/assets/gallery/IMG_20230826_152725_1.jpg`,
    alt: currentText.studentAlts[1],
  },
  {
    src: `${assetBase}/assets/gallery/IMG_20230826_152814.jpg`,
    alt: currentText.studentAlts[2],
  },
  {
    src: `${assetBase}/assets/gallery/IMG_20230826_153436.jpg`,
    alt: currentText.studentAlts[3],
  },
  {
    src: `${assetBase}/assets/gallery/IMG_20230826_154430.jpg`,
    alt: currentText.studentAlts[4],
  },
];
let activeStudentIndex = 0;

function showStudentImage(index) {
  if (!studentStageImage || !studentImages.length) return;
  activeStudentIndex = (index + studentImages.length) % studentImages.length;
  const image = studentImages[activeStudentIndex];
  studentStageImage.src = image.src;
  studentStageImage.alt = image.alt;
  studentThumbs?.querySelectorAll(".student-gallery-thumb").forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("is-active", thumbIndex === activeStudentIndex);
    thumb.setAttribute("aria-current", thumbIndex === activeStudentIndex ? "true" : "false");
  });
}

studentImages.forEach((image, index) => {
  const thumb = document.createElement("button");
  thumb.className = "student-gallery-thumb";
  thumb.type = "button";
  thumb.setAttribute("aria-label", `Show student gallery image ${index + 1}`);
  thumb.innerHTML = `<img src="${image.src}" alt="">`;
  thumb.addEventListener("click", () => showStudentImage(index));
  studentThumbs?.appendChild(thumb);
});

studentPrev?.addEventListener("click", () => showStudentImage(activeStudentIndex - 1));
studentNext?.addEventListener("click", () => showStudentImage(activeStudentIndex + 1));
showStudentImage(0);
