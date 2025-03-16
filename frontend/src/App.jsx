import { useState, useEffect } from "react"
import axios from "axios"
import "./styles/global.css"
import "./styles/layout.css"
import "./styles/sidebar.css"
import "./styles/input.css"
import "./styles/messages.css"
import "./styles/scrollbar.css"
import "./styles/agent.css"
import AgentList from "./components/AgentList"
import AgentDescription from "./components/AgentDescription"
import ChatMessages from "./components/ChatMessages"
import ChatInput from "./components/ChatInput"
import { API_CONFIG, ApiHelpers } from "./config"

axios.defaults.baseURL = API_CONFIG.API_URL

const AI_AGENTS = [
  {
    id: "ceo",
    name: "CEO",
    role: "Vision & Strategy",
    color: "#5865f2",
    description:
      "Evaluates the overall vision, market opportunity, and strategic direction of your startup idea.",
  },
  {
    id: "cto",
    name: "CTO",
    role: "Technical Feasibility",
    color: "#43b581",
    description:
      "Assesses technical implementation, scalability, and potential technical challenges.",
  },
  {
    id: "cmo",
    name: "CMO",
    role: "Marketing Strategy",
    color: "#faa61a",
    description:
      "Provides insights on market positioning, target audience, and marketing strategies.",
  },
  {
    id: "cfo",
    name: "CFO",
    role: "Financial Viability",
    color: "#f04747",
    description:
      "Analyzes financial projections, costs, and revenue potential.",
  },
  {
    id: "coo",
    name: "COO",
    role: "Operations & Scaling",
    color: "#9b84ee",
    description:
      "Evaluates operational requirements, scaling challenges, and resource planning.",
  },
]

function App() {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [selectedAgents, setSelectedAgents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [displayedAgent, setDisplayedAgent] = useState(null)

  // Update displayed agent when selected agents change
  useEffect(() => {
    // Get the last selected agent
    const lastSelectedAgent =
      selectedAgents.length > 0
        ? selectedAgents[selectedAgents.length - 1]
        : null
    setDisplayedAgent(lastSelectedAgent)
  }, [selectedAgents])

  useEffect(() => {
    // Add visible class to trigger transition effect
    const descriptionElement = document.querySelector(".agent-description")
    if (descriptionElement) {
      descriptionElement.classList.add("visible")
    }
  }, [displayedAgent])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText("")
    setIsLoading(true)
    setDisplayedAgent(null) // Clear agent description display

    try {
      // 检查是否提及了CEO
      const mentionsCEO = inputText.includes("@CEO")

      if (mentionsCEO) {
        // 添加一个小的延迟，确保UI更新
        await new Promise(resolve => setTimeout(resolve, 500))

        try {
          // 处理输入文本，移除@CEO标记
          const inputValue = inputText.replace("@CEO", "").trim()

          // 使用Astra API获取CEO响应
          try {
            console.log("Sending request to Astra API with:", {
              inputValue,
              token: API_CONFIG.ASTRA_API.TOKEN.substring(0, 10) + "...", // Log partial token for debugging
            })

            // Get the API URL from helpers
            const apiUrl = ApiHelpers.getAstraApiUrl()

            // Log the request details for debugging
            console.log("API Request:", {
              url: apiUrl,
              method: "POST",
              body: ApiHelpers.prepareAstraRequestBody(inputValue),
            })

            // Make the API request
            const fetchResponse = await fetch(apiUrl, {
              method: "POST",
              headers: ApiHelpers.getAstraHeaders(),
              body: JSON.stringify(
                ApiHelpers.prepareAstraRequestBody(inputValue)
              ),
            })

            // Standard fetch response handling
            try {
              const data = await fetchResponse.json()
              console.log("Full API Response:", JSON.stringify(data, null, 2))

              // Extract and parse the message text
              const messageText =
                data.outputs[0].outputs[0].results.message.text
              console.log("Raw Message Text:", messageText)

              try {
                // Parse the message JSON
                const parsedMessage = JSON.parse(messageText)
                console.log("Parsed CEO Response:", parsedMessage.response)

                // Add a delay
                await new Promise(resolve => setTimeout(resolve, 1000))

                // Add the response to messages
                const ceoResponseObj = {
                  id: Date.now(),
                  text: parsedMessage.response,
                  sender: "CEO",
                  timestamp: new Date().toISOString(),
                }

                setMessages(prev => [...prev, ceoResponseObj])
              } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError)

                // Use raw message if parsing fails
                const ceoResponseObj = {
                  id: Date.now(),
                  text:
                    messageText ||
                    "Sorry, I received a response but couldn't parse it properly.",
                  sender: "CEO",
                  timestamp: new Date().toISOString(),
                }

                setMessages(prev => [...prev, ceoResponseObj])
              }
            } catch (responseError) {
              console.error("Error handling response:", responseError)

              // Create a more specific error message based on the status code
              let errorMessage =
                "Sorry, there was an error processing your request."

              if (fetchResponse.status === 401) {
                errorMessage =
                  "Authentication failed. Please check your API token."
              } else if (fetchResponse.status === 403) {
                errorMessage =
                  "You don't have permission to access this resource."
              } else if (fetchResponse.status === 429) {
                errorMessage = "Too many requests. Please try again later."
              }

              const errorResponse = {
                id: Date.now(),
                text: errorMessage,
                sender: "system",
                timestamp: new Date().toISOString(),
              }

              setMessages(prev => [...prev, errorResponse])
            }
          } catch (apiError) {
            console.error("API Error:", apiError)
            const errorMessage = {
              id: Date.now(),
              text: `API Error: ${
                apiError.message || "Failed to get response from CEO"
              }`,
              sender: "system",
              timestamp: new Date().toISOString(),
            }
            setMessages(prev => [...prev, errorMessage])
          }
        } catch (outerError) {
          console.error("Outer error handling block:", outerError)
          const errorMessage = {
            id: Date.now(),
            text: `Error: ${outerError.message}`,
            sender: "system",
            timestamp: new Date().toISOString(),
          }
          setMessages(prev => [...prev, errorMessage])
        }
      } else {
        // 使用原来的后端API处理
        const response = await axios.post("/api/chat", {
          message: inputText,
          forceAllAgents: inputText.startsWith("@channel"),
          targetAgents: selectedAgents.map(agent => agent.id),
        })

        const aiResponses = response.data.responses.map((response, index) => ({
          id: Date.now() + index,
          text: response.message,
          sender: response.agent,
          timestamp: response.timestamp,
        }))

        setMessages(prev => [...prev, ...aiResponses])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = {
        id: Date.now(),
        text: "Sorry, there was an error processing your message. Please try again.",
        sender: "system",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAgentClick = agent => {
    // Toggle agent selection
    setSelectedAgents(prev => {
      const isSelected = prev.some(a => a.id === agent.id)
      if (isSelected) {
        // If deselected, remove the agent from the array
        return prev.filter(a => a.id !== agent.id)
      } else {
        // If selected, add to the end of the array
        return [...prev, agent]
      }
    })

    // Update input text with @mentions
    setInputText(prev => {
      const mentions = selectedAgents
        .filter(a => a.id !== agent.id)
        .map(a => `@${a.name}`)
        .join(" ")
      const newMention = `@${agent.name}`
      const textWithoutMentions = prev.replace(/@\w+/g, "").trim()
      return textWithoutMentions
        ? `${mentions} ${newMention} ${textWithoutMentions}`
        : `${mentions} ${newMention}`
    })
  }

  const handleChannelClick = () => {
    if (selectedAgents.length === AI_AGENTS.length) {
      // If all agents are selected, deselect all
      setSelectedAgents([])
      setInputText("")
    } else {
      // Select all agents
      setSelectedAgents(AI_AGENTS)
      setInputText("@channel")
    }
  }

  // Update input text when selected agents change
  useEffect(() => {
    setInputText(prev => {
      const mentions = selectedAgents.map(a => `@${a.name}`).join(" ")
      const textWithoutMentions = prev.replace(/@\w+/g, "").trim()
      return textWithoutMentions
        ? `${mentions} ${textWithoutMentions}`
        : mentions
    })
  }, [selectedAgents])

  const handleInputChange = e => {
    const newValue = e.target.value
    // If input is empty, keep placeholder visible
    if (!newValue.trim()) {
      setInputText("")
    } else {
      setInputText(newValue)
    }
  }

  const getInputPlaceholder = () => {
    if (selectedAgents.length === 0) {
      return "Select an AI agent to start chatting..."
    }
    if (selectedAgents.length === 1) {
      return `Chat with ${selectedAgents[0].name}...`
    }
    return `Chat with ${selectedAgents.map(a => a.name).join(", ")}...`
  }

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
          <div className="chat-subtitle">
            AI-powered startup idea feedback platform
          </div>
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
  )
}

export default App
