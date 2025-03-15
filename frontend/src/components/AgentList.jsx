import React from 'react';

const AgentList = ({ agents, selectedAgents, onAgentClick, onChannelClick }) => {
  return (
    <div className="sidebar">
      <h2>AI Agents</h2>
      <div className="agent-list">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`agent-item ${selectedAgents.some(a => a.id === agent.id) ? "selected" : ""}`}
            onClick={() => onAgentClick(agent)}
          >
            <div className="agent-avatar" style={{ backgroundColor: agent.color }}>
              {agent.name[0]}
            </div>
            <div className="agent-info">
              <div className="agent-name">{agent.name}</div>
              <div className="agent-role">{agent.role}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <button 
          className="channel-button"
          onClick={onChannelClick}
        >
          @channel
        </button>
      </div>
    </div>
  );
};

export default AgentList; 