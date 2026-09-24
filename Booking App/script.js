const properties = [
  {
    id: 1,
    name: "The Cove Villa",
    city: "Bali, Indonesia",
    type: "Private Villa",
    rating: 4.9,
    price: 240,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Azure Horizon",
    city: "Santorini, Greece",
    type: "Ocean View",
    rating: 4.8,
    price: 310,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Sora Residence",
    city: "Kyoto, Japan",
    type: "Deluxe Suite",
    rating: 4.9,
    price: 280,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "Noir Skyline",
    city: "Dubai, UAE",
    type: "Penthouse",
    rating: 5.0,
    price: 420,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    name: "Maison Étoile",
    city: "Paris, France",
    type: "Deluxe Suite",
    rating: 4.7,
    price: 260,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    name: "Seabreeze Retreat",
    city: "Bali, Indonesia",
    type: "Beachfront",
    rating: 4.8,
    price: 330,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  },
];

const defaultProperty = properties[0];
let activeProperty = defaultProperty;

const propertyGrid = document.getElementById("propertyGrid");
const destinationSelect = document.getElementById("destinationSelect");
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");
const guestSelect = document.getElementById("guestSelect");
const roomSelect = document.getElementById("roomSelect");
const bookingForm = document.getElementById("bookingForm");

const summaryStay = document.getElementById("summaryStay");
const summaryDates = document.getElementById("summaryDates");
const summaryGuests = document.getElementById("summaryGuests");
const summaryPrice = document.getElementById("summaryPrice");
const selectedApartmentName = document.getElementById("selectedApartmentName");
const selectedApartmentMeta = document.getElementById("selectedApartmentMeta");

function getDefaultDate(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split("T")[0];
}

function calculateNights(checkInDate, checkOutDate) {
  if (!checkInDate || !checkOutDate) return 3;
  const inDate = new Date(checkInDate);
  const outDate = new Date(checkOutDate);
  const difference = outDate - inDate;
  const nights = Math.ceil(difference / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 3;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function syncDestinationSelection() {
  const cityHint = activeProperty.city.split(",")[0].trim();
  const matchedOption = Array.from(destinationSelect.options).find((option) =>
    option.text.toLowerCase().includes(cityHint.toLowerCase())
  );

  if (matchedOption) {
    destinationSelect.value = matchedOption.value;
  }
}

function updateSelectedApartmentDisplay() {
  selectedApartmentName.textContent = activeProperty.name;
  selectedApartmentMeta.textContent = `${activeProperty.city} • ${activeProperty.type}`;
}

function renderProperties() {
  propertyGrid.innerHTML = properties
    .map(
      (property) => `
        <article class="property-card ${property.id === activeProperty.id ? "active" : ""}" data-id="${property.id}">
          <div class="property-image" style="background-image: linear-gradient(rgba(7, 17, 31, 0.18), rgba(7, 17, 31, 0.18)), url('${property.image}');">
            <span class="image-badge"><i class="fa-solid fa-star"></i> ${property.rating}</span>
          </div>
          <div class="property-content">
            <div class="property-tag-row">
              <span class="property-tag">${property.type}</span>
              <span class="property-rating"><i class="fa-solid fa-star"></i> ${property.rating}</span>
            </div>
            <h3>${property.name}</h3>
            <div class="property-location"><i class="fa-solid fa-location-dot"></i> ${property.city}</div>
            <div class="property-footer">
              <div class="price-wrap">
                <strong>${formatCurrency(property.price)}</strong>
                <span>/ night</span>
              </div>
              <button class="property-button" type="button">Select</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  const cards = document.querySelectorAll(".property-card");
  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) {
        return;
      }

      const selectedId = Number(card.dataset.id);
      const selectedProperty = properties.find((property) => property.id === selectedId);
      if (selectedProperty) {
        activeProperty = selectedProperty;
        summaryStay.textContent = selectedProperty.name;
        renderProperties();
        updateSummary();
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    const button = card.querySelector(".property-button");
    button?.addEventListener("click", () => {
      const selectedId = Number(card.dataset.id);
      const selectedProperty = properties.find((property) => property.id === selectedId);
      if (selectedProperty) {
        activeProperty = selectedProperty;
        summaryStay.textContent = selectedProperty.name;
        renderProperties();
        updateSummary();
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function updateSummary() {
  const nights = calculateNights(checkIn.value, checkOut.value);
  const guestCount = guestSelect.value;
  const roomValue = roomSelect.value;
  const roomFactor = roomValue === "Penthouse" ? 1.35 : roomValue === "Private Villa" ? 1.2 : roomValue === "Ocean View" ? 1.1 : 1;
  const nightlyRate = activeProperty.price * roomFactor;
  const total = nightlyRate * nights;

  summaryStay.textContent = activeProperty.name;
  summaryDates.textContent = `${nights} night${nights > 1 ? "s" : ""}`;
  summaryGuests.textContent = `${guestCount} Guests · ${roomValue}`;
  summaryPrice.textContent = formatCurrency(total);
  updateSelectedApartmentDisplay();
  syncDestinationSelection();
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const inDate = new Date(checkIn.value);
  const outDate = new Date(checkOut.value);

  if (!checkIn.value || !checkOut.value || outDate <= inDate) {
    alert("Please select a valid check-in and check-out date.");
    return;
  }

  activeProperty = properties.find((property) => property.city.includes(destinationSelect.value)) || activeProperty;
  renderProperties();
  updateSummary();
  alert(`Availability confirmed for ${activeProperty.name} in ${destinationSelect.value}.`);
});

checkIn.addEventListener("change", updateSummary);
checkOut.addEventListener("change", updateSummary);
guestSelect.addEventListener("change", updateSummary);
roomSelect.addEventListener("change", updateSummary);
destinationSelect.addEventListener("change", () => {
  const match = properties.find((property) => property.city.startsWith(destinationSelect.value));
  if (match) {
    activeProperty = match;
    renderProperties();
    updateSummary();
  }
});

checkIn.value = getDefaultDate(7);
checkOut.value = getDefaultDate(10);
summaryStay.textContent = defaultProperty.name;
updateSelectedApartmentDisplay();
renderProperties();
updateSummary();
