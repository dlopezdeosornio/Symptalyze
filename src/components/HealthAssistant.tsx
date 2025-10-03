import React, { useState } from 'react';
import './HealthAssistant.css';

interface HealthAssistantProps {
  className?: string;
}

const HealthAssistant: React.FC<HealthAssistantProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`health-assistant ${className}`}>
      <div 
        className="health-assistant-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
      >
        <div className="assistant-icon">🤖</div>
        <div className="assistant-text">
          <h3>Health Assistant</h3>
          <p>Get exercise & diet recommendations</p>
        </div>
        <div className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>▼</div>
      </div>

      {isExpanded && (
        <div className="health-assistant-content">
          <div className="assistant-description">
            <p>
              Our AI Health Assistant can help you with personalized exercise and diet recommendations 
              based on your symptoms and health goals. Click the chat widget in the bottom-right corner 
              to get started!
            </p>
          </div>


          <div className="assistant-features">
            <h4>What our assistant can help with:</h4>
            <div className="features-grid">
              <div className="feature">
                <span className="feature-icon">🏃‍♀️</span>
                <span>Exercise recommendations for symptoms</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🥗</span>
                <span>Diet suggestions for health conditions</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Lifestyle tracking integration</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💡</span>
                <span>General wellness tips</span>
              </div>
            </div>
          </div>

          <div className="assistant-note">
            <p>
              <strong>Note:</strong> This assistant provides general health information. 
              Always consult with healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default HealthAssistant;
