# Symptalyze 🏥

**Your Personal Health Companion**

Symptalyze is a comprehensive health tracking application that helps you monitor symptoms, track lifestyle factors, and gain insights into your health patterns through data visualization and AI-powered recommendations.

![Symptalyze Logo](https://img.shields.io/badge/Symptalyze-Health%20Tracker-blue?style=for-the-badge&logo=health)

## ✨ Features

### 🔐 User Authentication
- Secure user registration and login
- Personalized dashboard experience
- User-specific data storage

### 📊 Symptom Tracking
- **Comprehensive Symptom Library**: Track 40+ predefined symptoms across physical and mental categories
- **Custom Symptom Entry**: Add your own symptoms beyond the predefined list
- **Multi-symptom Tracking**: Record multiple symptoms in a single entry
- **Severity Rating**: Rate symptom intensity on a scale

### 📈 Lifestyle Monitoring
- **Sleep Tracking**: Monitor hours of sleep per night
- **Diet Quality**: Rate diet quality on a 1-5 scale
- **Exercise Logging**: Track exercise minutes per day
- **Medication Tracking**: Record current medications

### 📊 Data Visualization
- **Health Trends Chart**: Visualize symptom patterns over time
- **Variable Comparison**: Compare different health factors
- **Interactive Charts**: Built with Recharts for responsive data visualization

### 🤖 AI Health Assistant
- **Chatbot Integration**: AI-powered health recommendations via Chatbase
- **Exercise Recommendations**: Get personalized exercise suggestions
- **Diet Advice**: Receive dietary recommendations based on symptoms
- **Wellness Tips**: General health and lifestyle guidance

### 💊 Medication Tracker
- Track current medications
- Monitor medication effectiveness
- Integration with symptom tracking

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dlopezdeosornio/Symptalyze.git
   cd Symptalyze
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Data Visualization
- **Recharts** - Composable charting library for React

### Testing
- **Vitest** - Fast unit testing framework
- **React Testing Library** - React component testing utilities
- **Jest DOM** - Custom Jest matchers for DOM testing
- **jsdom** - DOM implementation for Node.js

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SymptomForm.tsx     # Symptom entry form
│   ├── SymptomList.tsx     # Display symptom entries
│   ├── SymptomChart.tsx    # Health trends visualization
│   ├── ComparisonChart.tsx # Variable comparison charts
│   ├── MedicationTracker.tsx # Medication management
│   ├── HealthAssistant.tsx # AI assistant interface
│   └── ChatbotWidget.tsx   # Chatbot integration
├── pages/              # Application pages
│   ├── AuthLanding.tsx     # Landing page
│   ├── Login.tsx           # User login
│   ├── Signup.tsx          # User registration
│   └── Dashboard.tsx       # Main application dashboard
├── contexts/           # React context providers
│   ├── AuthContext.tsx     # Authentication context
│   └── AuthProvider.tsx    # Auth context provider
├── hooks/              # Custom React hooks
│   └── useAuth.ts          # Authentication hook
├── types/              # TypeScript type definitions
│   ├── entry.data.ts       # Symptom entry types
│   ├── medications.ts      # Medication types
│   └── user.ts             # User types
├── utils/              # Utility functions
│   └── storage.ts          # Local storage utilities
└── __tests__/          # Test files
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Full user flow testing
- **Coverage Reports**: Comprehensive test coverage analysis

## 🚀 Deployment

### GitHub Pages
The application is configured for deployment to GitHub Pages:

```bash
npm run deploy
```

This will build the application and deploy it to the `gh-pages` branch.

### Manual Deployment
1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting service

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory for environment-specific configurations:

```env
VITE_APP_TITLE=Symptalyze
VITE_APP_VERSION=1.0.0
```

### Build Configuration
The application uses Vite for building. Configuration can be modified in `vite.config.ts`.

## 📱 Features in Detail

### Symptom Categories
- **Physical Symptoms**: Headache, fatigue, nausea, dizziness, muscle pain, joint pain, chest pain, stomach pain, back pain, fever, chills, sweating, shortness of breath, heart palpitations, bloating, constipation, diarrhea, rash, itchiness, swelling
- **Mental Symptoms**: Anxiety, depression, irritability, mood swings, confusion, memory problems, concentration issues, brain fog, stress

### Data Persistence
- User data is stored locally using browser localStorage
- Data is user-specific and persists across sessions
- Automatic data loading and saving

### Responsive Design
- Mobile-first design approach
- Responsive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use meaningful commit messages
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/dlopezdeosornio/Symptalyze/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Roadmap

### Upcoming Features
- [ ] Data export functionality
- [ ] Health report generation
- [ ] Integration with health devices
- [ ] Medication reminder system
- [ ] Advanced analytics and insights
- [ ] Multi-language support
- [ ] Dark mode theme

### Version History
- **v0.0.0** - Initial release with core symptom tracking features

## 🙏 Acknowledgments

- Built with React and modern web technologies
- Charts powered by Recharts
- AI assistance provided by Chatbase
- Icons and styling with Tailwind CSS

---

**Made with ❤️ for better health tracking**

*Remember: This application is for health tracking and general wellness information only. Always consult with healthcare professionals for medical advice.*
