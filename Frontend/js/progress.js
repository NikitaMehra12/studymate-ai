// ========================================
// STUDYMATE AI - PROGRESS TRACKER
// ========================================

function renderProgress() {

    const tasks = StudyMateStorage.getTasks();

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        task => task.completed
    ).length;

    const pendingTasks = totalTasks - completedTasks;

    const overallProgress = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    // Update overall statistics

    document.getElementById("progressTotalTasks").textContent =
        totalTasks;

    document.getElementById("progressCompletedTasks").textContent =
        completedTasks;

    document.getElementById("progressPendingTasks").textContent =
        pendingTasks;

    document.getElementById("overallProgress").textContent =
        overallProgress + "%";


    // Calculate subject-wise progress

    const subjectContainer =
        document.getElementById("subjectProgress");

    const subjects = {};

    tasks.forEach(task => {

        const subject = task.subject || "Other";

        if (!subjects[subject]) {
            subjects[subject] = {
                total: 0,
                completed: 0
            };
        }

        subjects[subject].total++;

        if (task.completed) {
            subjects[subject].completed++;
        }

    });


    if (Object.keys(subjects).length === 0) {

        subjectContainer.innerHTML = `
            <p class="subtitle">
                No tasks available yet. Add tasks to see your progress.
            </p>
        `;

    } else {

        subjectContainer.innerHTML = Object.entries(subjects)
            .map(([subject, data]) => {

                const percentage = Math.round(
                    (data.completed / data.total) * 100
                );

                return `
                    <div class="subject-progress-item">

                        <div class="subject-progress-heading">
                            <strong>${subject}</strong>
                            <span>${percentage}%</span>
                        </div>

                        <div class="subject-progress-bar">
                            <div
                                class="subject-progress-fill"
                                style="width: ${percentage}%">
                            </div>
                        </div>

                        <small>
                            ${data.completed} of ${data.total} tasks completed
                        </small>

                    </div>
                `;

            }).join("");

    }
     // Render weekly productivity chart
    renderWeeklyChart(tasks);

}


// Make function globally accessible

window.renderProgress = renderProgress;


// Initial rendering

renderProgress();

// ========================================
// WEEKLY PRODUCTIVITY CHART
// ========================================

function renderWeeklyChart(tasks) {

    const canvas = document.getElementById("weeklyProgressChart");

    if (!canvas || typeof Chart === "undefined") {
        console.error("Chart.js or chart canvas not found.");
        return;
    }

    const labels = [];
    const completionCounts = [];

    // Get the last seven days
    for (let i = 6; i >= 0; i--) {

        const date = new Date();
        date.setDate(date.getDate() - i);

        const dateString = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");

        labels.push(
            date.toLocaleDateString("en-US", {
                weekday: "short"
            })
        );

        const completedCount = tasks.filter(task =>
            task.completed && task.completedAt === dateString
        ).length;

        completionCounts.push(completedCount);
    }

    // Destroy previous chart before creating a new one
    if (
        window.weeklyProgressChart &&
        typeof window.weeklyProgressChart.destroy === "function"
    ) {
        window.weeklyProgressChart.destroy();
    }

    // Create bar chart
    window.weeklyProgressChart = new Chart(canvas, {

        type: "bar",

        data: {
            labels: labels,

            datasets: [{
                label: "Tasks Completed",
                data: completionCounts,
                backgroundColor: "#8B7CF6",
                borderRadius: 8,
                barThickness: 35
            }]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {

                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        stepSize: 1
                    }
                }

            }

        }

    });

}