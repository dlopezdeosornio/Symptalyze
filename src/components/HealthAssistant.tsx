import React, { useState } from 'react';
import './HealthAssistant.css';

interface HealthAssistantProps {
  className?: string;
}

const HealthAssistant: React.FC<HealthAssistantProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sampleQuestions = [
    "What exercises help with fatigue?",
    "What foods should I eat for inflammation?",
    "How can exercise improve my sleep?",
    "What diet changes help with digestive issues?",
    "How do I track exercise with my symptoms?"
  ];

  const handleAskQuestion = (question: string) => {
    // This would trigger the chatbot to open with the specific question
    if (window.chatbase) {
      window.chatbase('open');
      // Note: You might need to implement a way to pre-fill the question
      // depending on your Chatbase.co setup
    }
  };

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

          <div className="sample-questions">
            <h4>Try asking:</h4>
            <ul>
              {sampleQuestions.map((question, index) => (
                <li key={index}>
                  <button
                    className="question-button"
                    onClick={() => handleAskQuestion(question)}
                  >
                    "{question}"
                  </button>
                </li>
              ))}
            </ul>
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
