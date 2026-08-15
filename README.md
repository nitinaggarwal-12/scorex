# Databricks Technical Maturity Assessment Platform

Enterprise-grade assessment platform for evaluating and improving Databricks technical maturity across 6 key pillars.

## 🎯 Overview

A comprehensive web application that helps organizations assess their Databricks maturity, identify gaps, and receive intelligent, pillar-specific recommendations for improvement.

## ✨ Key Features

### Assessment Framework
- **6 Pillar Assessment**: Platform Governance, Data Engineering, Analytics & BI, Machine Learning, Generative AI, Operational Excellence
- **60 Questions**: 10 questions per pillar covering current state, future vision, pain points, and notes
- **Maturity Scoring**: 5-level maturity scale (Initial → Experiment → Develop → Optimize → Innovate)
- **Custom Questions**: Add pillar-specific questions with full assessment capabilities

### Intelligent Recommendations
- **Pillar-Specific Features**: Each pillar shows only relevant Databricks features
- **Pain Point Mapping**: 300+ pain points mapped to specific solutions
- **Contextual Next Steps**: Actionable recommendations based on maturity gaps
- **Industry Benchmarking**: Compare against industry standards

### Reporting & Analytics
- **Executive Command Center**: High-level strategic overview with dynamic roadmap
- **Deep Dive Report**: Detailed technical analysis per pillar
- **Industry Benchmarking**: Competitive positioning and peer comparison
- **Insights Dashboard**: Cross-pillar analytics and trends

### Collaboration Features
- **User Management**: Admin, Author, Consumer roles with RBAC
- **Question Assignments**: Assign specific questions to users
- **Assessment History**: Track changes and version control
- **Excel Import/Export**: Bulk edit assessments offline

### User Experience
- **Interactive Chatbot**: Context-aware assistance across all pages
- **Slideshow Mode**: Present reports with professional slides
- **Print Functionality**: Generate PDF reports
- **Feedback System**: Capture user feedback with analytics
- **User Guide**: Comprehensive documentation and training

## 🚀 Tech Stack

- **Frontend**: React 18, React Router, Recharts
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Deployment**: Railway
- **Authentication**: Session-based with bcrypt

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/nitinaggarwal-12/technical-maturity-assessment.git
cd technical-maturity-assessment
```

2. **Install dependencies**
```bash
npm install
cd client && npm install && cd ..
```

3. **Configure environment**
```bash
cp env.example .env
# Edit .env with your PostgreSQL credentials
```

4. **Initialize database**
```bash
npm run db:setup
```

5. **Start the application**
```bash
# Development mode (separate terminals)
npm run server  # Backend on port 5001
npm run client  # Frontend on port 3000

# Or use the convenience script
./start-local.sh
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Health Check: http://localhost:5001/api/health

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/maturity_assessment

# Server
PORT=5001
NODE_ENV=development

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# OpenAI (optional - for enhanced content generation)
OPENAI_API_KEY=your-openai-key
```

## 📚 Usage

### For Administrators
1. **Create Assessment**: Start new assessment with selected pillars
2. **Manage Users**: Add authors and consumers
3. **Assign Questions**: Delegate specific questions to team members
4. **Custom Questions**: Add organization-specific questions
5. **View Reports**: Access all reports and analytics

### For Authors
1. **Complete Assessments**: Answer assigned questions
2. **Track Progress**: Monitor completion status
3. **Collaborate**: Work with team on shared assessments

### For Consumers
1. **View Reports**: Access completed assessment reports
2. **Benchmarking**: Compare against industry standards
3. **Export**: Download reports as PDF or Excel

## 🏗️ Architecture

```
databricks-maturity-assessment/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── data/          # Assessment framework
├── server/                # Node.js backend
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   ├── db/               # Database layer
│   ├── data/             # Pillar definitions
│   └── migrations/       # Database migrations
└── railway.json          # Railway deployment config
```

## 🔐 Security

- **Authentication**: Session-based with secure cookies
- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CORS**: Configured for production domains

## 🚢 Deployment

### Railway (Recommended)

1. **Connect Repository**: Link to Railway
2. **Configure Environment**: Set environment variables
3. **Deploy**: Automatic deployment on push

Live URL: https://web-production-76e27.up.railway.app/

### Manual Deployment

```bash
# Build frontend
cd client && npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Test email configuration
node test-email-config.js

# Test database connection
node server/db/connection.js
```

## 📊 Database Schema

- **assessments**: Assessment metadata and responses
- **users**: User accounts and roles
- **question_assignments**: Question-level assignments
- **custom_questions**: Organization-specific questions
- **question_edits**: Edit history and versioning
- **feedback**: User feedback and analytics
- **chat_conversations**: Chatbot interactions
- **knowledge_base**: FAQ and documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 👥 Authors

- **Nitin Aggarwal** - Initial work - [nitinaggarwal-12](https://github.com/nitinaggarwal-12)

## 🙏 Acknowledgments

- Databricks for the maturity framework
- React and Node.js communities
- Railway for hosting infrastructure

## 📞 Support

For support, email nitin.aggarwal@databricks.com or open an issue in the repository.

---

**Built with ❤️ for Databricks customers**


