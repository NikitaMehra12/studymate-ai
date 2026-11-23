// ===================================
// 1. TASK MANAGER VARIABLES
// ===================================

const taskForm = document.getElementById("taskForm");

const taskList = document.getElementById("taskList");

const taskFilter = document.getElementById("taskFilter");

const formHeading = document.getElementById("formHeading");

const submitTask = document.getElementById("submitTask");

const cancelEdit = document.getElementById("cancelEdit");

let editingTaskId = null;


// ===================================
// 2. DISPLAY TASKS
// ===================================

function renderTasks() {

    const tasks = StudyMateStorage.getTasks();

    const filter = taskFilter.value;

    taskList.replaceChildren();

    let filteredTasks = tasks;

    if (filter === "pending") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );

    }

    else if (filter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );

    }

    if (filteredTasks.length === 0) {

        const empty = document.createElement("div");

        empty.className = "empty-state";

        const message = document.createElement("p");

        message.textContent = "No tasks found.";

        empty.append(message);

        taskList.append(empty);

        return;
    }

    filteredTasks.forEach(task => {

        const card = document.createElement("div");

        card.className = "task-item";

        if (task.completed) {
            card.classList.add("completed");
        }

        // Task information

        const info = document.createElement("div");

        info.className = "task-info";

        const title = document.createElement("h4");

        title.textContent = task.title;

        const subject = document.createElement("p");

        subject.textContent = "Subject: " + task.subject;

        const dueDate = document.createElement("p");

        dueDate.textContent =
            "Due Date: " +
            new Date(task.dueDate + "T00:00:00")
                .toLocaleDateString("en-IN");

        const priority = document.createElement("span");

        priority.className =
            "task-priority priority-" +
            task.priority.toLowerCase();

        priority.textContent = task.priority + " Priority";

        info.append(title, subject, dueDate, priority);

        // Completion status

        if (task.completed) {

            const status = document.createElement("p");

            status.className = "task-status";

            status.textContent = "✓ Completed";

            info.append(status);
        }

        // Action buttons

        const actions = document.createElement("div");

        actions.className = "task-actions";

        const completeButton = document.createElement("button");

        completeButton.textContent =
            task.completed ? "Undo" : "Complete";

        completeButton.dataset.action = "toggle";

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.dataset.action = "edit";

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.dataset.action = "delete";

        actions.append(
            completeButton,
            editButton,
            deleteButton
        );

        card.append(info, actions);

        // Store task ID on the card

        card.dataset.id = task.id;

        taskList.append(card);

    });

}


// ===================================
// 3. ADD NEW TASK
// ===================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();

    const subject = document.getElementById("taskSubject").value.trim();

    const dueDate = document.getElementById("taskDueDate").value;

    const priority = document.getElementById("taskPriority").value;

    if (!title || !subject || !dueDate) {

        alert("Please fill all required fields.");

        return;
    }

    const tasks = StudyMateStorage.getTasks();

    if (editingTaskId !== null) {

        // Update existing task

        const updatedTasks = tasks.map(task => {

            if (task.id === editingTaskId) {

                return {
                    ...task,
                    title,
                    subject,
                    dueDate,
                    priority
                };

            }

            return task;

        });

        StudyMateStorage.saveTasks(updatedTasks);

        alert("Task updated successfully!");

    }

    else {

        // Create new task

        const newTask = {

            id: Date.now().toString(),

            title: title,

            subject: subject,

            dueDate: dueDate,

            priority: priority,

            completed: false

        };

        tasks.push(newTask);

        StudyMateStorage.saveTasks(tasks);

        alert("Task added successfully!");

    }

    taskForm.reset();

    resetEditMode();

    refreshTaskData();

});


// ===================================
// 4. EDIT TASK
// ===================================

function editTask(id) {

    const tasks = StudyMateStorage.getTasks();

    const task = tasks.find(
        item => item.id === id
    );

    if (!task) return;

    document.getElementById("taskTitle").value = task.title;

    document.getElementById("taskSubject").value = task.subject;

    document.getElementById("taskDueDate").value = task.dueDate;

    document.getElementById("taskPriority").value = task.priority;

    editingTaskId = id;

    formHeading.textContent = "Edit Task";

    submitTask.textContent = "Update Task";

    cancelEdit.hidden = false;

    taskForm.scrollIntoView({
        behavior: "smooth"
    });

}


// ===================================
// 5. DELETE TASK
// ===================================

function deleteTask(id) {

    const confirmation = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmation) return;

    const tasks = StudyMateStorage.getTasks();

    const updatedTasks = tasks.filter(
        task => task.id !== id
    );

    StudyMateStorage.saveTasks(updatedTasks);

    refreshTaskData();

}


// ===================================
// 6. MARK TASK COMPLETED
// ===================================

function toggleTask(id) {

    const tasks = StudyMateStorage.getTasks();

    const updatedTasks = tasks.map(task => {

        if (task.id === id) {

            const isCompleted = !task.completed;

            const today = new Date();
            const completionDate = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, "0"),
                String(today.getDate()).padStart(2, "0")
            ].join("-");

            return {
                ...task,
                completed: isCompleted,
                completedAt: isCompleted ? completionDate : null
            };

        }

        return task;

    });

    StudyMateStorage.saveTasks(updatedTasks);

    refreshTaskData();

}


// ===================================
// 7. HANDLE TASK BUTTONS
// ===================================

taskList.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const card = button.closest(".task-item");

    if (!card) return;

    const id = card.dataset.id;

    const action = button.dataset.action;

    if (action === "edit") {

        editTask(id);

    }

    else if (action === "delete") {

        deleteTask(id);

    }

    else if (action === "toggle") {

        toggleTask(id);

    }

});


// ===================================
// 8. TASK FILTER
// ===================================

taskFilter.addEventListener("change", renderTasks);


// ===================================
// 9. CANCEL EDIT
// ===================================

function resetEditMode() {

    editingTaskId = null;

    formHeading.textContent = "Add New Task";

    submitTask.textContent = "+ Add Task";

    cancelEdit.hidden = true;

}

cancelEdit.addEventListener("click", function() {

    taskForm.reset();

    resetEditMode();

});


// ===================================
// 10. REFRESH ALL TASK DATA
// ===================================

function refreshTaskData() {

    renderTasks();

    renderDashboard();

}

// Assign IDs and default priorities to older tasks
const existingTasks = StudyMateStorage.getTasks();

let tasksUpdated = false;

existingTasks.forEach(task => {

    if (!task.id) {
        task.id = Date.now().toString() +
            Math.random().toString(36).slice(2, 7);

        tasksUpdated = true;
    }

    if (!task.priority) {
        task.priority = "Medium";
        tasksUpdated = true;
    }

});

if (tasksUpdated) {
    StudyMateStorage.saveTasks(existingTasks);
}


// Initial rendering

renderTasks();

window.renderTasks = renderTasks;