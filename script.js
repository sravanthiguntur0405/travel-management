
/* =====================================
   WANDERLY - TRAVEL WEBSITE
   Frontend JavaScript
===================================== */

// Destination data
const destinations = [
    {
        id: 1,
        name: "Goa",
        category: "beach",
        price: 7999,
        rating: 4.8,
        description: "Enjoy beautiful beaches, water sports and amazing sunsets.",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700"
    },
    {
        id: 2,
        name: "Manali",
        category: "mountain",
        price: 8999,
        rating: 4.9,
        description: "Experience snow-covered mountains and adventure activities.",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700"
    },
    {
        id: 3,
        name: "Kerala",
        category: "nature",
        price: 6999,
        rating: 4.7,
        description: "Explore peaceful backwaters and beautiful green landscapes.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700"
    },
    {
        id: 4,
        name: "Jaipur",
        category: "heritage",
        price: 5499,
        rating: 4.6,
        description: "Discover magnificent forts, royal palaces and culture.",
        image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=700"
    },
    {
        id: 5,
        name: "Agra",
        category: "heritage",
        price: 4999,
        rating: 4.8,
        description: "Visit the iconic Taj Mahal and explore historical monuments.",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=700"
    },
    {
        id: 6,
        name: "Ooty",
        category: "mountain",
        price: 5999,
        rating: 4.5,
        description: "Enjoy tea gardens, pleasant weather and scenic hills.",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=700"
    }
];

// Hotel data
const hotels = [
    {
        name: "Ocean View Resort",
        location: "Goa",
        price: 3500,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700"
    },
    {
        name: "Mountain Paradise",
        location: "Manali",
        price: 4200,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700"
    },
    {
        name: "Green Valley Resort",
        location: "Kerala",
        price: 3000,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700"
    }
];

const packages = {
    "Basic Package": 4999,
    "Standard Package": 8999,
    "Premium Package": 14999
};

// LocalStorage data
let bookings = JSON.parse(localStorage.getItem("wanderlyBookings")) || [];
let wishlist = JSON.parse(localStorage.getItem("wanderlyWishlist")) || [];

let selectedPrice = packages["Basic Package"];

// Helper functions
function saveData() {
    localStorage.setItem("wanderlyBookings", JSON.stringify(bookings));
    localStorage.setItem("wanderlyWishlist", JSON.stringify(wishlist));
}

function formatPrice(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
}

function notify(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// =====================================
// DISPLAY DESTINATIONS
// =====================================

function displayDestinations(list = destinations) {
    const grid = document.getElementById("destinationGrid");

    if (list.length === 0) {
        grid.innerHTML = '<p class="empty-message">No destinations found.</p>';
        return;
    }

    grid.innerHTML = list.map(place => `
        <div class="destination-card">
            <div class="card-image">
                <img src="${place.image}" alt="${place.name}" loading="lazy">

                <button class="favorite"
                    onclick="toggleWishlist(${place.id})">
                    ${wishlist.includes(place.id) ? "♥" : "♡"}
                </button>
            </div>

            <div class="card-info">
                <h3>${place.name}</h3>
                <p>${place.description}</p>

                <div class="card-meta">
                    <span>⭐ ${place.rating}</span>
                    <span class="card-price">
                        From ${formatPrice(place.price)}
                    </span>
                </div>

                <button onclick="showDestination(${place.id})">
                    View Details
                </button>
            </div>
        </div>
    `).join("");
}

// =====================================
// SEARCH AND FILTER
// =====================================

function filterDestinations() {
    const search = document
        .getElementById("destinationSearch")
        .value.toLowerCase();

    const category = document.getElementById("categoryFilter").value;
    const sort = document.getElementById("sortFilter").value;

    let result = destinations.filter(place => {
        const matchesSearch =
            place.name.toLowerCase().includes(search) ||
            place.description.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" || place.category === category;

        return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
        result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
        result.sort((a, b) => b.rating - a.rating);
    }

    displayDestinations(result);
}

document.getElementById("destinationSearch")
    .addEventListener("input", filterDestinations);

document.getElementById("categoryFilter")
    .addEventListener("change", filterDestinations);

document.getElementById("sortFilter")
    .addEventListener("change", filterDestinations);

// Hero search
document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();

    const search = document.getElementById("heroSearch").value.trim();

    document.getElementById("destinationSearch").value = search;

    filterDestinations();

    document.getElementById("destinations").scrollIntoView({
        behavior: "smooth"
    });
});

// =====================================
// DESTINATION DETAILS
// =====================================

function showDestination(id) {
    const place = destinations.find(item => item.id === id);

    if (!place) return;

    document.getElementById("detailsBody").innerHTML = `
        <img src="${place.image}" alt="${place.name}"
             style="width:100%;height:220px;object-fit:cover;border-radius:10px">

        <h2>${place.name}</h2>

        <p>${place.description}</p>

        <p style="margin:15px 0">
            Category: ${place.category}<br>
            Rating: ⭐ ${place.rating}<br>
            Starting Price: <strong>${formatPrice(place.price)}</strong>
        </p>

        <button class="primary-btn"
            onclick="openBooking('Basic Package',4999,'${place.name}')">
            Book This Destination
        </button>
    `;

    openModal("detailsModal");
}

// =====================================
// WISHLIST
// =====================================

function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
        notify("Removed from wishlist");
    } else {
        wishlist.push(id);
        notify("Added to wishlist ❤️");
    }

    saveData();
    filterDestinations();
}

function showWishlist() {
    const items = destinations.filter(place => wishlist.includes(place.id));

    document.getElementById("dashboardBody").innerHTML = `
        <h2>My Wishlist ❤️</h2>

        ${items.length === 0
            ? '<p class="empty-message">Your wishlist is empty.</p>'
            : items.map(place => `
                <div class="booking-item">
                    <h3>${place.name}</h3>
                    <p>${place.description}</p>
                    <p>Price: ${formatPrice(place.price)}</p>

                    <button onclick="toggleWishlist(${place.id});showWishlist()">
                        Remove
                    </button>

                    <button onclick="closeModal();showDestination(${place.id})">
                        View Details
                    </button>
                </div>
            `).join("")
        }
    `;

    openModal("dashboardModal");
}

// =====================================
// DISPLAY HOTELS
// =====================================

function displayHotels() {
    const grid = document.getElementById("hotelGrid");

    grid.innerHTML = hotels.map((hotel, index) => `
        <div class="hotel-card">
            <img src="${hotel.image}" alt="${hotel.name}" loading="lazy">

            <div class="card-info">
                <h3>${hotel.name}</h3>
                <p>📍 ${hotel.location}</p>
                <p>⭐ ${hotel.rating} | Comfortable Stay</p>

                <div class="card-meta">
                    <strong>${formatPrice(hotel.price)} / night</strong>
                </div>

                <button onclick="bookHotel(${index})">
                    Book Hotel
                </button>
            </div>
        </div>
    `).join("");
}

function bookHotel(index) {
    const hotel = hotels[index];

    openBooking("Basic Package", 4999, hotel.location);
    notify("Selected hotel: " + hotel.name);
}

// =====================================
// BOOKING MODAL
// =====================================

function openBooking(packageName, price, destination = "") {
    selectedPrice = price;

    document.getElementById("bookingPackage").value = packageName;
    document.getElementById("bookingDestination").value = destination;

    document.getElementById("unitPrice").textContent =
        formatPrice(price);

    updateTotal();

    closeModal();

    openModal("bookingModal");
}

function openModal(id) {
    document.getElementById(id).classList.add("active");
}

function closeModal() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("active");
    });
}

// Close when clicking outside modal
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });
});

// =====================================
// AUTOMATIC PRICE CALCULATOR
// =====================================

const packageSelect = document.getElementById("bookingPackage");
const travellerInput = document.getElementById("travellers");

packageSelect.addEventListener("change", () => {
    selectedPrice = packages[packageSelect.value];
    updateTotal();
});

travellerInput.addEventListener("input", updateTotal);

function updateTotal() {
    const people = Math.max(
        1,
        Number(travellerInput.value) || 1
    );

    document.getElementById("unitPrice").textContent =
        formatPrice(selectedPrice);

    document.getElementById("totalPrice").textContent =
        formatPrice(selectedPrice * people);
}

// Populate destination dropdown
function populateDestinations() {
    const select = document.getElementById("bookingDestination");

    destinations.forEach(place => {
        const option = document.createElement("option");
        option.value = place.name;
        option.textContent = place.name;
        select.appendChild(option);
    });
}

// Minimum travel date
const today = new Date();
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

document.getElementById("bookingDate").min = localToday;

// =====================================
// SUBMIT BOOKING
// =====================================

document.getElementById("bookingForm").addEventListener("submit", event => {
    event.preventDefault();

    const booking = {
        id: Date.now(),
        name: document.getElementById("customerName").value.trim(),
        email: document.getElementById("customerEmail").value.trim(),
        phone: document.getElementById("customerPhone").value,
        destination: document.getElementById("bookingDestination").value,
        packageName: packageSelect.value,
        date: document.getElementById("bookingDate").value,
        travellers: Number(travellerInput.value),
        total: selectedPrice * Number(travellerInput.value),
        status: "Confirmed"
    };

    if (!booking.destination) {
        notify("Please select a destination.");
        return;
    }

    bookings.push(booking);
    saveData();

    document.getElementById("bookingForm").reset();

    selectedPrice = packages["Basic Package"];
    updateTotal();

    closeModal();

    notify("Booking saved successfully!");

    alert(
        "Booking Successful!\n\n" +
        "Destination: " + booking.destination +
        "\nPackage: " + booking.packageName +
        "\nTravellers: " + booking.travellers +
        "\nTotal: " + formatPrice(booking.total)
    );
});

// =====================================
// MY BOOKINGS DASHBOARD
// =====================================

function showBookings() {
    document.getElementById("dashboardBody").innerHTML = `
        <h2>My Bookings ✈️</h2>

        <p style="margin-bottom:20px;color:var(--muted)">
            Your travel booking history.
        </p>

        ${bookings.length === 0
            ? '<p class="empty-message">No bookings available yet.</p>'
            : [...bookings].reverse().map(booking => `
                <div class="booking-item">
                    <h3>${booking.destination}</h3>

                    <p>Booking ID: ${booking.id}</p>
                    <p>Traveller: ${booking.name}</p>
                    <p>Package: ${booking.packageName}</p>
                    <p>Travel Date: ${booking.date}</p>
                    <p>People: ${booking.travellers}</p>
                    <p>Total: <strong>${formatPrice(booking.total)}</strong></p>
                    <p>Status: ${booking.status}</p>

                    ${booking.status === "Cancelled"
                        ? '<p>Booking cancelled.</p>'
                        : `<button onclick="cancelBooking(${booking.id})">
                            Cancel Booking
                           </button>`
                    }
                </div>
            `).join("")
        }
    `;

    openModal("dashboardModal");
}

function cancelBooking(id) {
    const booking = bookings.find(item => item.id === id);

    if (!booking || booking.status === "Cancelled") return;

    if (confirm("Are you sure you want to cancel this booking?")) {
        booking.status = "Cancelled";

        saveData();
        showBookings();

        notify("Booking cancelled.");
    }
}

// =====================================
// DARK MODE
// =====================================

const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("wanderlyTheme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("wanderlyTheme", isDark ? "dark" : "light");

    themeToggle.textContent = isDark ? "☀️" : "🌙";
});

// =====================================
// NEWSLETTER
// =====================================

document.getElementById("newsletterForm").addEventListener("submit", event => {
    event.preventDefault();

    const email = event.target.querySelector("input").value;

    let subscribers = JSON.parse(
        localStorage.getItem("wanderlySubscribers") || "[]"
    );

    if (subscribers.includes(email)) {
        notify("You are already subscribed!");
        return;
    }

    subscribers.push(email);

    localStorage.setItem(
        "wanderlySubscribers",
        JSON.stringify(subscribers)
    );

    event.target.reset();
    notify("Successfully subscribed!");
});

// =====================================
// INITIALIZE WEBSITE
// =====================================

displayDestinations();
displayHotels();
populateDestinations();
updateTotal();
