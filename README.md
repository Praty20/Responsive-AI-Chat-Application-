Responsive AI Chat Application

Overview
This project is a Responsive AI Chat Application built using Vite + React + Tailwind CSS, integrated with the Gemini API. 
The app allows users to chat with an AI assistant, create multiple chat sessions, and manage settings (including API key input).

Features
💬 Real-time chat with Gemini API
🆕 Create and switch between multiple chat sessions
⚙️ Settings panel to input Gemini API key
📱 Fully responsive (works seamlessly on desktop and mobile)
💾 Local storage for chat history and API key persistence
🚀 Minimal setup — runs out of the box

Technologies Used
Frontend: React + Vite
Styling: Tailwind CSS
AI Integration: Google Gemini API (Generative Language)
Storage: localStorage for chat persistence

Installation & Setup
1. Clone the repository
   git clone https://github.com/<your-username>/Responsive-AI-Chat-Application-.git
   cd Responsive-AI-Chat-Application-

2. Install dependencies
   npm install

3. Setup environment variables
   Create a .env file in the root of your project and add:
   VITE_GEMINI_API_KEY=your_api_key_here

   Alternatively, you can paste your API key directly in the app's Settings panel (saved to localStorage).

   ⚠️ Do NOT commit your .env file to the repo.

4. Run the development server
   npm run dev
   Then open: http://localhost:5173

Folder Structure
ai-chat-app/
│
├── src/
│   ├── components/
│   │   ├── ChatWindow.jsx
│   │   ├── ChatList.jsx
│   │   ├── SettingsPanel.jsx
│   │   └── MessageInput.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── .env.example
├── package.json
├── tailwind.config.js
└── README.md

Design Decisions & Assumptions
- Chose Vite for faster builds and hot reloading.
- Used Tailwind CSS for quick and consistent responsive styling.
- Implemented localStorage to maintain user sessions between reloads.
- The Settings panel allows changing the API key dynamically without restarting.
- Minimal UI design to highlight functionality over visuals.

Thought Process
The main goal was to build a lightweight, responsive, and functional AI chat app with minimal dependencies. Key focus areas:
- Clean, modular React components
- API key configuration flexibility
- Responsive design using Tailwind utilities
- Local storage for persistence and session management
