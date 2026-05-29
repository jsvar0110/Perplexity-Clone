# 🚀 Perplexity Clone

A full-stack AI-powered search and chat application inspired by Perplexity AI.

This project combines Large Language Models (LLMs), internet search, real-time communication, and persistent chat history to provide intelligent answers with up-to-date information.

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![LangChain](https://img.shields.io/badge/LangChain-AI-orange)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black)

---

## ✨ Features

### 🤖 AI-Powered Conversations
- Ask questions and receive intelligent responses.
- Powered by Mistral AI through LangChain.
- Supports conversational context.

### 🌐 Internet Search Integration
- Retrieves real-time information from the web.
- Uses Tavily Search API as a tool for the AI agent.
- Delivers more accurate and up-to-date responses.

### 🔐 Authentication
- Secure user registration and login.
- JWT-based authentication.
- Protected routes.

### 💬 Chat Management
- Create and manage multiple chats.
- Persistent chat history stored in MongoDB.
- Retrieve previous conversations anytime.

### ⚡ Real-Time Communication
- Socket.IO integration.
- Instant updates between client and server.

### 📝 Markdown Rendering
- AI responses are rendered beautifully using Markdown.
- Better readability for code blocks and formatted content.

---

# 🏗️ Tech Stack

## Frontend

- React 19
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- React Markdown

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO

## AI & Search

- LangChain
- Mistral AI
- Google Gemini (Configured)
- Tavily Search API

---

# 📂 Project Structure

```bash
Perplexity-Clone/
│
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── chat/
│   │   ├── components/
│   │   └── pages/
│
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/Perplexity-Clone.git
cd Perplexity-Clone
```

---

## Backend Setup

```bash
cd Backend

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

MISTRAL_API_KEY=your_mistral_api_key

GOOGLE_API_KEY=your_google_api_key

TAVILY_API_KEY=your_tavily_api_key
```

Run Backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd Frontend

npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Run Frontend:

```bash
npm run dev
```

---

# 🧠 How It Works

```text
User Question
      │
      ▼
Frontend (React)
      │
      ▼
Backend API
      │
      ▼
LangChain Agent
      │
 ┌────┴────┐
 ▼         ▼
Mistral   Tavily Search
  AI      (Internet)
 └────┬────┘
      ▼
Generated Answer
      ▼
MongoDB Storage
      ▼
Frontend Display
```

---

# 📸 Screenshots

Add screenshots here:

### Home Page

![Home]()

### Chat Interface

![Chat](https://ik.imagekit.io/cflaypsvj/cohort-insta-clone/Screenshot%202026-05-29%20194543.png)

### AI Response

![Response](https://ik.imagekit.io/cflaypsvj/cohort-insta-clone/Screenshot%202026-05-29%20164418.png)

---

# 🎯 Learning Outcomes

This project helped me learn:

- Full Stack Development
- REST APIs
- Authentication & Authorization
- State Management with Redux
- LangChain Agents
- Tool Calling
- AI Integration
- Real-Time Communication
- Modern React Development

---

# 🚀 Future Improvements

- PDF Chat (RAG)
- Multiple LLM Selection
- Chat Sharing

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

# 👨‍💻 Author

**Varad Naikwad**

If you liked this project, consider giving it a ⭐ on GitHub.
