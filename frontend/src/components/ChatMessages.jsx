import React from 'react';

const ChatMessages = ({ messages, isLoading, agents }) => {
  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`message ${message.sender === "user" ? "user-message" : ""}`}
        >
          <div 
            className="message-avatar"
            style={{ 
              backgroundColor: message.sender === "user" 
                ? "#5865f2" 
                : agents.find(a => a.name === message.sender)?.color 
            }}
          >
            {message.sender === "user" ? "U" : message.sender[0]}
          </div>
          <div className="message-content">
            <div className="message-header">
              <span className="message-author">
                {message.sender === "user" ? "You" : message.sender}
              </span>
              <span className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-text">{message.text}</div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="message loading">
          <div className="message-avatar" style={{ backgroundColor: "#72767d" }}>
            AI
          </div>
          <div className="message-content">
            <div className="message-text">Thinking...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages; 