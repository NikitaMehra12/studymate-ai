
function renderDashboard() {

    // Get saved information
    const tasks = StudyMateStorage.getTasks();
    const exams = StudyMateStorage.getExams();

    // Calculate task statistics
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed === true
    ).length;

    const pending = total - completed;

    // Calculate progress percentage
    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    // Update dashboard cards
    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("studyProgress").textContent =
        progress + "%";

    // Update progress circle
    document.getElementById("progressCircle").textContent =
        progress + "%";

    document.querySelector(".progress-circle").style.background =
        `conic-gradient(var(--primary) ${progress * 3.6}deg, var(--border) 0deg)`;

    // Display today's tasks
    const todayTasks = document.getElementById("todayTasks");

    const today = new Date();

    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

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

    // Display upcoming examinations
    const upcomingExams = document.getElementById("upcomingExams");

    const examList = exams
        .filter(exam => exam.date >= todayString)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);

    upcomingExams.replaceChildren();

    if (examList.length === 0) {

        upcomingExams.className = "empty-state";

        const message = document.createElement("p");
        message.textContent = "No upcoming examinations added.";

        upcomingExams.append(message);

    } else {

        upcomingExams.className = "exam-list";

        examList.forEach(exam => {

            const item = document.createElement("div");
            item.className = "dashboard-task";

            const subject = document.createElement("strong");
            subject.textContent = exam.subject;

            const date = document.createElement("small");
            date.textContent = new Date(
                exam.date + "T00:00:00"
            ).toLocaleDateString("en-IN");

            item.append(subject, date);
            upcomingExams.append(item);

        });
    }

}

// Make the function available to other modules
window.renderDashboard = renderDashboard;

// Display initial dashboard data
renderDashboard();