console.log("StudyMate Assistant JS Loaded");
// ========================================
// STUDYMATE AI - CHAT ASSISTANT
// ========================================

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chatSuggestions = document.getElementById("chatSuggestions");

// Display a chat message
function addMessage(message, sender) {

    const messageElement = document.createElement("div");

    if (sender === "user") {

        messageElement.className = "user-message";

        const content = document.createElement("div");
        content.className = "message-content";
        content.textContent = message;

        messageElement.appendChild(content);

    } else {

        messageElement.className = "bot-message";

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = "✦";

        const content = document.createElement("div");
        content.className = "message-content";

        const paragraph = document.createElement("p");
        paragraph.textContent = message;

        const label = document.createElement("small");
        label.textContent = "StudyMate AI";

        content.appendChild(paragraph);
        content.appendChild(label);

        messageElement.appendChild(avatar);
        messageElement.appendChild(content);
    }

    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Temporary rule-based responses
function getDemoResponse(message) {

    const text = message.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
        return "Hello! 👋 What would you like to study today?";
    }

    if (text.includes("exam") || text.includes("prepare")) {
        return "Start by dividing your syllabus into smaller topics. Prioritize difficult topics, practise questions daily, and reserve time for revision before your exam.";
    }

    if (text.includes("concept") || text.includes("explain")) {
        return "Of course! Tell me the name of the concept and your subject. I'll help you understand it step by step.";
    }

    if (text.includes("motivat")) {
        return "Remember, consistency matters more than perfection. Even a small amount of focused study every day can make a difference. Keep going! 🌟";
    }

    if (text.includes("study tip") || text.includes("tips")) {
        return "Try the Pomodoro technique: study for 25 minutes, take a 5-minute break, and repeat. Also, practise active recall instead of only rereading your notes.";
    }

        return "I can help with study planning, exam preparation, and basic study tips. Try asking me about one of these topics!";
}

// Handle message submission

chatForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const message = chatInput.value.trim();

    if (!message) return;

    addMessage(message, "user");

    chatInput.value = "";
    chatSuggestions.style.display = "none";

    const useGemini = window.StudyMateConfig?.useGemini === true;

    // Public Mode: Directly use rule-based responses

    if (!useGemini) {
        addMessage(getDemoResponse(message), "bot");
        return;
    }

    // Local Mode: Try Gemini

    addMessage("Thinking...", "bot");

    const loadingMessage = chatMessages.lastElementChild;

    try {

        const response = await fetch(
            "http://localhost:3000/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: message })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to get a response.");
        }

        loadingMessage.remove();

        addMessage(data.reply, "bot");

    } catch (error) {

        console.error("Gemini Chat Error:", error);

        loadingMessage.remove();

        // Automatic rule-based fallback

        addMessage(getDemoResponse(message), "bot");

    }

});


// Handle suggested questions
chatSuggestions.addEventListener("click", function (event) {

    const button = event.target.closest(".suggestion-button");

    if (!button) return;

    chatInput.value = button.textContent;

    chatForm.requestSubmit();

});

// Make function globally accessible
window.addMessage = addMessage;
console.log("addMessage function registered:", typeof window.addMessage)