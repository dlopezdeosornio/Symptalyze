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
   * Creates the Symptalyze health assistant chatbot with personalized content
   */
  static async createSymptalyzeChatbot(userContext?: any): Promise<ChatbotResponse> {
    const personalizedContent = userContext ? this.generatePersonalizedContent(userContext) : '';
    
    const healthContent = `
# Symptalyze Health Assistant

## About Symptalyze
Symptalyze is a comprehensive symptom tracking and health monitoring application that helps users track their symptoms, medications, and health patterns over time.

${personalizedContent}

## Exercise Recommendations

### General Exercise Guidelines
- Aim for at least 150 minutes of moderate-intensity aerobic exercise per week
- Include strength training exercises 2-3 times per week
- Incorporate flexibility and balance exercises, especially for older adults
- Listen to your body and adjust intensity based on how you feel

### Age-Specific Exercise Guidelines
**Young Adults (18-30)**: 
- Focus on building strength and cardiovascular fitness
- Can handle higher intensity workouts
- Include sports and recreational activities
- Build healthy exercise habits for life

**Middle-Aged Adults (31-50)**: 
- Balance cardio and strength training
- Focus on injury prevention and flexibility
- Include stress-reducing activities like yoga or meditation
- Monitor recovery time between workouts

**Older Adults (50+)**: 
- Prioritize balance, flexibility, and functional movement
- Include low-impact activities like walking, swimming, tai chi
- Focus on maintaining independence and preventing falls
- Work with healthcare providers for any limitations

### Gender-Specific Exercise Considerations
**For Women**: 
- Include weight-bearing exercises for bone health
- Consider hormonal changes and adjust intensity accordingly
- Focus on core strength and pelvic floor health
- Include stress-reducing activities

**For Men**: 
- Include cardiovascular health focus
- Balance strength training with flexibility
- Consider prostate health with regular activity
- Include stress management techniques

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

### Age-Specific Nutrition Guidelines
**Young Adults (18-30)**: 
- Focus on building healthy eating habits
- Include adequate protein for muscle development
- Ensure sufficient calcium and iron intake
- Limit processed foods and excessive alcohol

**Middle-Aged Adults (31-50)**: 
- Focus on heart-healthy foods
- Include antioxidants and anti-inflammatory foods
- Monitor portion sizes and metabolism changes
- Include stress-reducing foods like magnesium-rich options

**Older Adults (50+)**: 
- Focus on nutrient-dense foods
- Include adequate protein to prevent muscle loss
- Ensure sufficient vitamin D and B12
- Consider digestive health with fiber and probiotics

### Gender-Specific Nutrition Considerations
**For Women**: 
- Include iron-rich foods, especially during reproductive years
- Focus on calcium and vitamin D for bone health
- Include folate-rich foods
- Consider hormonal balance with phytoestrogens

**For Men**: 
- Include heart-healthy fats and antioxidants
- Focus on prostate health with lycopene-rich foods
- Include adequate zinc and selenium
- Monitor portion sizes and metabolic changes

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

  /**
   * Generates personalized content based on user context
   */
  private static generatePersonalizedContent(userContext: any): string {
    const { userInfo, healthData } = userContext;
    
    let personalizedContent = `
## Personalized Health Profile

### User Information
- Name: ${userInfo.name}
- Age: ${userInfo.age} years old
- Gender: ${userInfo.gender}

### Current Health Status
Based on recent symptom tracking (last 7 entries):
- Recent symptoms: ${healthData.recentSymptoms.length > 0 ? healthData.recentSymptoms.join(', ') : 'No recent symptoms reported'}
- Average sleep: ${healthData.averageSleepHours} hours per night
- Average diet quality: ${healthData.averageDietQuality}/5
- Average exercise: ${healthData.averageExerciseMinutes} minutes per day
- Current medications: ${healthData.currentMedications.length > 0 ? healthData.currentMedications.join(', ') : 'None'}
- Total entries tracked: ${healthData.totalEntries}

### Personalized Recommendations
`;

    // Add age-specific recommendations
    if (userInfo.age < 30) {
      personalizedContent += `
**For your age group (18-30):**
- Focus on building strong exercise habits for long-term health
- Include high-intensity workouts and sports activities
- Ensure adequate protein intake for muscle development
- Build healthy eating patterns that will last a lifetime
`;
    } else if (userInfo.age >= 30 && userInfo.age < 50) {
      personalizedContent += `
**For your age group (30-50):**
- Balance cardio and strength training to maintain fitness
- Focus on injury prevention and flexibility
- Include stress-reducing activities like yoga or meditation
- Monitor portion sizes as metabolism may be changing
`;
    } else {
      personalizedContent += `
**For your age group (50+):**
- Prioritize balance, flexibility, and functional movement
- Include low-impact activities like walking, swimming, tai chi
- Focus on nutrient-dense foods and adequate protein
- Work with healthcare providers for any limitations
`;
    }

    // Add gender-specific recommendations
    if (userInfo.gender === 'female') {
      personalizedContent += `
**For women:**
- Include weight-bearing exercises for bone health
- Focus on iron-rich foods, especially if experiencing fatigue
- Include calcium and vitamin D for bone strength
- Consider hormonal balance with phytoestrogens
`;
    } else if (userInfo.gender === 'male') {
      personalizedContent += `
**For men:**
- Include cardiovascular health focus
- Include heart-healthy fats and antioxidants
- Focus on prostate health with lycopene-rich foods
- Include adequate zinc and selenium
`;
    }

    // Add symptom-specific recommendations
    if (healthData.recentSymptoms.length > 0) {
      personalizedContent += `
**Based on your recent symptoms:**
`;
      
      healthData.recentSymptoms.forEach((symptom: string) => {
        switch (symptom.toLowerCase()) {
          case 'fatigue':
          case 'low_energy':
            personalizedContent += `- For fatigue: Light to moderate exercise like walking or yoga can boost energy
- Include iron-rich foods and B-vitamins
- Ensure adequate sleep and hydration
`;
            break;
          case 'anxiety':
          case 'stress':
            personalizedContent += `- For anxiety/stress: Cardiovascular exercise, yoga, tai chi, or mindful walking
- Include magnesium-rich foods like dark leafy greens
- Limit caffeine and alcohol
`;
            break;
          case 'insomnia':
          case 'restless_sleep':
            personalizedContent += `- For sleep issues: Morning exercise helps regulate sleep cycles
- Avoid intense exercise close to bedtime
- Include tryptophan-rich foods like turkey, nuts, seeds
`;
            break;
          case 'muscle_pain':
          case 'joint_pain':
          case 'back_pain':
            personalizedContent += `- For pain: Low-impact exercises like water aerobics, cycling, gentle stretching
- Include anti-inflammatory foods like fatty fish, berries, leafy greens
- Consider turmeric, ginger, and green tea
`;
            break;
        }
      });
    }

    // Add lifestyle-specific recommendations
    if (healthData.averageSleepHours < 7) {
      personalizedContent += `
**Sleep Optimization:**
- Your average sleep (${healthData.averageSleepHours} hours) is below recommended 7-9 hours
- Consider establishing a consistent bedtime routine
- Limit screen time before bed
- Include sleep-promoting foods like cherries, almonds, or chamomile tea
`;
    }

    if (healthData.averageDietQuality < 3) {
      personalizedContent += `
**Diet Improvement:**
- Your diet quality rating (${healthData.averageDietQuality}/5) suggests room for improvement
- Focus on adding more fruits, vegetables, and whole grains
- Reduce processed foods and added sugars
- Include more lean proteins and healthy fats
`;
    }

    if (healthData.averageExerciseMinutes < 150) {
      personalizedContent += `
**Exercise Enhancement:**
- Your average exercise (${healthData.averageExerciseMinutes} minutes/day) is below recommended 150 minutes/week
- Start with small increments: 10-15 minutes of walking daily
- Gradually increase duration and intensity
- Find activities you enjoy to maintain consistency
`;
    }

    personalizedContent += `
### Important Notes
- These recommendations are based on your current health data and should be adjusted as your health changes
- Always consult with healthcare professionals before making significant lifestyle changes
- Track your progress in Symptalyze to see how these changes affect your symptoms
`;

    return personalizedContent;
  }
}

export default ChatbotService;
