import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/input.css";
import "./styles/messages.css";
import "./styles/scrollbar.css";
import "./styles/agent.css";
import AgentList from "./components/AgentList";
import AgentDescription from "./components/AgentDescription";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const AI_AGENTS = [
  { 
    id: "ceo", 
    name: "CEO", 
    role: "Vision & Strategy", 
    color: "#5865f2",
    description: "Evaluates the overall vision, market opportunity, and strategic direction of your startup idea."
  },
  { 
    id: "cto", 
    name: "CTO", 
    role: "Technical Feasibility", 
    color: "#43b581",
    description: "Assesses technical implementation, scalability, and potential technical challenges."
  },
  { 
    id: "cmo", 
    name: "CMO", 
    role: "Marketing Strategy", 
    color: "#faa61a",
    description: "Provides insights on market positioning, target audience, and marketing strategies."
  },
  { 
    id: "cfo", 
    name: "CFO", 
    role: "Financial Viability", 
    color: "#f04747",
    description: "Analyzes financial projections, costs, and revenue potential."
  },
  { 
    id: "coo", 
    name: "COO", 
    role: "Operations & Scaling", 
    color: "#9b84ee",
    description: "Evaluates operational requirements, scaling challenges, and resource planning."
  }
];

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedAgent, setDisplayedAgent] = useState(null);

  // Update displayed agent when selected agents change
  useEffect(() => {
    // Get the last selected agent
    const lastSelectedAgent = selectedAgents.length > 0 
      ? selectedAgents[selectedAgents.length - 1]
      : null;
    setDisplayedAgent(lastSelectedAgent);
  }, [selectedAgents]);

  useEffect(() => {
    // Add visible class to trigger transition effect
    const descriptionElement = document.querySelector('.agent-description');
    if (descriptionElement) {
      descriptionElement.classList.add('visible');
    }
  }, [displayedAgent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setDisplayedAgent(null); // Clear agent description display

    try {
      const response = await axios.post("/api/chat", {
        message: inputText,
        forceAllAgents: inputText.startsWith("@channel"),
        targetAgents: selectedAgents.map(agent => agent.id)
      });

      const aiResponses = response.data.responses.map((response, index) => ({
        id: Date.now() + index,
        text: response.message,
        sender: response.agent,
        timestamp: response.timestamp
      }));

      setMessages(prev => [...prev, ...aiResponses]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now(),
        text: "Sorry, there was an error processing your message. Please try again.",
        sender: "system",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentClick = (agent) => {
    // Toggle agent selection
    setSelectedAgents(prev => {
      const isSelected = prev.some(a => a.id === agent.id);
      if (isSelected) {
        // If deselected, remove the agent from the array
        return prev.filter(a => a.id !== agent.id);
      } else {
        // If selected, add to the end of the array
        return [...prev, agent];
      }
    });

    // Update input text with @mentions
    setInputText(prev => {
      const mentions = selectedAgents
        .filter(a => a.id !== agent.id)
        .map(a => `@${a.name}`)
        .join(" ");
      const newMention = `@${agent.name}`;
      const textWithoutMentions = prev.replace(/@\w+/g, "").trim();
      return textWithoutMentions ? `${mentions} ${newMention} ${textWithoutMentions}` : `${mentions} ${newMention}`;
    });
  };

  const handleChannelClick = () => {
    if (selectedAgents.length === AI_AGENTS.length) {
      // If all agents are selected, deselect all
      setSelectedAgents([]);
      setInputText("");
    } else {
      // Select all agents
      setSelectedAgents(AI_AGENTS);
      setInputText("@channel");
    }
  };

  // Update input text when selected agents change
  useEffect(() => {
    setInputText(prev => {
      const mentions = selectedAgents.map(a => `@${a.name}`).join(" ");
      const textWithoutMentions = prev.replace(/@\w+/g, "").trim();
      return textWithoutMentions ? `${mentions} ${textWithoutMentions}` : mentions;
    });
  }, [selectedAgents]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    // If input is empty, keep placeholder visible
    if (!newValue.trim()) {
      setInputText("");
    } else {
      setInputText(newValue);
    }
  };

  const formatInputText = (text) => {
    // Convert @mentions to styled spans
    return text.split(/(@\w+)/g).map((part, index) => {
      if (part.startsWith('@')) {
        return `<span class="mention">${part}</span>`;
      }
      return part;
    }).join('');
  };

  const getInputPlaceholder = () => {
    if (selectedAgents.length === 0) {
      return "Select an AI agent to start chatting...";
    }
    if (selectedAgents.length === 1) {
      return `Chat with ${selectedAgents[0].name}...`;
    }
    return `Chat with ${selectedAgents.map(a => a.name).join(", ")}...`;
  };

  return (
    <div className="app-container">
      <AgentList 
        agents={AI_AGENTS}
        selectedAgents={selectedAgents}
        onAgentClick={handleAgentClick}
        onChannelClick={handleChannelClick}
      />
      
      <div className="main-content">
        <div className="chat-header">
          <h1>Accelerate</h1>
          <div className="chat-subtitle">AI-powered startup idea feedback platform</div>
        </div>

        {displayedAgent && (
          <div className="agent-description-container">
            <AgentDescription agent={displayedAgent} />
          </div>
        )}

        <ChatMessages 
          messages={messages}
          isLoading={isLoading}
          agents={AI_AGENTS}
        />

        <ChatInput
          inputText={inputText}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          placeholder={getInputPlaceholder()}
        />
      </div>
    </div>
  );
}

export default App;
