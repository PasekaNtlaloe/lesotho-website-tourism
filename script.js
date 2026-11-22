
(function initTheme() {
    var btn = document.getElementById("darkToggle");
    var root = document.documentElement;
    var KEY = "lesotho-theme";

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        if (btn) {
            btn.innerHTML = theme === "dark" 
                ? '<i class="bi bi-sun-fill text-warning"></i> Light Mode' 
                : '<i class="bi bi-moon-stars-fill"></i> Dark Mode';
        }
    }

    var savedTheme = localStorage.getItem(KEY) || "light";
    applyTheme(savedTheme);

    if (btn) {
        btn.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            localStorage.setItem(KEY, next);
            applyTheme(next);
            showToast("Switched to " + next + " mode", next === "dark" ? "bi-moon-fill" : "bi-sun-fill");
        });
    }
})();


(function initScrollProgress() {
    var bar = document.getElementById("scrollProgress");
    var backBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", function () {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (bar) bar.style.width = scrolled + "%";
        if (backBtn) backBtn.classList.toggle("visible", scrollTop > 350);
    });

    if (backBtn) {
        backBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
})();


(function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
        items.forEach(function (el) { el.classList.add("visible"); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    items.forEach(function (el) { observer.observe(el); });
})();

(function initCounters() {
    var counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    function animateCounter(el) {
        var target = parseInt(el.getAttribute("data-target"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 1600;
        var start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString() + suffix;
            }
        }
        requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
        counters.forEach(animateCounter);
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { io.observe(el); });
})();


var weatherData = {
    maseru: { name: "Maseru (Capital)", temp: "22°C", cond: "Partly Cloudy", icon: "🌤️", alt: "1,600 m", advice: "Ideal for city tours and local craft markets" },
    afriski: { name: "AfriSki Mountain Resort", temp: "11°C", cond: "Chilly Mountain Breeze", icon: "🏔️", alt: "3,222 m", advice: "Pack thermal layers, warm jacket essential" },
    semonkong: { name: "Semonkong (Maletsunyane)", temp: "17°C", cond: "Clear & Crisp", icon: "☀️", alt: "2,200 m", advice: "Perfect weather for waterfall hiking and abseiling" },
    sanipass: { name: "Sani Pass High Summit", temp: "13°C", cond: "Brisk & Panoramic", icon: "💨", alt: "2,874 m", advice: "4x4 required, highest pub in Africa is open!" },
    katse: { name: "Katse Dam Highlands", temp: "18°C", cond: "Sunny with Gentle Breeze", icon: "🌤️", alt: "2,050 m", advice: "Excellent boat tour conditions today" }
};

function updateWeather(locationKey) {
    var data = weatherData[locationKey] || weatherData.maseru;
    var iconEl = document.getElementById("weatherIcon");
    var tempEl = document.getElementById("weatherTemp");
    var condEl = document.getElementById("weatherCondition");
    var altEl = document.getElementById("weatherAltitude");
    var advEl = document.getElementById("weatherAdvice");

    if (iconEl) iconEl.textContent = data.icon;
    if (tempEl) tempEl.textContent = data.temp;
    if (condEl) condEl.textContent = data.cond;
    if (altEl) altEl.textContent = data.alt;
    if (advEl) advEl.textContent = data.advice;
}


var exchangeRates = {
    USD: 0.056,  
    EUR: 0.052,   
    GBP: 0.044,
    AUD: 0.086   
};

function convertCurrency() {
    var input = document.getElementById("currencyInput");
    var select = document.getElementById("currencySelect");
    var resultEl = document.getElementById("currencyResult");

    if (!input || !select || !resultEl) return;

    var amount = parseFloat(input.value) || 0;
    var target = select.value;
    var rate = exchangeRates[target] || 0.056;
    var symbols = { USD: "$", EUR: "€", GBP: "£", AUD: "A$" };

    var converted = (amount * rate).toFixed(2);
    resultEl.textContent = "≈ " + (symbols[target] || "") + converted + " " + target;
}


var destinationDetails = {
    maletsunyane: {
        title: "Maletsunyane Falls",
        category: "Nature & Adventure",
        altitude: "2,200 m",
        location: "Semonkong, Thaba-Tseka District",
        bestSeason: "Nov – April (Full Flow) / Jun – Aug (Ice Sculptures)",
        img: "maletsunyane.jpeg",
        desc: "Plunging 192 metres in a single uninterrupted drop, Maletsunyane Falls is one of the highest single-drop waterfalls in Africa. It holds the Guinness World Record for the highest commercial abseil (204 m). Visitors can enjoy scenic pony treks along the canyon rim or hike down to the misty plunge pool.",
        activities: ["World-record 204m Abseil", "Basotho Pony Trekking", "Fly Fishing for Wild Trout", "Village Cultural Walks"]
    },
    katse: {
        title: "Katse Dam",
        category: "Engineering & Scenery",
        altitude: "2,050 m",
        location: "Malibamat'so River, Central Highlands",
        bestSeason: "Year-Round",
        img: "katsedam.jpeg",
        desc: "Katse Dam is the cornerstone of the monumental Lesotho Highlands Water Project. At 185 metres high, it is Africa's highest concrete double-curvature arch dam. The reservoir snakes through breathtaking mountain fjords, offering guided boat cruises, dam wall interior tours, and high-altitude botanical gardens.",
        activities: ["Dam Interior Engineering Tour", "Highland Boat Cruises", "Katse Botanical Garden Visit", "Mountain Photography"]
    },
    thebe: {
        title: "Sehlabathebe National Park",
        category: "Nature & Wilderness",
        altitude: "2,400 m",
        location: "Qacha's Nek District (UNESCO Site)",
        bestSeason: "October – April",
        img: "thebe.jpeg",
        desc: "A designated UNESCO World Heritage Site forming part of the Maloti-Drakensberg Park. Sehlabathebe offers surreal sandstone arches, rock formations, rare wildflowers, pristine mountain pools, and ancient San rock art dating back thousands of years.",
        activities: ["UNESCO Wilderness Hiking", "San Rock Art Exploration", "Birdwatching (Bearded Vulture)", "Wildflower Photography"]
    },
    afriski: {
        title: "AfriSki Mountain Resort",
        category: "Adventure & Winter Sports",
        altitude: "3,222 m",
        location: "Mahlasela Pass, Butha-Buthe District",
        bestSeason: "June – August (Ski) / Oct – April (Mountain Biking)",
        img: "ski.jpeg",
        desc: "Situated at an incredible 3,222 metres above sea level, AfriSki is Africa's premier high-altitude ski resort. In winter, enjoy ski slopes, snowboard parks, and cosy après-ski dining. In summer, the mountain transforms into an adrenaline haven for mountain biking, enduro trails, and trail running.",
        activities: ["Skiing & Snowboarding", "Snow Parks & Sledging", "High-Altitude Mountain Biking", "Sky-High Dining & Lounging"]
    },
    sanipass: {
        title: "Sani Pass",
        category: "Adventure & 4x4 Trail",
        altitude: "2,874 m",
        location: "Mokhotlong Border Route",
        bestSeason: "Year-Round (4x4 Vehicle Required)",
        img: "sanipass.jpeg",
        desc: "One of the most famous mountain passes on the planet, Sani Pass climbs dramatic hairpin bends from South Africa into Lesotho. At the summit, celebrate your ascent with a drink at the legendary Highest Pub in Africa before exploring the highland plateaus.",
        activities: ["Iconic 4x4 Mountain Ascent", "Highest Pub in Africa Experience", "Mountain Pass Panoramic Views", "Highland Photography"]
    },
    thaba: {
        title: "Thaba-Bosiu",
        category: "History & Cultural Heritage",
        altitude: "1,800 m",
        location: "Maseru District",
        bestSeason: "Year-Round",
        img: "thaba.jpeg",
        desc: "The sacred mountain fortress of King Moshoeshoe I, the founding father of the Basotho nation. Thaba-Bosiu ('Mountain at Night') was never conquered in battle. Today, it features an interactive cultural village, museum, and the royal burial grounds atop the sandstone plateau.",
        activities: ["Guided Fortress Plateau Climb", "Interactive Cultural Village", "Royal Basotho Tombs", "Moshoeshoe I Memorial"]
    }
};

(function initDestinations() {
    var searchBox    = document.getElementById("searchBox");
    var filterBtns   = document.querySelectorAll(".dest-controls .filter-btn");
    var destinations = document.querySelectorAll(".destination");
    var noResults    = document.getElementById("noResults");

    if (!destinations.length) return;

    var currentFilter = "all";
    var currentQuery  = "";

    function applyFilters() {
        var anyVisible = false;

        destinations.forEach(function (card) {
            var matchesQuery    = card.innerText.toLowerCase().includes(currentQuery);
            var matchesCategory = currentFilter === "all" || card.getAttribute("data-category") === currentFilter;

            if (matchesQuery && matchesCategory) {
                card.classList.remove("hidden");
                anyVisible = true;
            } else {
                card.classList.add("hidden");
            }
        });

        if (noResults) {
            noResults.style.display = anyVisible ? "none" : "block";
        }
    }

    if (searchBox) {
        searchBox.addEventListener("input", function () {
            currentQuery = this.value.trim().toLowerCase();
            applyFilters();
        });
    }

    filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filterBtns.forEach(function (b) { b.classList.remove("active"); });
            this.classList.add("active");
            currentFilter = this.getAttribute("data-filter") || "all";
            applyFilters();
        });
    });
})();

function clearSearch() {
    var searchBox = document.getElementById("searchBox");
    if (searchBox) {
        searchBox.value = "";
        searchBox.dispatchEvent(new Event("input"));
    }
}

function openDestinationModal(destKey) {
    var data = destinationDetails[destKey];
    if (!data) return;

    var modal = document.getElementById("destModal");
    if (!modal) return;

    document.getElementById("modalDestImg").src = data.img;
    document.getElementById("modalDestTitle").textContent = data.title;
    document.getElementById("modalDestCat").textContent = data.category;
    document.getElementById("modalDestAlt").textContent = data.altitude;
    document.getElementById("modalDestLoc").textContent = data.location;
    document.getElementById("modalDestSeason").textContent = data.bestSeason;
    document.getElementById("modalDestDesc").textContent = data.desc;

    var actList = document.getElementById("modalDestActivities");
    if (actList) {
        actList.innerHTML = data.activities.map(function (a) {
            return '<li><i class="bi bi-check-circle-fill text-success"></i> ' + a + '</li>';
        }).join("");
    }

    var bookBtn = document.getElementById("modalDestBookBtn");
    if (bookBtn) {
        bookBtn.href = "contact.html?destination=" + encodeURIComponent(data.title);
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeDestinationModal() {
    var modal = document.getElementById("destModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }
}


function calculateTripCost() {
    var accomSelect = document.getElementById("calcAccom");
    var nightsInput = document.getElementById("calcNights");
    var guestsInput = document.getElementById("calcGuests");
    var ponyCheckbox = document.getElementById("calcPony");
    var hikeCheckbox = document.getElementById("calcHike");
    var skiCheckbox  = document.getElementById("calcSki");

    var totalLslEl = document.getElementById("calcTotalLSL");
    var totalUsdEl = document.getElementById("calcTotalUSD");

    if (!accomSelect || !nightsInput || !guestsInput || !totalLslEl) return;

    var baseRate = parseFloat(accomSelect.value) || 850;
    var nights   = Math.max(1, parseInt(nightsInput.value, 10) || 1);
    var guests   = Math.max(1, parseInt(guestsInput.value, 10) || 1);

    var extras = 0;
    if (ponyCheckbox && ponyCheckbox.checked) extras += 250 * guests;
    if (hikeCheckbox && hikeCheckbox.checked) extras += 180 * guests;
    if (skiCheckbox && skiCheckbox.checked)   extras += 450 * guests;

    var totalLSL = (baseRate * nights * Math.ceil(guests / 2)) + extras;
    var totalUSD = (totalLSL * exchangeRates.USD).toFixed(0);

    totalLslEl.textContent = "M " + totalLSL.toLocaleString();
    if (totalUsdEl) totalUsdEl.textContent = "≈ $" + totalUSD + " USD";
}


var galleryImages = [
    { src: "maletsunyane.jpeg", title: "Maletsunyane Falls", cat: "Waterfalls & Rivers", desc: "192m single drop waterfall in Semonkong" },
    { src: "katsedam.jpeg", title: "Katse Dam", cat: "Engineering & Water", desc: "Africa's highest arch dam reservoir" },
    { src: "sanipass.jpeg", title: "Sani Pass Ascent", cat: "Adventure & 4x4", desc: "Dramatic hairpin climbs into the Mountain Kingdom" },
    { src: "highlands.jpeg", title: "Maloti Highlands", cat: "Mountains & Peaks", desc: "Majestic undulating peaks across Lesotho" },
    { src: "ski.jpeg", title: "AfriSki Snow Resort", cat: "Adventure & Winter", desc: "Snowboarding and skiing at 3,222m elevation" },
    { src: "hiking.jpeg", title: "Mountain Hiking", cat: "Adventure & Trails", desc: "Scenic ridge walks overlooking pristine valleys" },
    { src: "thaba.jpeg", title: "Thaba-Bosiu Fortress", cat: "Heritage & History", desc: "Historic plateau stronghold of King Moshoeshoe I" },
    { src: "thebe.jpeg", title: "Sehlabathebe National Park", cat: "Mountains & Nature", desc: "UNESCO World Heritage Site with sandstone arches" },
    { src: "basotho.jpeg", title: "Basotho Cultural Heritage", cat: "Heritage & Culture", desc: "Traditional Basotho blankets and mountain life" },
    { src: "lodge.jpg", title: "Luxury Highland Lodge", cat: "Stay & Lodges", desc: "Cosy alpine fireplace and panoramic mountain vistas" },
    { src: "hotel.jpeg", title: "Comfortable City Hotel", cat: "Stay & Lodges", desc: "Modern amenities and warm Basotho hospitality" },
    { src: "camping.jpeg", title: "Starry Highland Camping", cat: "Stay & Lodges", desc: "Unmatched stargazing under crystal-clear mountain skies" }
];

var currentPhotoIndex = 0;

(function initGalleryFilter() {
    var filterBtns = document.querySelectorAll(".gallery-filter-btn");
    var items      = document.querySelectorAll(".gallery-item");

    if (!items.length) return;

    filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filterBtns.forEach(function (b) { b.classList.remove("active"); });
            this.classList.add("active");
            var filter = this.getAttribute("data-filter") || "all";

            items.forEach(function (item) {
                if (filter === "all" || item.getAttribute("data-category") === filter) {
                    item.classList.remove("hidden");
                } else {
                    item.classList.add("hidden");
                }
            });
        });
    });
})();

function showImage(src, caption) {
    var modal = document.getElementById("imageModal");
    var preview = document.getElementById("previewImage");
    var capEl = document.getElementById("previewCaption");
    var countEl = document.getElementById("previewCounter");

    if (!modal || !preview) return;

    for (var i = 0; i < galleryImages.length; i++) {
        if (galleryImages[i].src === src || src.indexOf(galleryImages[i].src) !== -1) {
            currentPhotoIndex = i;
            break;
        }
    }

    var item = galleryImages[currentPhotoIndex];
    preview.src = item.src;
    if (capEl) capEl.textContent = item.title + " — " + item.desc;
    if (countEl) countEl.textContent = (currentPhotoIndex + 1) + " / " + galleryImages.length;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeImage() {
    var modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }
}

function navigateGallery(dir) {
    currentPhotoIndex = (currentPhotoIndex + dir + galleryImages.length) % galleryImages.length;
    var item = galleryImages[currentPhotoIndex];

    var preview = document.getElementById("previewImage");
    var capEl   = document.getElementById("previewCaption");
    var countEl = document.getElementById("previewCounter");

    if (preview) preview.src = item.src;
    if (capEl) capEl.textContent = item.title + " — " + item.desc;
    if (countEl) countEl.textContent = (currentPhotoIndex + 1) + " / " + galleryImages.length;
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeImage();
        closeDestinationModal();
    }
    if (e.key === "ArrowRight") navigateGallery(1);
    if (e.key === "ArrowLeft")  navigateGallery(-1);
});

var USERS_KEY   = "lesothoUsers";
var SESSION_KEY = "lesothoSession";

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}
function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}


(function initGlobalUserNav() {
    var session = getSession();
    var pill = document.getElementById("navUserPill");
    var nameEl = document.getElementById("navUserName");
    var avatarEl = document.getElementById("navUserAvatar");

    if (session && pill && nameEl && avatarEl) {
        pill.classList.add("visible");
        nameEl.textContent = session.firstName;
        avatarEl.textContent = ((session.firstName || "?")[0] + (session.lastName || "?")[0]).toUpperCase();
    }
})();

function switchAuthTab(tab) {
    var loginPane    = document.getElementById("pane-login");
    var registerPane = document.getElementById("pane-register");
    var bookingsPane = document.getElementById("pane-bookings");

    var loginTab     = document.getElementById("tab-login");
    var registerTab  = document.getElementById("tab-register");
    var bookingsTab  = document.getElementById("tab-bookings");

    if (!loginPane || !registerPane) return;

    if (loginPane) loginPane.style.display = "none";
    if (registerPane) registerPane.style.display = "none";
    if (bookingsPane) bookingsPane.style.display = "none";

    if (loginTab) { loginTab.classList.remove("active"); loginTab.setAttribute("aria-selected", "false"); }
    if (registerTab) { registerTab.classList.remove("active"); registerTab.setAttribute("aria-selected", "false"); }
    if (bookingsTab) { bookingsTab.classList.remove("active"); bookingsTab.setAttribute("aria-selected", "false"); }

    if (tab === "login") {
        loginPane.style.display = "";
        loginTab.classList.add("active");
        loginTab.setAttribute("aria-selected", "true");
    } else if (tab === "register") {
        registerPane.style.display = "";
        registerTab.classList.add("active");
        registerTab.setAttribute("aria-selected", "true");
    } else if (tab === "bookings") {
        if (bookingsPane) bookingsPane.style.display = "";
        if (bookingsTab) {
            bookingsTab.classList.add("active");
            bookingsTab.setAttribute("aria-selected", "true");
        }
        renderMyBookings();
    }
}

function togglePw(inputId, btn) {
    var input = document.getElementById(inputId);
    if (!input) return;
    var isText = input.type === "text";
    input.type = isText ? "password" : "text";
    btn.innerHTML = isText ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
}

function updateStrength(pw) {
    var fill  = document.getElementById("strengthFill");
    var label = document.getElementById("strengthLabel");
    if (!fill || !label) return;

    var score = 0;
    if (pw.length >= 8)           score++;
    if (/[A-Z]/.test(pw))         score++;
    if (/[0-9]/.test(pw))         score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length >= 12)          score++;

    var levels = [
        { pct: "0%",   color: "#ccc",    text: "" },
        { pct: "25%",  color: "#e74c3c", text: "Weak" },
        { pct: "50%",  color: "#f39c12", text: "Fair" },
        { pct: "75%",  color: "#2ecc71", text: "Good" },
        { pct: "100%", color: "#0e5b3f", text: "Strong 💪" }
    ];

    var lvl = pw.length === 0 ? levels[0] : levels[Math.min(score, 4)];
    fill.style.width      = lvl.pct;
    fill.style.background = lvl.color;
    label.textContent     = lvl.text;
    label.style.color     = lvl.color;
}

function showForgot() {
    var email = prompt("Enter your registered email address and we will send a password reset link:");
    if (!email) return;
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    showToast("Reset link sent to " + email, "bi-envelope-check-fill");
}

function showLoggedInState(user) {
    var loginPane = document.getElementById("pane-login");
    var regTab    = document.getElementById("tab-register");
    if (!loginPane) return;

    var initials = ((user.firstName || "?")[0] + (user.lastName || "?")[0]).toUpperCase();

    var greeting =
        '<div class="logged-in-banner">' +
        '  <div class="logged-in-avatar">' + initials + '</div>' +
        '  <div>' +
        '    <strong>Welcome back, ' + user.firstName + '! 👋</strong>' +
        '    <p>Signed in as <em>' + user.email + '</em></p>' +
        '  </div>' +
        '</div>' +
        '<div class="d-flex gap-2 mt-3">' +
        '  <button class="btn btn-outline-success btn-sm" onclick="switchAuthTab(\'bookings\')"><i class="bi bi-journal-bookmark"></i> View My Bookings</button>' +
        '  <button class="btn btn-outline-danger btn-sm" onclick="signOut()"><i class="bi bi-box-arrow-right"></i> Sign Out</button>' +
        '</div>';

    loginPane.innerHTML = greeting;
    if (regTab) regTab.style.display = "none";
}

function signOut() {
    clearSession();
    showToast("Signed out successfully", "bi-check-circle-fill");
    setTimeout(function () { location.reload(); }, 600);
}

// Initialize Auth listeners on contact.html
(function initAuthForms() {
    var session = getSession();
    if (session) showLoggedInState(session);

    // Register Form
    var regForm = document.getElementById("registerForm");
    if (regForm) {
        regForm.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!regForm.checkValidity()) { regForm.reportValidity(); return; }

            var firstName = document.getElementById("regFirstName").value.trim();
            var lastName  = document.getElementById("regLastName").value.trim();
            var email     = document.getElementById("regEmail").value.trim().toLowerCase();
            var phone     = document.getElementById("regPhone").value.trim();
            var country   = document.getElementById("regCountry").value;
            var password  = document.getElementById("regPassword").value;
            var confirm   = document.getElementById("regConfirm").value;
            var feedback  = document.getElementById("registerFeedback");

            if (password !== confirm) {
                feedback.innerHTML = '<div class="alert alert-danger"><i class="bi bi-exclamation-circle-fill"></i> Passwords do not match.</div>';
                return;
            }

            var users = getUsers();
            if (users.find(function (u) { return u.email === email; })) {
                feedback.innerHTML = '<div class="alert alert-warning"><i class="bi bi-exclamation-triangle-fill"></i> An account with that email already exists. <a href="#" onclick="switchAuthTab(\'login\'); return false;">Sign in →</a></div>';
                return;
            }

            var newUser = {
                firstName: firstName,
                lastName:  lastName,
                email:     email,
                phone:     phone,
                country:   country,
                password:  btoa(unescape(encodeURIComponent(password))),
                joined:    new Date().toISOString()
            };

            users.push(newUser);
            saveUsers(users);
            setSession({ firstName: firstName, lastName: lastName, email: email });

            feedback.innerHTML = '<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> Welcome, <strong>' + firstName + '</strong>! Your account has been created.</div>';
            showToast("Welcome to Discover Lesotho, " + firstName + "!", "bi-person-check-fill");

            setTimeout(function () {
                showLoggedInState(newUser);
                switchAuthTab("login");
            }, 1000);
        });
    }

    // Login Form
    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!loginForm.checkValidity()) { loginForm.reportValidity(); return; }

            var email    = document.getElementById("loginEmail").value.trim().toLowerCase();
            var password = document.getElementById("loginPassword").value;
            var feedback = document.getElementById("loginFeedback");
            var users    = getUsers();
            var stored   = btoa(unescape(encodeURIComponent(password)));

            var match = users.find(function (u) {
                return u.email === email && u.password === stored;
            });

            if (!match) {
                feedback.innerHTML = '<div class="alert alert-danger"><i class="bi bi-x-circle-fill"></i> Incorrect email or password. Please try again.</div>';
                return;
            }

            setSession({ firstName: match.firstName, lastName: match.lastName, email: match.email });
            feedback.innerHTML = '<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> Welcome back, <strong>' + match.firstName + '</strong>!</div>';
            showToast("Signed in as " + match.firstName, "bi-door-open-fill");

            setTimeout(function () { showLoggedInState(match); }, 800);
        });
    }
})();


function renderMyBookings() {
    var container = document.getElementById("myBookingsList");
    if (!container) return;

    var bookings = JSON.parse(localStorage.getItem("tourismBookings") || "[]");

    if (!bookings.length) {
        container.innerHTML = '<p class="text-muted text-center py-4"><i class="bi bi-calendar-x fs-2 d-block mb-2"></i>No bookings saved yet. Fill in the form below to enquire!</p>';
        return;
    }

    container.innerHTML = bookings.map(function (b, idx) {
        return (
            '<div class="booking-history-item">' +
            '  <div class="booking-history-meta">' +
            '    <strong>' + (b.destination || "Lesotho Tour") + ' <span class="booking-status-badge"><i class="bi bi-clock-history"></i> Enquiry Confirmed</span></strong>' +
            '    <span><i class="bi bi-calendar-event"></i> ' + (b.date || "Flexible") + ' &bull; <i class="bi bi-people"></i> ' + (b.guests || 2) + ' Guests &bull; <i class="bi bi-house"></i> ' + (b.accommodation || "Standard") + '</span>' +
            '    <div class="small text-muted mt-1">Ref: <strong>#LS-2026-' + (1000 + idx) + '</strong> &bull; Contact: ' + b.email + '</div>' +
            '  </div>' +
            '  <div>' +
            '    <button class="btn btn-outline-danger btn-sm" onclick="cancelBooking(' + idx + ')"><i class="bi bi-trash"></i> Cancel</button>' +
            '  </div>' +
            '</div>'
        );
    }).join("");
}

function cancelBooking(idx) {
    if (!confirm("Are you sure you want to cancel this booking enquiry?")) return;
    var bookings = JSON.parse(localStorage.getItem("tourismBookings") || "[]");
    bookings.splice(idx, 1);
    localStorage.setItem("tourismBookings", JSON.stringify(bookings));
    renderMyBookings();
    showToast("Booking enquiry cancelled", "bi-info-circle");
}

(function initBookingForm() {
    var form = document.getElementById("bookingForm");
    if (!form) return;

   
    var dateInput = document.getElementById("date");
    if (dateInput) {
        var today = new Date().toISOString().split("T")[0];
        dateInput.setAttribute("min", today);
    }

   
    var urlParams = new URLSearchParams(window.location.search);
    var destParam = urlParams.get("destination");
    var accomParam = urlParams.get("accommodation");

    if (destParam && document.getElementById("destination")) {
        document.getElementById("destination").value = destParam;
    }
    if (accomParam && document.getElementById("accommodation")) {
        document.getElementById("accommodation").value = accomParam;
    }

    
    var session = getSession();
    if (session) {
        var nameInput = document.getElementById("name");
        var emailInput = document.getElementById("email");
        if (nameInput && !nameInput.value) nameInput.value = session.firstName + " " + session.lastName;
        if (emailInput && !emailInput.value) emailInput.value = session.email;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }

        var booking = {
            name:          document.getElementById("name").value.trim(),
            email:         document.getElementById("email").value.trim(),
            phone:         document.getElementById("phone").value.trim(),
            date:          document.getElementById("date").value,
            guests:        (document.getElementById("guests") || {}).value || "2",
            destination:   document.getElementById("destination").value,
            accommodation: (document.getElementById("accommodation") || {}).value || "Not specified",
            message:       (document.getElementById("message") || {}).value.trim(),
            createdAt:     new Date().toISOString()
        };

        var bookings = JSON.parse(localStorage.getItem("tourismBookings") || "[]");
        bookings.push(booking);
        localStorage.setItem("tourismBookings", JSON.stringify(bookings));

        var feedback = document.getElementById("feedback");
        if (feedback) {
            feedback.innerHTML =
                '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                '  <h5 class="alert-heading"><i class="bi bi-check-circle-fill"></i> Enquiry Submitted Successfully!</h5>' +
                '  <p>Thank you, <strong>' + booking.name + '</strong>! Your booking enquiry for <strong>' + booking.destination + '</strong> on <strong>' + booking.date + '</strong> has been registered under reference <strong>#LS-2026-' + (1000 + bookings.length) + '</strong>.</p>' +
                '  <hr>' +
                '  <p class="mb-0">Our local travel concierge will contact you at <strong>' + booking.email + '</strong> or <strong>' + booking.phone + '</strong> within 24 hours.</p>' +
                '</div>';
        }

        showToast("Booking enquiry saved!", "bi-check-all");
        form.reset();
        renderMyBookings();

        if (feedback) {
            window.scrollTo({ top: feedback.offsetTop - 80, behavior: "smooth" });
        }
    });
})();


function showToast(message, iconClass) {
    var container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    var toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML = '<i class="bi ' + (iconClass || "bi-info-circle-fill") + ' text-success fs-5"></i><span>' + message + '</span>';

    container.appendChild(toast);

    setTimeout(function () {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        setTimeout(function () { toast.remove(); }, 300);
    }, 3200);
}
function handleNewsletter(e) {
    e.preventDefault();
    var input = document.getElementById("newsletterEmail");
    if (input && input.value) {
        showToast("Subscribed! Travel guide sent to " + input.value, "bi-envelope-heart-fill");
        input.value = "";
    }
}
