const form = document.getElementById("listing-form");
const previewContainer = document.getElementById("preview-listings");
const STORAGE_KEY = "campus-exchange-previews";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const loadListings = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

const saveListings = (items) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

const renderPreviews = (items) => {
  previewContainer.innerHTML = "";
  if (!items.length) {
    previewContainer.innerHTML =
      "<p class='text-muted'>Your preview will appear here after you publish an item.</p>";
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "preview-card";
    card.innerHTML = `
      <strong>${item.title}</strong>
      <span class="text-muted">${item.categoryLabel} · ${
      item.conditionLabel
    }</span>
      <span>${formatCurrency(item.price)}</span>
      <p class="text-muted">${item.description}</p>
    `;
    previewContainer.appendChild(card);
  });
};

const listings = loadListings();
renderPreviews(listings);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const entry = {
    title: formData.get("title").trim(),
    price: Number(formData.get("price")),
    category: formData.get("category"),
    categoryLabel: form
      .querySelector(`#category option[value="${formData.get("category")}"]`)
      ?.textContent.trim(),
    condition: formData.get("condition"),
    conditionLabel: form
      .querySelector(
        `#condition option[value="${formData.get("condition")}"]`
      )
      ?.textContent.trim(),
    description: formData.get("description").trim(),
    timestamp: Date.now(),
  };

  listings.unshift(entry);
  listings.length = Math.min(listings.length, 5);

  saveListings(listings);
  renderPreviews(listings);
  form.reset();

  const toast = document.createElement("div");
  toast.className = "badge";
  toast.textContent = "Listing saved to preview";
  document.body.appendChild(toast);
  toast.style.position = "fixed";
  toast.style.bottom = "32px";
  toast.style.right = "32px";
  toast.style.boxShadow = "var(--shadow-soft)";
  setTimeout(() => toast.remove(), 2500);
});
