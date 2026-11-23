
const StudyMateStorage = {

    // Get saved data
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (error) {
            console.error("Unable to read saved data:", error);
            return [];
        }
    },

    // Save data
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Get all tasks
    getTasks() {
        return this.get("studyMateTasks");
    },

    // Save tasks
    saveTasks(tasks) {
        this.save("studyMateTasks", tasks);
    },

    // Get all examinations
    getExams() {
        return this.get("studyMateExams");
    },

    // Save examinations
    saveExams(exams) {
        this.save("studyMateExams", exams);
    }

};

// Make storage available to other JavaScript files
window.StudyMateStorage = StudyMateStorage;

