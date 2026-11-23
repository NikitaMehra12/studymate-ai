// StudyMate AI - Environment Configuration

const isLocalDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

window.StudyMateConfig = {
    useGemini: isLocalDevelopment
};

console.log("StudyMate Mode:", isLocalDevelopment ? "Local Developer Mode" : "Public Mode");