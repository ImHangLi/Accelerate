import React from 'react';

const AgentDescription = ({ agent }) => {
  if (!agent) return null;

  return (
    <div className="agent-description">
      <div className="description-header">
        <div className="agent-avatar" style={{ backgroundColor: agent.color }}>
          {agent.name[0]}
        </div>
        <div>
          <h3>{agent.name}</h3>
          <div className="agent-role">{agent.role}</div>
        </div>
      </div>
      <p>{agent.description}</p>
    </div>
  );
};

export default AgentDescription; 