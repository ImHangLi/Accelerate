// Test script for CEO agent API
// Import the config helpers (adjust the path if needed for your environment)
import { API_CONFIG, ApiHelpers } from "./src/config.js"

const inputValue = "What makes a startup successful?"

console.log("Running CEO agent API test")
console.log(`Using token: ${API_CONFIG.ASTRA_API.TOKEN.substring(0, 10)}...`)

// Get the appropriate URL
const apiUrl = ApiHelpers.getAstraApiUrl()
console.log(`API URL: ${apiUrl}`)

// Make the API request
fetch(apiUrl, {
  method: "POST",
  headers: ApiHelpers.getAstraHeaders(),
  body: JSON.stringify(ApiHelpers.prepareAstraRequestBody(inputValue)),
})
  .then(res => {
    console.log("Response status:", res.status, res.statusText)
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`)
    }
    return res.json()
  })
  .then(data => {
    console.log("Full API Response:", JSON.stringify(data, null, 2))
    const messageText = data.outputs[0].outputs[0].results.message.text
    console.log("Raw Message Text:", messageText)

    try {
      const parsedMessage = JSON.parse(messageText)
      console.log("Parsed CEO Response:", parsedMessage.response)
    } catch (error) {
      console.error("Error parsing JSON:", error.message)
    }
  })
  .catch(error => console.error("Error:", error))
