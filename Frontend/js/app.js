
// ===============================
// 1. THEME SWITCHING
// ===============================

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

// Load previously saved theme
const savedTheme = localStorage.getItem("studyMateTheme");

if (savedTheme === "light") {
    document.body.classList.add("light-theme");
}

function updateThemeButton() {

    const isLight = document.body.classList.contains("light-theme");

    themeIcon.textContent = isLight ? "☾" : "☀";
    themeText.textContent = isLight ? "Dark Mode" : "Light Mode";
}

updateThemeButton();

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const currentTheme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";

    localStorage.setItem("studyMateTheme", currentTheme);

    updateThemeButton();
});

// ===============================
// 2. PAGE NAVIGATION
// ===============================

const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

function showPage(pageId) {

    // Hide all pages
    pages.forEach(page => {
        page.classList.remove("active");
    });

    // Remove active state from navigation
    navLinks.forEach(link => {
        link.classList.remove("active");
    });

    // Display selected page
    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    // Highlight selected navigation
    const selectedLink = document.querySelector(
        `.nav-link[data-page="${pageId}"]`
    );

    if (selectedLink) {
        selectedLink.classList.add("active");
    }

    if (pageId === "progress" && typeof window.renderProgress === "function") {
        window.renderProgress();
    }

    // Close mobile sidebar
    document.getElementById("sidebar").classList.remove("open");
}

// Sidebar navigation
navLinks.forEach(link => {

    link.addEventListener("click", () => {

        const pageId = link.dataset.page;

        showPage(pageId);

    });

});

// Quick action navigation
document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.go);

    });

});

// ===============================
// 3. CURRENT DATE
// ===============================

const currentDate = document.getElementById("currentDate");

const today = new Date();

currentDate.textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

// ===============================
// 4. MOBILE SIDEBAR
// ===============================

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");

mobileMenu.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});

// ===============================
// 5. INITIAL PAGE
// ===============================

showPage("dashboard");

console.log("StudyMate AI frontend initialized!");