import { useEffect } from 'react';

interface ChatbotWidgetProps {
  entries: unknown[];
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = () => {
  useEffect(() => {
    const existingScript = document.getElementById('chatbase-script');
    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "chatbase-script";
    script.setAttribute("chatbotId", "W3Oc95mbxJejVV3i4xpmi");
    script.setAttribute("domain", "www.chatbase.co");
    
    // Ensure the script loads and initializes properly
    script.onload = () => {
      // Widget loaded successfully
    };
    
    script.onerror = () => {
      console.error('Failed to load Chatbase widget');
    };

    document.body.appendChild(script);

    return () => {
      // Don't remove the script on unmount to preserve widget state
      // The widget needs to maintain its state (open/closed) across component re-renders
    };
  }, []);

  return null;
};

export default ChatbotWidget;