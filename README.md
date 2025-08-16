# IntelliTest - AI-Powered Assessment Platform

IntelliTest is a comprehensive AI-powered assessment platform that transforms traditional learning into personalized, adaptive experiences. The platform uses advanced AI to generate questions from your own study materials, ensuring relevance and alignment with your learning journey.

## 🚀 Features Implemented

### Core Assessment Features
- **AI-Powered Question Generation**: Generate personalized questions from uploaded study materials
- **Multiple Question Types**: MCQ, Subjective, Numerical, and Mixed assessments
- **Bloom's Taxonomy Integration**: Questions aligned with cognitive learning levels
- **Adaptive Difficulty**: Questions that adjust to your learning level
- **Quality Control**: AI-powered validation and duplicate detection

### File Processing & Content Extraction
- **Multi-Format Support**: PDF, DOCX, PPTX, TXT, and MD files
- **Intelligent Content Extraction**: Extract text and identify key concepts
- **Concept Recognition**: Automatic identification of important topics and terms
- **File Validation**: Size and format validation with error handling

### Teacher Dashboard
- **Question Review System**: Review and approve AI-generated questions
- **Student Management**: Track student progress and performance
- **Analytics Dashboard**: Comprehensive analytics with charts and metrics
- **Quality Metrics**: Monitor question quality and approval rates

### Student Features
- **Progress Tracking**: Detailed analytics and performance insights
- **Study Plans**: Personalized study recommendations
- **Flashcards**: Spaced repetition learning system
- **Performance Analytics**: Advanced learning analytics and insights

### Authentication & User Management
- **Enhanced Authentication**: Secure login with session management
- **Role-Based Access**: Student and teacher roles with different permissions
- **User Preferences**: Customizable settings and preferences
- **Session Management**: Secure token-based authentication

### Data Management
- **Local Storage**: Robust localStorage implementation with fallbacks
- **Analytics Tracking**: User behavior and performance analytics
- **Data Persistence**: Reliable data storage and retrieval
- **Export Capabilities**: Assessment results export functionality

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **AI Integration**: OpenAI API (with fallback to mock data)
- **File Processing**: Custom file processor with format support
- **Authentication**: Custom auth service with session management
- **Database**: LocalStorage with mock database fallback

## 📁 Project Structure

```
intellitest/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── generate-assessment/  # Assessment generation
│   ├── assessment-results/       # Assessment results pages
│   ├── flashcards/              # Flashcard learning
│   ├── generate/                # Assessment generation
│   ├── login/                   # Authentication pages
│   ├── progress/                # Progress tracking
│   ├── study-plans/             # Study planning
│   ├── take-assessment/         # Assessment taking
│   ├── teacher/                 # Teacher dashboard
│   ├── tests/                   # Test analytics
│   └── upload/                  # File upload
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   └── [feature components]     # Feature-specific components
├── lib/                         # Core libraries
│   ├── ai/                      # AI services
│   ├── auth.ts                  # Authentication service
│   ├── database.ts              # Data management
│   ├── file-processor.ts        # File processing
│   └── types.ts                 # TypeScript types
└── public/                      # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intellitest
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your OpenAI API key (optional):
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Accounts

**Teacher Account:**
- Email: `teacher@example.com`
- Password: `password`

**Student Account:**
- Email: `student@example.com`
- Password: `password`

## 📖 Usage Guide

### For Students

1. **Upload Study Materials**
   - Go to the Upload page
   - Drag and drop or select your study files (PDF, DOCX, PPTX, etc.)
   - Wait for processing to complete

2. **Generate Assessments**
   - Navigate to Generate page
   - Configure assessment settings (type, difficulty, Bloom's level)
   - Generate personalized questions

3. **Take Assessments**
   - Start an assessment from your dashboard
   - Answer questions within the time limit
   - Review results and feedback

4. **Track Progress**
   - View detailed analytics in the Progress section
   - Monitor performance trends and improvements
   - Access personalized insights

5. **Use Flashcards**
   - Review concepts with spaced repetition
   - Track retention and mastery
   - Focus on areas needing improvement

### For Teachers

1. **Access Teacher Dashboard**
   - Login with teacher credentials
   - Access the teacher dashboard

2. **Review Questions**
   - Review AI-generated questions
   - Approve or reject questions
   - Monitor quality metrics

3. **Manage Students**
   - View student progress and performance
   - Track engagement and completion rates
   - Access student analytics

4. **Monitor Analytics**
   - View question quality trends
   - Monitor student performance
   - Track platform usage

## 🔧 Configuration

### AI Integration
The platform supports both real AI integration and mock data:

- **With OpenAI API**: Set `OPENAI_API_KEY` in environment variables
- **Without API**: Uses sophisticated mock data generation

### File Processing
Supported file formats:
- PDF (simulated extraction)
- DOCX (simulated extraction)
- PPTX (simulated extraction)
- TXT (real text extraction)
- MD (real text extraction)

### Database
- **Development**: Uses localStorage with mock database fallback
- **Production**: Can be extended to use real databases (PostgreSQL, MongoDB, etc.)

## 🎯 Key Features in Detail

### AI-Powered Question Generation
- Generates contextually relevant questions from study materials
- Supports multiple question types (MCQ, Subjective, Numerical)
- Aligns with Bloom's Taxonomy cognitive levels
- Includes quality control and duplicate detection

### Intelligent File Processing
- Extracts text content from various file formats
- Identifies key concepts and topics
- Validates file formats and sizes
- Provides detailed processing feedback

### Advanced Analytics
- Real-time performance tracking
- Learning pattern analysis
- Predictive insights and recommendations
- Comprehensive progress visualization

### Teacher Tools
- Question review and approval workflow
- Student performance monitoring
- Quality metrics and analytics
- Content management system

## 🔒 Security Features

- Secure authentication with session management
- Role-based access control
- Input validation and sanitization
- Secure file upload handling
- Token-based API authentication

## 📊 Analytics & Insights

The platform provides comprehensive analytics including:
- Performance trends and patterns
- Learning velocity tracking
- Skill gap analysis
- Predictive performance insights
- Study pattern heatmaps
- Competency breakdowns

## 🚀 Future Enhancements

### Planned Features
- Real database integration (PostgreSQL/MongoDB)
- Advanced PDF/DOCX parsing libraries
- Real-time collaboration features
- Mobile app development
- Advanced AI model integration
- Video content processing
- Peer assessment features

### Technical Improvements
- Server-side rendering optimization
- Advanced caching strategies
- Real-time notifications
- Offline support
- Advanced security features
- Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components from shadcn/ui
- Charts powered by Recharts
- Icons from Lucide React
- AI integration with OpenAI API

---

**IntelliTest** - Transforming education through AI-powered personalized learning.
