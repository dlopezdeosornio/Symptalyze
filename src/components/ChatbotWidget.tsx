import { useEffect } from 'react';

interface ChatbotWidgetProps {
  entries: any[];
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = () => {
  useEffect(() => {
    // Check if script already exists to prevent duplicates
    const existingScript = document.getElementById('chatbase-script');
    if (existingScript) {
      console.log('Chatbase script already exists');
      return;
    }

    // Load Chatbase script exactly as it was originally
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "chatbase-script";
    script.setAttribute("chatbotId", "W3Oc95mbxJejVV3i4xpmi");
    script.setAttribute("domain", "www.chatbase.co");
    
    script.onload = () => {
      console.log('Chatbase script loaded successfully');
    };
    
    script.onerror = () => {
      console.error('Failed to load Chatbase script');
    };
    
    document.body.appendChild(script);
    console.log('Chatbase script added to page');

    // Don't remove script on cleanup to preserve widget functionality
    return () => {
      console.log('ChatbotWidget cleanup - preserving script');
    };
  }, []);

  return null;
};

export default ChatbotWidget;