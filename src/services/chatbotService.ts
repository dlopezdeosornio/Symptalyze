// Chatbot service for managing Chatbase.co integration
const CHATBASE_API_KEY = 'cf1d7pm8o40wbzjfyv6bpv5t2ogozx38';
const CHATBASE_API_URL = 'https://www.chatbase.co/api/v1';

export interface ChatbotResponse {
  chatbotId: string;
}

export interface CreateChatbotRequest {
  chatbotName: string;
  sourceText: string;
}

export class ChatbotService {
  /**
   * Creates a new chatbot using the Chatbase.co API
   */
  static async createChatbot(request: CreateChatbotRequest): Promise<ChatbotResponse> {
    try {
      const response = await fetch(`${CHATBASE_API_URL}/create-chatbot`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CHATBASE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to create chatbot: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating chatbot:', error);
      throw error;
    }
  }

  /**
   * Creates the Symptalyze health assistant chatbot
   */
  static async createSymptalyzeChatbot(): Promise<ChatbotResponse> {
    const healthContent = `
# Symptalyze Health Assistant

## About Symptalyze
Symptalyze is a comprehensive symptom tracking and health monitoring application that helps users track their symptoms, medications, and health patterns over time.

## Exercise Recommendations

### General Exercise Guidelines
- Aim for at least 150 minutes of moderate-intensity aerobic exercise per week
- Include strength training exercises 2-3 times per week
- Incorporate flexibility and balance exercises, especially for older adults
- Listen to your body and adjust intensity based on how you feel

### Exercise for Common Symptoms
**Fatigue**: Light to moderate exercise like walking, yoga, or swimming can actually help boost energy levels
**Pain**: Low-impact exercises like water aerobics, cycling, or gentle stretching
**Anxiety/Stress**: Cardiovascular exercise, yoga, tai chi, or mindful walking
**Depression**: Regular aerobic exercise has been shown to improve mood and mental health
**Sleep Issues**: Morning exercise can help regulate sleep cycles, avoid intense exercise close to bedtime

### Exercise Modifications
- Start slowly and gradually increase intensity
- Focus on consistency rather than intensity
- Modify exercises based on current symptoms
- Consider working with a physical therapist for specific conditions

## Diet and Nutrition Recommendations

### General Nutrition Guidelines
- Eat a variety of colorful fruits and vegetables daily
- Include whole grains, lean proteins, and healthy fats
- Stay hydrated with adequate water intake
- Limit processed foods, added sugars, and excessive sodium

### Dietary Considerations for Common Symptoms
**Digestive Issues**: 
- Eat smaller, more frequent meals
- Include fiber-rich foods gradually
- Consider probiotics and fermented foods
- Avoid trigger foods that worsen symptoms

**Inflammation**: 
- Anti-inflammatory foods: fatty fish, berries, leafy greens, nuts, olive oil
- Limit processed foods, refined sugars, and trans fats
- Consider turmeric, ginger, and green tea

**Energy Levels**: 
- Balance complex carbohydrates with protein
- Eat regular meals and snacks to maintain blood sugar
- Include iron-rich foods if experiencing fatigue
- Consider B-vitamin rich foods

**Mood and Mental Health**: 
- Omega-3 fatty acids from fish, flaxseeds, walnuts
- Complex carbohydrates for serotonin production
- Magnesium-rich foods like dark leafy greens, nuts, seeds
- Limit caffeine and alcohol

### Hydration Guidelines
- Drink at least 8 glasses of water daily
- Increase intake during hot weather or exercise
- Monitor urine color as a hydration indicator
- Consider electrolyte replacement during illness

### Special Dietary Considerations
- Work with healthcare providers for medical conditions requiring specific diets
- Consider food allergies and intolerances
- Track how different foods affect your symptoms
- Maintain a food diary alongside symptom tracking

## Integration with Symptalyze
- Track how exercise affects your symptoms over time
- Monitor energy levels before and after meals
- Record sleep quality in relation to exercise timing
- Note any food triggers that worsen symptoms
- Use the app's charts to identify patterns between lifestyle and symptoms

## Important Disclaimers
- Always consult with healthcare professionals before making significant changes to exercise or diet
- These are general recommendations and should be personalized based on individual health conditions
- If you experience new or worsening symptoms, seek medical attention
- The information provided is for educational purposes and not a substitute for professional medical advice

## How to Use This Assistant
You can ask me questions about:
- Exercise recommendations for specific symptoms
- Dietary suggestions for health conditions
- General wellness and lifestyle tips
- How to integrate healthy habits with symptom tracking
- Modifications for exercise or diet based on how you're feeling

Remember to use Symptalyze to track your symptoms and correlate them with your exercise and dietary choices to find what works best for your individual health journey.
`;

    return this.createChatbot({
      chatbotName: 'Symptalyze Health Assistant',
      sourceText: healthContent
    });
  }
}

export default ChatbotService;
