const listingGrid = document.getElementById("listing-results");
const emptyState = document.getElementById("empty-state");
const searchInput = document.querySelector('[data-filter="search"]');
const categoryChips = document.querySelectorAll('[data-filter="category"]');
const conditionChips = document.querySelectorAll('[data-filter="condition"]');
const statActive = document.getElementById("stat-active");
const statNew = document.getElementById("stat-new");
const statSaved = document.getElementById("stat-saved");

const filters = {
  search: "",
  category: "all",
  condition: "any",
};

let listings = [];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const createCard = (item) => {
  const card = document.createElement("article");
  card.className = "card listing-card";
  card.innerHTML = `
    <img src="/${item.image}" alt="${item.title}" />
    <h3>${item.title}</h3>
    <p class="text-muted">${item.description}</p>
    <div class="listing-card__meta">
      <span class="listing-card__price">${formatCurrency(item.price)}</span>
      <span class="badge">${item.conditionLabel}</span>
    </div>
    <a class="btn btn--ghost" href="${item.link}">${item.cta}</a>
  `;
  return card;
};

const renderListings = (items) => {
  listingGrid.innerHTML = "";
  if (!items.length) {
    emptyState.hidden = false;
    listingGrid.setAttribute("aria-busy", "false");
    return;
  }
  emptyState.hidden = true;
  items.forEach((item) => listingGrid.appendChild(createCard(item)));
  listingGrid.setAttribute("aria-busy", "false");
};

const applyFilters = () => {
  const query = filters.search.toLowerCase();
  const filtered = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    const matchesCategory =
      filters.category === "all" || item.category === filters.category;
    const matchesCondition =
      filters.condition === "any" || item.condition === filters.condition;
    return matchesSearch && matchesCategory && matchesCondition;
  });
  renderListings(filtered);
};

const bindChipGroup = (chipNodeList, key) => {
  chipNodeList.forEach((chip) => {
    chip.addEventListener("click", () => {
      chipNodeList.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      filters[key] = chip.value;
      applyFilters();
    });
  });
};

const init = async () => {
  try {
    const response = await fetch("/api/listings");
    listings = await response.json();
    if (statActive) {
      statActive.textContent = listings.length;
      statNew.textContent = listings.filter((item) => item.isNew).length;
    }
    applyFilters();
  } catch (error) {
    listingGrid.innerHTML =
      "<div class='empty-state'><p>Couldn't load listings. Please refresh.</p></div>";
    console.error("Failed to load listings", error);
  }
};

searchInput.addEventListener("input", (event) => {
  filters.search = event.target.value;
  applyFilters();
});

bindChipGroup(categoryChips, "category");
bindChipGroup(conditionChips, "condition");

init();
