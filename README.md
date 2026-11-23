# StudyMate AI 📚

### An AI-Powered Student Study Planner

StudyMate AI is a web-based study planning application designed to help students organize their academic tasks, create structured study schedules, and track their learning progress.

It combines a rule-based study assistant with an AI-powered integration for local development, making study planning more organized and accessible.

 ## 🌐 Live Demo

🚀 **[Click here to explore StudyMate AI](https://studymate-ai-delta-gold.vercel.app/)**

Explore the dashboard, manage study tasks, generate study timetables, and track your productivity directly in your browser.

Try the application directly in your browser!

## ✨ Features

- **Dashboard:** View an overview of tasks, completed activities, pending tasks, and study progress.
- **Task Management:** Add, edit, delete, complete, and filter study tasks.
- **AI Study Planner:** Generate structured study timetables based on subjects, available study hours, exam dates, difficulty levels, and topics.
- **Study Assistant:** Get responses to study-related questions through a rule-based assistant.
- **Gemini Integration:** Experiment with Gemini API-powered responses in local development mode.
- **Progress Tracker:** Monitor task completion, subject-wise progress, and weekly productivity through charts.
- **Data Persistence:** Save tasks and study plans using browser LocalStorage.
- **Responsive Interface:** A clean interface with dark and light theme support.

## 🛠️ Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript
- Chart.js

**Backend**
- Node.js
- Express.js
- Google Gemini API
- dotenv
- CORS

**Development Tools**
- Visual Studio Code
- Git & GitHub
- Vercel

## 🤖 AI Integration

StudyMate AI uses two modes:

**1. Local Developer Mode**
- Integrates with the Google Gemini API.
- Supports AI-powered chatbot responses and study plan generation.
- Uses a local Node.js backend to handle API requests.
- Automatically falls back to rule-based responses when the API is unavailable.

**2. Public Demo Mode**
- Uses a rule-based study assistant.
- Generates study timetables without requiring an API key.
- Does not make Gemini API requests.

The Gemini API key is stored in a local `.env` file and is never exposed in the frontend.

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Git
- A code editor such as VS Code

### 1. Clone the repository

```bash
git clone https://github.com/NikitaMehra12/StudyMate-AI.git
```

### 2. Open the project

```bash
cd StudyMate-AI
```

### 3. Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the Backend folder:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never upload your actual API key to GitHub.

### 4. Start the backend

```bash
node server.js
```

The backend runs locally at:

```text
http://localhost:3000
```

### 5. Run the frontend

Open the `Frontend` folder using VS Code and launch it with the Live Server extension.

The application will run in your browser.

For Gemini integration, keep the local backend running. Without it, the application uses its rule-based fallback.

## 📂 Project Structure

```text
StudyMate-AI/
│
├── Backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── Frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── app.js
│       ├── assistant.js
│       ├── chart.js
│       ├── config.js
│       ├── dashboard.js
│       ├── planner.js
│       ├── progress.js
│       ├── storage.js
│       └── tasks.js
│
├── .gitignore
└── README.md
```

## ⚠️ Important Notes

- Tasks and study plans are stored in browser LocalStorage.
- Data is specific to the browser and device being used.
- There is currently no user authentication or cloud synchronization.
- The deployed public version uses rule-based functionality.
- Gemini API integration requires a locally configured backend and API key.

## 🔮 Future Improvements

- User authentication and personalized accounts.
- Cloud-based data storage and synchronization.
- More advanced AI-based study recommendations.
- Calendar integration and study reminders.
- Improved analytics and productivity insights.

## 👩‍💻 Author

**Nikita Mehra**

B.Tech CSE – AI & ML

[GitHub Profile](https://github.com/NikitaMehra12)

---

⭐ If you find this project interesting, consider giving it a star!