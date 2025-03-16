# Accelerate Frontend

This is the frontend application for Accelerate, an AI-powered startup idea feedback platform.

## Setup and Configuration

1. **Install Dependencies**

   ```
   npm install
   # or
   yarn install
   ```

2. **Environment Configuration**

   - Copy `.env.example` to `.env`
   - Update the environment variables with your API keys and configuration

   ```
   cp .env.example .env
   ```

3. **Start Development Server**
   ```
   npm run dev
   # or
   yarn dev
   ```

## API Configuration

The application uses a centralized configuration in `src/config.js` that provides:

- Environment variables with fallbacks
- Helper functions for API calls
- Proxy configuration for development

### Environment Variables

- `VITE_ASTRA_CLIENT_ID`: Client ID for Astra API
- `VITE_ASTRA_API_KEY`: API Key for Astra
- `VITE_ASTRA_TOKEN`: Authentication token for Astra API
- `VITE_ASTRA_API_BASE_URL`: Base URL for Astra API
- `VITE_ASTRA_API_ENDPOINT`: Endpoint path for Astra API
- `VITE_API_URL`: URL for backend API

## CORS Handling

The application uses Vite's built-in proxy to handle CORS issues during development:

- All requests to `/astra-api/*` are proxied to the Astra API server
- This configuration is in `vite.config.js`

## Testing the API

You can test the CEO agent API using the included test script:

```
node --experimental-json-modules test-api.js
```

For browser testing, simply open the application and use the `@CEO` mention in your messages.

## Development Notes

- The CEO agent is accessed through the Astra API
- Other agents are handled by the backend API
- Environment variables are required for all API functionality
