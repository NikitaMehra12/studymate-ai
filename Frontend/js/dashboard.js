// ========================================
// STUDYMATE AI - DASHBOARD
// ========================================

function getTodayDate() {
    const today = new Date();

    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");
}


// ========================================
// EXAMINATION MANAGEMENT
// ========================================

// Remove expired examinations automatically
function removeExpiredExams() {

    const today = getTodayDate();

    let exams = StudyMateStorage.getExams();

    exams = exams.filter(exam => exam.date >= today);

    // Assign IDs to older examination records
    exams = exams.map(exam => ({
        ...exam,
        id: exam.id || Date.now() + Math.random()
    }));

    StudyMateStorage.saveExams(exams);
}


// Create Add Exam popup
// Create Add Exam popup
function openExamPopup() {

    const overlay = document.createElement("div");
    overlay.className = "exam-overlay";

    const modal = document.createElement("div");
    modal.className = "exam-modal";

    modal.innerHTML = `
        <h3>Add Examination</h3>

        <form id="examForm">

            <label for="examSubject">Exam / Subject Name</label>

            <input
                type="text"
                id="examSubject"
                placeholder="e.g. Data Structures"
                required
                maxlength="100"
            >

            <label for="examDate">Examination Date</label>

            <input
                type="date"
                id="examDate"
                min="${getTodayDate()}"
                required
            >

            <div class="exam-modal-actions">

                <button type="button" id="cancelExam" class="exam-cancel-btn">
                    Cancel
                </button>

                <button type="submit" class="exam-save-btn">
                    Save Exam
                </button>

            </div>

        </form>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const examForm = modal.querySelector("#examForm");
    const examSubject = modal.querySelector("#examSubject");
    const examDate = modal.querySelector("#examDate");

    examSubject.focus();

    examForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const subject = examSubject.value.trim();
        const date = examDate.value;

        if (!subject || !date) return;

        if (date < getTodayDate()) {
            alert("Please select today or a future date.");
            return;
        }

        const exams = StudyMateStorage.getExams();

        exams.push({
            id: Date.now(),
            subject: subject,
            date: date
        });

        StudyMateStorage.saveExams(exams);

        overlay.remove();

        renderDashboard();

    });

    modal.querySelector("#cancelExam").addEventListener("click", () => {
        overlay.remove();
    });

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            overlay.remove();
        }
    });

}

// Delete examination
function deleteExam(examId) {

    const exams = StudyMateStorage.getExams();

    const updatedExams = exams.filter(
        exam => String(exam.id) !== String(examId)
    );

    StudyMateStorage.saveExams(updatedExams);

    renderDashboard();

}


// ========================================
// DASHBOARD RENDERING
// ========================================

function renderDashboard() {

    const tasks = StudyMateStorage.getTasks();

    // Automatically remove expired exams
    removeExpiredExams();

    const exams = StudyMateStorage.getExams();

    // Task statistics
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed === true
    ).length;

    const pending = total - completed;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("studyProgress").textContent =
        progress + "%";

    document.getElementById("progressCircle").textContent =
        progress + "%";

    document.querySelector(".progress-circle").style.background =
        `conic-gradient(var(--primary) ${progress * 3.6}deg, var(--border) 0deg)`;


    // ========================================
    // TODAY'S TASKS
    // ========================================

    const todayTasks = document.getElementById("todayTasks");

    const todayString = getTodayDate();

    const todaysList = tasks.filter(
        task => task.dueDate === todayString && !task.completed
    );

    todayTasks.replaceChildren();

    if (todaysList.length === 0) {

        const message = document.createElement("p");
        message.textContent = "No tasks scheduled for today.";

        todayTasks.className = "empty-state";
        todayTasks.append(message);

    } else {

        todayTasks.className = "task-list";

        todaysList.forEach(task => {

            const item = document.createElement("div");
            item.className = "dashboard-task";

            const title = document.createElement("strong");
            title.textContent = task.title;

            const subject = document.createElement("small");
            subject.textContent = task.subject || "General";

            item.append(title, subject);

            todayTasks.append(item);

        });

    }


    // ========================================
    // UPCOMING EXAMINATIONS
    // ========================================

    const upcomingExams = document.getElementById("upcomingExams");

    const examList = exams.sort(
        (a, b) => a.date.localeCompare(b.date)
    );

    upcomingExams.replaceChildren();

    if (examList.length === 0) {

        upcomingExams.className = "empty-state";

        const message = document.createElement("p");
        message.textContent = "No upcoming examinations added yet.";

        upcomingExams.append(message);

    } else {

        upcomingExams.className = "exam-list";

        examList.forEach(exam => {

            const item = document.createElement("div");
            item.className = "exam-item";

            const details = document.createElement("div");
            details.className = "exam-details";

            const subject = document.createElement("strong");
            subject.textContent = exam.subject;

            const date = document.createElement("small");

            date.textContent = new Date(
                exam.date + "T00:00:00"
            ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });

            details.append(subject, document.createElement("br"), date);

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";

            deleteButton.type = "button";

            deleteButton.className = "exam-delete-btn";
            
            deleteButton.addEventListener("click", () => {
                deleteExam(exam.id);
            });

            item.append(details, deleteButton);

            upcomingExams.append(item);

        });

    }

}


// ========================================
// INITIALIZE DASHBOARD
// ========================================

window.renderDashboard = renderDashboard;

window.deleteExam = deleteExam;

document.getElementById("addExamBtn").addEventListener("click", openExamPopup);

renderDashboard();