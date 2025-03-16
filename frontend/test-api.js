// Test script for CEO agent API
// Use environment variables instead of hardcoded tokens
// To run this script, ensure you have properly set up your environment variables
// For browser environments, use a config file that's in .gitignore

// In a real application, load this from a secure source
// IMPORTANT: Do not hardcode tokens in your code
const TOKEN = "YOUR_TOKEN_HERE" // Replace when testing locally, but never commit real tokens

const inputValue = "What makes a startup successful?"

console.log(
  "Running with placeholder token - replace with your token at runtime"
)

fetch(
  "https://api.langflow.astra.datastax.com/lf/1c2cba2a-255d-4ac8-b373-78187786ba0e/api/v1/run/885f5707-f7d5-47cf-9558-dc2cbb26accb?stream=false",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input_value: inputValue,
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "Agent-UptKh": {},
        "ChatInput-dciUl": {},
        "ChatOutput-7xdjV": {},
        "JSONCleaner-fSxD4": {},
      },
    }),
  }
)
  .then(res => res.json())
  .then(data => {
    console.log("Full API Response:", JSON.stringify(data, null, 2))
    const messageText = data.outputs[0].outputs[0].results.message.text
    console.log("Raw Message Text:", messageText)

    try {
      const parsedMessage = JSON.parse(messageText)
      console.log("Parsed CEO Response:", parsedMessage.response)
    } catch (e) {
      console.error("Error parsing JSON:", e)
    }
  })
  .catch(error => console.error("Error:", error))
