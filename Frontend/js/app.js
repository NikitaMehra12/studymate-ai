
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
// ========================================
// PERSONALIZED USER PROFILE
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const userNameElement = document.getElementById("userName");
    const welcomeNameElement = document.getElementById("welcomeName");
    const profileAvatar = document.getElementById("profileAvatar");
    const editNameBtn = document.getElementById("editNameBtn");

    let userName = localStorage.getItem("studyMateUserName") || "Student";

    // Update username everywhere
    function updateUserName() {
        if (userNameElement) {
            userNameElement.textContent = userName;
        }

        if (welcomeNameElement) {
            welcomeNameElement.textContent = userName;
        }

        if (profileAvatar) {
            profileAvatar.textContent = userName.charAt(0).toUpperCase();
        }
    }

    // Edit username
    if (editNameBtn) {
        editNameBtn.addEventListener("click", () => {

            // Create name input popup
            const overlay = document.createElement("div");
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.6);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;

            overlay.innerHTML = `
                <div style="
                    background: var(--card);
                    padding: 25px;
                    border-radius: 15px;
                    width: 300px;
                    max-width: 90%;
                    color: var(--text);
                    text-align: center;
                ">
                    <h3 style="margin-bottom: 15px;">Edit Your Name</h3>

                    <input
                        type="text"
                        id="newUserNameInput"
                        value="${userName.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}"
                        placeholder="Enter your name"
                        style="
                            width: 100%;
                            padding: 12px;
                            border-radius: 8px;
                            border: 1px solid var(--border);
                            background: var(--input);
                            color: var(--text);
                            margin-bottom: 15px;
                            box-sizing: border-box;
                        "
                    >

                    <div style="display: flex; gap: 10px;">
                        <button id="cancelNameBtn" style="
                            flex: 1;
                            padding: 10px;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                        ">Cancel</button>

                        <button id="saveNameBtn" style="
                            flex: 1;
                            padding: 10px;
                            border: none;
                            border-radius: 8px;
                            background: var(--primary);
                            color: white;
                            cursor: pointer;
                        ">Save</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const nameInput = document.getElementById("newUserNameInput");

            nameInput.focus();
            nameInput.select();

            // Save name
            document.getElementById("saveNameBtn").addEventListener("click", () => {

                const newName = nameInput.value.trim();

                if (!newName) {
                    nameInput.focus();
                    return;
                }

                userName = newName;

                localStorage.setItem("studyMateUserName", userName);

                updateUserName();

                overlay.remove();

            });

            // Cancel
            document.getElementById("cancelNameBtn").addEventListener("click", () => {
                overlay.remove();
            });

            // Save using Enter key
            nameInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    document.getElementById("saveNameBtn").click();
                }

                if (event.key === "Escape") {
                    overlay.remove();
                }
            });

        });
    }

    updateUserName();

});