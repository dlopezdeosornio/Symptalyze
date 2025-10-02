# Chatbot Question Integration

## Overview
The Health Assistant component now includes interactive question suggestions that automatically populate the chatbot when clicked.

## How It Works

### 1. **Question Click Handling**
When users click on any of the sample questions in the Health Assistant:
- The chatbot widget opens automatically
- The question is stored in localStorage as `pendingChatQuestion`
- A toast notification shows feedback to the user

### 2. **Auto-Population System**
The system attempts multiple methods to populate the question:

#### Method 1: Direct API Call
```javascript
window.chatbase('sendMessage', question);
```

#### Method 2: DOM Manipulation
- Searches for chat input fields using various selectors
- Populates the input field with the question
- Triggers form submission

#### Method 3: Clipboard Fallback
- If other methods fail, copies the question to clipboard
- Shows a toast notification with the copied text

### 3. **User Experience Features**

#### Toast Notifications
- Beautiful slide-in notifications from the top-right
- Auto-dismiss after 4 seconds
- Manual close button
- Responsive design for mobile devices

#### Sample Questions
- "What exercises help with fatigue?"
- "What foods should I eat for inflammation?"
- "How can exercise improve my sleep?"
- "What diet changes help with digestive issues?"
- "How do I track exercise with my symptoms?"

### 4. **Technical Implementation**

#### Frontend (HealthAssistant.tsx)
```typescript
const handleAskQuestion = (question: string) => {
  // Store question for auto-population
  localStorage.setItem('pendingChatQuestion', question);
  
  // Open chatbot
  window.chatbase('open');
  
  // Show user feedback
  showToastMessage(`Opening chat with: "${question}"`);
  
  // Attempt direct message sending
  setTimeout(() => {
    try {
      window.chatbase('sendMessage', question);
    } catch (e) {
      // Fallback to DOM manipulation
    }
  }, 1000);
};
```

#### Backend (index.html)
```javascript
// Enhanced chatbot integration for pre-filling questions
(function() {
  function handlePendingQuestion() {
    const pendingQuestion = localStorage.getItem('pendingChatQuestion');
    if (pendingQuestion) {
      // Find and populate chat input
      const chatInput = document.querySelector('[data-testid="chat-input"], .chat-input, input[placeholder*="message"]');
      if (chatInput) {
        chatInput.value = pendingQuestion;
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }
  
  // Check for pending questions when widget is ready
  setInterval(() => {
    if (window.chatbase && window.chatbase('getState') === 'initialized') {
      handlePendingQuestion();
    }
  }, 1000);
})();
```

### 5. **Fallback Mechanisms**

1. **Primary**: Direct API message sending
2. **Secondary**: DOM input field manipulation
3. **Tertiary**: Clipboard copy with user notification
4. **Final**: Toast notification with manual instructions

### 6. **Testing the Feature**

1. Open your Symptalyze app
2. Navigate to the Dashboard
3. Expand the Health Assistant section
4. Click on any sample question
5. Verify the chatbot opens
6. Check if the question is automatically populated

### 7. **Browser Compatibility**

- **Modern browsers**: Full functionality with clipboard API
- **Older browsers**: Graceful degradation with manual copy instructions
- **Mobile devices**: Touch-optimized toast notifications

### 8. **Troubleshooting**

#### Chatbot doesn't open
- Check browser console for errors
- Verify Chatbase.co script is loading
- Ensure chatbot ID is correct

#### Question not auto-populated
- Check localStorage for `pendingChatQuestion`
- Verify DOM selectors match your Chatbase widget
- Use browser dev tools to inspect chat input elements

#### Toast notifications not showing
- Check CSS is loading properly
- Verify React state management
- Check for JavaScript errors

## Future Enhancements

- [ ] Add more sample questions based on user feedback
- [ ] Implement question categories (exercise, diet, general)
- [ ] Add analytics to track most popular questions
- [ ] Support for custom user questions
- [ ] Integration with user's symptom history
