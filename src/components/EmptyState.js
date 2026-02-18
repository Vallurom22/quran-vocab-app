import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  icon = '🔍', 
  title = 'No results found', 
  description = 'Try adjusting your search or filters',
  action 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {action && (
        <button className="empty-action btn btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
