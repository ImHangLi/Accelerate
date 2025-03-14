# Accelerate

> AI-powered startup idea feedback platform

Accelerate is a text-based group chat environment where users interact with a panel of AI agents (CEO, CTO, CMO, CFO, COO) that provide expert feedback on startup ideas.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📋 Project Overview

Accelerate allows users to submit startup ideas and receive sequential responses from AI agents based on each agent's expertise. The platform features:

- **Text-based Interface**: Simple, clean UI for quick idea submission
- **AI Agent Panel**: Feedback from multiple perspectives (CEO, CTO, CMO, CFO, COO)
- **Special Commands**:
  - `@channel` - Forces all agents to respond
  - `@[agent]` - Directs the message to a specific agent (e.g., @CEO)
- **Context-aware Responses**: Agents maintain chat memory for evolving feedback

## 🏗️ Tech Stack

### Frontend

- Vite with React
- CSS (Neumorphism design)
- React Context API for state management

### Backend

- Node.js
- Express.js
- AI API Integration (Google Gemini free tier)

## 📁 Project Structure

```
AccelerateChat/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx     # Displays the chat conversation
│   │   │   ├── Message.jsx        # Renders individual messages
│   │   │   └── CommandButton.jsx  # Button to trigger the @channel command
│   │   ├── context/
│   │   │   └── ChatContext.jsx    # React Context for managing chat state
│   │   ├── styles/
│   │   └── main.jsx               # React entry point
│   └── index.html                 # Main HTML file
└── backend/
    ├── server.js                  # Main backend server entry point
    ├── routes/
    │   └── chat.js                # API route definitions
    ├── controllers/
    │   └── chatController.js      # Chat processing logic
    ├── services/
    │   └── aiService.js           # AI API integration
    └── utils/
        └── promptEngine.js        # Prompt building and agent logic
```

## 🔌 API Endpoints

### Chat Endpoint

```
POST /api/chat
```

Submit a chat message and receive AI agent responses.

**Request Body:**

```json
{
  "message": "I'm planning a startup that leverages AI to streamline supply chain management.",
  "forceAllAgents": false
}
```

**Response:**

```json
{
  "responses": [
    {
      "agent": "CEO",
      "message": "Your idea is visionary; focus on long-term scalability and strategic partnerships.",
      "timestamp": "2025-03-14T15:00:02Z"
    },
    {
      "agent": "CTO",
      "message": "Technically, the solution is feasible using a serverless architecture.",
      "timestamp": "2025-03-14T15:00:03Z"
    }
  ],
  "timestamp": "2025-03-14T15:00:05Z"
}
```

## 🧠 AI Agent Roles

- **CEO**: Overall vision, business strategy, and market positioning
- **CTO**: Technical feasibility, architecture, and implementation challenges
- **CMO**: Marketing strategy, target audience, and go-to-market approach
- **CFO**: Financial viability, funding requirements, and revenue models
- **COO**: Operational considerations, scaling challenges, and resource needs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

---
