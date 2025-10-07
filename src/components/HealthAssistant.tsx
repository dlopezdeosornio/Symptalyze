import React, { useState } from 'react';
import './HealthAssistant.css';

interface HealthAssistantProps {
  className?: string;
}

const HealthAssistant: React.FC<HealthAssistantProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [, setCopiedQuestion] = useState('');

  // Generate sample questions
  const getSampleQuestions = () => {
    return [
      "What exercises help with fatigue?",
      "What foods should I eat for inflammation?",
      "How can exercise improve my sleep?",
      "What diet changes help with digestive issues?",
      "How do I track exercise with my symptoms?",
      "What are the best exercises for stress relief?"
    ];
  };

  const handleAskQuestion = async (question: string) => {
    try {
      // Copy question to clipboard
      await navigator.clipboard.writeText(question);
      
      // Show notification
      setCopiedQuestion(question);
      setShowCopyNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowCopyNotification(false);
        setCopiedQuestion('');
      }, 3000);
      
      // Open chatbot
      if ((window as unknown as { chatbase?: (action: string) => void }).chatbase) {
        (window as unknown as { chatbase: (action: string) => void }).chatbase('open');
      }
    } catch (err) {
      console.error('Failed to copy question to clipboard:', err);
      // Fallback: still open the chatbot even if copy fails
      if ((window as unknown as { chatbase?: (action: string) => void }).chatbase) {
        (window as unknown as { chatbase: (action: string) => void }).chatbase('open');
      }
    }
  };

  return (
    <div className={`health-assistant ${className}`}>
      {/* Copy Notification */}
      {showCopyNotification && (
        <div className="copy-notification">
          <div className="copy-notification-content">
            <div className="copy-icon">📋</div>
            <div className="copy-message">
              <strong>Question copied!</strong>
              <p>Paste it in the chat to ask your question.</p>
            </div>
            <button 
              className="copy-close"
              onClick={() => {
                setShowCopyNotification(false);
                setCopiedQuestion('');
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

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

          <div className="sample-questions">
            <h4>Try asking (click to copy & open chat):</h4>
            <div className="questions-grid">
              {getSampleQuestions().map((question, index) => (
                <button
                  key={index}
                  className="question-button"
                  onClick={() => handleAskQuestion(question)}
                  title="Click to copy this question to clipboard and open chat"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-info">
            <h4>💬 Health Chat Available</h4>
            <p>
              Click the chat button in the bottom-right corner to get health advice and recommendations. 
              You can ask about exercises, diet, and general wellness tips.
            </p>
            <p>
              <strong>💡 Tip:</strong> Click any question above to copy it to your clipboard, then paste it into the chat!
            </p>
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
