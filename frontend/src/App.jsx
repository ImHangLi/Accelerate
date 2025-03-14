import { useState } from "react";
import axios from "axios";
import "./App.css";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const App = () => {
  const [message, setMessage] = useState("");

  const showWelcome = async () => {
    try {
      const response = await axios.get("/api");
      console.log(response.data);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={showWelcome}>Click me!</button>
      <h1>{message}</h1>
    </div>
  );
};

export default App;
