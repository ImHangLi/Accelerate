import React from 'react';

const ChatInput = ({ inputText, isLoading, onSubmit, onChange, placeholder }) => {
  return (
    <div className="chat-input">
      <form onSubmit={onSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={onChange}
            placeholder={placeholder}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={isLoading || !inputText.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput; 