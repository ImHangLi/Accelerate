/**
 * API Configuration for Accelerate platform
 * Centralizes all API configurations in one place
 */

// Helper function to get environment variables with fallbacks
const getEnvVar = (key, fallback = "") => {
  return import.meta.env[key] || fallback
}

// Base URLs and endpoints
const API_BASE_URL = getEnvVar("VITE_API_URL", "http://localhost:3000")
const ASTRA_BASE_URL = getEnvVar(
  "VITE_ASTRA_API_BASE_URL",
  "https://api.langflow.astra.datastax.com"
)
const ASTRA_ENDPOINT = getEnvVar(
  "VITE_ASTRA_API_ENDPOINT",
  "/lf/1c2cba2a-255d-4ac8-b373-78187786ba0e/api/v1/run/885f5707-f7d5-47cf-9558-dc2cbb26accb"
)

// API Configuration
export const API_CONFIG = {
  // Backend API
  API_URL: API_BASE_URL,

  // Astra API Configuration
  ASTRA_API: {
    CLIENT_ID: getEnvVar("VITE_ASTRA_CLIENT_ID", "oKQXqOYIWYMZPDFeyIwghLFp"),
    API_KEY: getEnvVar(
      "VITE_ASTRA_API_KEY",
      "AeyzrYAeMxyM6yC5flKRDSZB5jXqZkobZ4lB+s6qa7nde,0aYhElj+I6IQpA7YlmhRduw.7l_HszW8.s4bEG04pFGdU7YY1yP3Za5zuMlyIK.b9_te1BW87zjXJwGZjS"
    ),
    TOKEN: getEnvVar(
      "VITE_ASTRA_TOKEN",
      "AstraCS:oKQXqOYIWYMZPDFeyIwghLFp:57457f6990feb753ef72e69caa021cc189b9b15cc23aa8f5ac5f89f558bac5f0"
    ),
    BASE_URL: ASTRA_BASE_URL,
    ENDPOINT: ASTRA_ENDPOINT,
    FULL_URL: `${ASTRA_BASE_URL}${ASTRA_ENDPOINT}`,
    PROXY_URL: `/astra-api${ASTRA_ENDPOINT}`,
  },
}

// Helper functions for API interactions
export const ApiHelpers = {
  /**
   * Creates the appropriate URL for Astra API calls, using the proxy in development
   * @param {boolean} useProxy - Whether to use the proxy URL (for browser environments)
   * @returns {string} The appropriate URL to use
   */
  getAstraApiUrl: (useProxy = true) => {
    // In browser environments, use the proxy to avoid CORS
    // In Node.js or other environments, use the direct URL
    const isNode = typeof window === "undefined"
    if (isNode || !useProxy) {
      return API_CONFIG.ASTRA_API.FULL_URL
    }
    return API_CONFIG.ASTRA_API.PROXY_URL
  },

  /**
   * Prepares the standard request body for Astra API calls
   * @param {string} inputValue - The user input to process
   * @returns {Object} The formatted request body
   */
  prepareAstraRequestBody: inputValue => {
    return {
      input_value: inputValue,
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "Agent-UptKh": {},
        "ChatInput-dciUl": {},
        "ChatOutput-7xdjV": {},
        "JSONCleaner-fSxD4": {},
      },
    }
  },

  /**
   * Prepares standard headers for Astra API calls
   * @returns {Object} The headers object
   */
  getAstraHeaders: () => {
    return {
      Authorization: `Bearer ${API_CONFIG.ASTRA_API.TOKEN}`,
      "Content-Type": "application/json",
    }
  },
}

export default API_CONFIG
