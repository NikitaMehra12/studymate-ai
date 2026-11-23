// ========================================
// STUDYMATE AI - AI STUDY PLANNER
// ========================================

// Get HTML elements

const plannerForm = document.getElementById("plannerForm");

const plannerSubject = document.getElementById("plannerSubject");
const plannerHours = document.getElementById("plannerHours");
const plannerStartDate = document.getElementById("plannerStartDate");
const plannerExamDate = document.getElementById("plannerExamDate");
const plannerLevel = document.getElementById("plannerLevel");
const plannerTopics = document.getElementById("plannerTopics");

const plannerResult = document.getElementById("plannerResult");

const generateButton = plannerForm.querySelector(
    'button[type="submit"]'
);


// ========================================
// 1. GENERATE STUDY PLAN
// ========================================

plannerForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const subject = plannerSubject.value.trim();
    const hours = Number(plannerHours.value);
    const startDate = plannerStartDate.value;
    const examDate = plannerExamDate.value;
    const level = plannerLevel.value;

    const topics = plannerTopics.value
        .split(/,|\n/)
        .map(topic => topic.trim())
        .filter(topic => topic.length > 0);

    // Validate inputs

    if (!subject || !startDate || !examDate || topics.length === 0) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!Number.isFinite(hours) || hours < 1 || hours > 12) {
        alert("Study hours must be between 1 and 12.");
        return;
    }

    const start = new Date(startDate + "T00:00:00");
    const exam = new Date(examDate + "T00:00:00");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
        alert("Start date cannot be in the past.");
        return;
    }

    if (exam <= start) {
        alert("Exam date must be after the start date.");
        return;
    }

    const totalDays = Math.round(
        (exam - start) / (1000 * 60 * 60 * 24)
    );

    if (totalDays > 365) {
        alert("Please select an exam date within one year.");
        return;
    }

    // Prepare planner data

    const requestData = {
        subject: subject,
        dailyHours: hours,
        startDate: startDate,
        examDate: examDate,
        preparationLevel: level,
        topics: topics
    };

    const useGemini = window.StudyMateConfig?.useGemini === true;

    // Show loading status

    generateButton.disabled = true;
    generateButton.textContent = "Generating Your Timetable...";

    plannerResult.innerHTML = `
        <div class="planner-schedule">
            <h3>Creating Your Study Plan...</h3>
            <p>Please wait while your timetable is being prepared.</p>
        </div>
    `;

    let studyPlan;
    let generatedByAI = false;

    try {

        // Local Developer Mode: Try Gemini

        if (useGemini) {

            try {

                const response = await fetch(
                    "http://localhost:3000/api/generate-study-plan",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(requestData)
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Unable to generate AI study plan."
                    );
                }

                studyPlan = data.studyPlan;

                if (
                    !studyPlan ||
                    !Array.isArray(studyPlan.schedule) ||
                    studyPlan.schedule.length === 0
                ) {
                    throw new Error("Gemini returned an invalid timetable.");
                }

                generatedByAI = true;

            } catch (error) {

                console.error("Gemini failed. Using rule-based planner:", error);

                studyPlan = generateFallbackPlan(requestData);

            }

        } else {

            // Public Mode: Directly use rule-based planner

            studyPlan = generateFallbackPlan(requestData);

        }

        // Add common information

        studyPlan.startDate = startDate;
        studyPlan.examDate = examDate;
        studyPlan.totalDays = studyPlan.totalDays ||
        studyPlan.schedule.length;

        studyPlan.dailyHours = hours;
        studyPlan.preparationLevel = level;
        studyPlan.subject = subject;
        studyPlan.topics = topics;

        // Save timetable

        localStorage.setItem(
            "studyMateStudyPlan",
            JSON.stringify(studyPlan)
        );

        // Display timetable

        displayStudyPlan(studyPlan);

        plannerForm.reset();

        if (generatedByAI) {
            alert("Your AI-powered study timetable has been generated!");
        } else {
            alert("Your study timetable has been generated successfully!");
        }

    } catch (error) {

        console.error("Study Planner Error:", error);

        plannerResult.innerHTML = `
            <div class="planner-schedule">
                <h3>Unable to Generate Timetable</h3>
                <p>Please check your inputs and try again.</p>
            </div>
        `;

    } finally {

        generateButton.disabled = false;
        generateButton.textContent = "Generate Study Plan";

    }

});


// ========================================
// 6. FALLBACK PLANNER
// ========================================

function generateFallbackPlan(data) {

    const start = new Date(data.startDate + "T00:00:00");

    const exam = new Date(data.examDate + "T00:00:00");

    const totalDays = Math.round(
        (exam - start) / (1000 * 60 * 60 * 24)
    );

    const schedule = [];

    for (let i = 0; i < totalDays; i++) {

        const topicStart = Math.floor(
            (i * data.topics.length) / totalDays
        );

        const topicEnd = Math.floor(
            ((i + 1) * data.topics.length) / totalDays
        );

        const dailyTopics = data.topics.slice(
            topicStart,
            topicEnd
        );

        const currentDate = new Date(start);

        currentDate.setDate(start.getDate() + i);

        const formattedDate = [
            currentDate.getFullYear(),
            String(currentDate.getMonth() + 1).padStart(2, "0"),
            String(currentDate.getDate()).padStart(2, "0")
        ].join("-");

        schedule.push({

            date: formattedDate,

            topics: dailyTopics.length > 0
                ? dailyTopics
                : ["Revision and practice"],

            activity: i === totalDays - 1
                ? "Final revision and practice"
                : "Study and practice",

            durationHours: data.dailyHours

        });

    }

    return {

        subject: data.subject,

        dailyHours: data.dailyHours,

        preparationLevel: data.preparationLevel,

        startDate: data.startDate,

        examDate: data.examDate,

        totalDays: totalDays,

        topics: data.topics,

        schedule: schedule

    };

}


// ========================================
// 7. DISPLAY STUDY PLAN
// ========================================

function displayStudyPlan(studyPlan) {

    const result = document.getElementById("plannerResult");

    if (!result) return;

    const escapeHTML = (value) => {

        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);

    };


    const timetableRows = studyPlan.schedule.map((day, index) => {

        const topics = Array.isArray(day.topics)
            ? day.topics.join(", ")
            : day.topics || "Revision and practice";

        const activity = day.activity || "Study and practice";

        const duration = day.durationHours ??
            day.hours ??
            studyPlan.dailyHours;

        return `
            <tr>

                <td class="timetable-day">
                    <strong>Day ${index + 1}</strong>
                    <span>${escapeHTML(day.date || "")}</span>
                </td>

                <td>${escapeHTML(topics)}</td>

                <td>${escapeHTML(activity)}</td>

                <td>${escapeHTML(duration)} hours</td>

            </tr>
        `;

    }).join("");


    result.innerHTML = `

        <div class="planner-schedule">

            <div class="planner-result-heading">
                <h3>Your Generated Timetable</h3>
                <p>Your personalized study schedule is ready.</p>
            </div>

            <div class="planner-summary">

                <div>
                    <span>Subject</span>
                    <strong>${escapeHTML(studyPlan.subject)}</strong>
                </div>

                <div>
                    <span>Daily Study Hours</span>
                    <strong>${escapeHTML(studyPlan.dailyHours)} Hours</strong>
                </div>

                <div>
                    <span>Preparation Level</span>
                    <strong>${escapeHTML(studyPlan.preparationLevel)}</strong>
                </div>

                <div>
                    <span>Total Days</span>
                    <strong>${escapeHTML(studyPlan.totalDays)}</strong>
                </div>

            </div>

            <div class="timetable-wrapper">

                <table class="study-timetable">

                    <thead>
                        <tr>
                            <th>Day / Date</th>
                            <th>Topics to Study</th>
                            <th>Activity</th>
                            <th>Duration</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${timetableRows}
                    </tbody>

                </table>

            </div>

        </div>

    `;

}


// ========================================
// 8. LOAD PREVIOUSLY SAVED PLAN
// ========================================

function loadSavedPlan() {

    const savedPlan = localStorage.getItem(
        "studyMateStudyPlan"
    );

    if (savedPlan) {

        try {

            const plan = JSON.parse(savedPlan);

            displayStudyPlan(plan);

        } catch (error) {

            console.error("Unable to load saved plan:", error);

        }

    }

}


// Initial loading

loadSavedPlan();