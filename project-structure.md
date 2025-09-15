# 🏗️ Project Structure & Architecture

## 📁 Folder Structure

```
genai-interview-coach/
├── frontend/                    # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── FeedbackDashboard.jsx
│   │   │   └── ScoreVisualization.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Interview.jsx
│   │   │   └── Results.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   ├── package.json
│   └── tailwind.config.js
├── backend/                     # API server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── resume.js
│   │   │   ├── interview.js
│   │   │   └── feedback.js
│   │   ├── services/
│   │   │   ├── openai.js
│   │   │   ├── langchain.js
│   │   │   └── vectordb.js
│   │   ├── utils/
│   │   │   ├── pdfParser.js
│   │   │   └── prompts.js
│   │   └── middleware/
│   ├── package.json
│   └── .env
├── data/                        # Sample data & prompts
│   ├── sample-resumes/
│   ├── prompt-templates/
│   └── interview-questions/
├── docs/                        # Documentation
├── tests/                       # Test files
└── README.md
```

## 🛠️ Technology Architecture

### Frontend (React + Tailwind)

```javascript
// Key Components Architecture
App.jsx
├── Dashboard (landing page)
├── ResumeUpload (file handling)
├── InterviewSession (chat interface)
└── ResultsDashboard (feedback display)

// State Management
- React Context for global state
- Local state for component-specific data
- API calls through custom hooks
```

### Backend API Endpoints

```javascript
// Resume Processing
POST /api/resume/upload          // Upload & parse resume
GET  /api/resume/analyze         // Extract key information
POST /api/resume/improve         // Get improvement suggestions

// Interview Generation
POST /api/interview/generate     // Create questions from resume
POST /api/interview/session      // Start interview session
POST /api/interview/answer       // Submit answer for feedback

// Feedback & Scoring
POST /api/feedback/analyze       // Analyze answer quality
GET  /api/feedback/history       // Get past sessions
POST /api/feedback/export        // Export results
```

### AI Pipeline Architecture

```
User Input → LangChain → OpenAI API → Vector DB → Structured Response

1. Resume Analysis:
   PDF/Text → Parsing → LLM Extraction → Structured Data

2. Question Generation:
   Resume + Job Description → LLM → Personalized Questions

3. Answer Evaluation:
   User Answer → STAR Analysis → Multi-dimensional Scoring → Feedback

4. Knowledge Retrieval:
   Query → Vector Search → Relevant Context → Enhanced Response
```

## 🔌 API Integration Points

### OpenAI Integration

```javascript
// services/openai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Question generation
async function generateInterviewQuestions(resume, jobDescription) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert interview coach...",
      },
      {
        role: "user",
        content: `Resume: ${resume}\nJob: ${jobDescription}`,
      },
    ],
  });
  return response.choices[0].message.content;
}
```

### LangChain Integration

```javascript
// services/langchain.js
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

// Structured feedback pipeline
const feedbackTemplate = new PromptTemplate({
  template: `Analyze this interview answer using the STAR method:
  Question: {question}
  Answer: {answer}
  
  Provide scores (1-5) for:
  - Situation clarity
  - Task explanation  
  - Action details
  - Result impact
  
  Format as JSON.`,
  inputVariables: ["question", "answer"],
});
```

### Vector Database Setup

```javascript
// services/vectordb.js
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// Store interview best practices
async function setupKnowledgeBase() {
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await PineconeStore.fromTexts(
    interviewTips,
    metadatas,
    embeddings,
    { pineconeIndex }
  );
  return vectorStore;
}
```

## 🔐 Environment Variables

```bash
# .env file
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
PINECONE_INDEX_NAME=interview-coach
DATABASE_URL=...
JWT_SECRET=...
```

## 📊 Data Flow

### 1. Resume Processing Flow

```
PDF Upload → Text Extraction → LLM Analysis → Structured JSON
{
  "personalInfo": {...},
  "experience": [...],
  "skills": [...],
  "education": [...],
  "keyAchievements": [...]
}
```

### 2. Interview Question Generation

```
Resume Data + Job Description → LLM Prompt → Personalized Questions
[
  {
    "category": "behavioral",
    "question": "Tell me about a time you led a technical project...",
    "focus": "leadership, technical skills"
  }
]
```

### 3. Answer Evaluation

```
User Answer → STAR Analysis → Multi-dimensional Score → Improvement Tips
{
  "scores": {
    "situation": 4,
    "task": 3,
    "action": 5,
    "result": 3
  },
  "feedback": "Great action details, but elaborate more on the business impact...",
  "suggestions": [...]
}
```

## 🚀 Deployment Architecture

### Frontend (Vercel)

- React build deployed to Vercel
- Environment variables for API endpoints
- Automatic deployments from Git

### Backend (Render/Railway)

- Node.js API server
- Environment variables for secrets
- Database connection (PostgreSQL)

### Database Options

1. **Simple**: JSON files + local storage
2. **Medium**: SQLite + file system
3. **Production**: PostgreSQL + Redis cache

## 📈 Scalability Considerations

### Rate Limiting

```javascript
// Protect OpenAI API costs
const rateLimit = {
  questions: "10 per hour per user",
  feedback: "20 per hour per user",
  resume_analysis: "5 per hour per user",
};
```

### Caching Strategy

- Cache generated questions for 24h
- Cache resume analysis results
- Vector DB similarity search optimization

### Cost Management

- Set OpenAI usage limits
- Implement prompt optimization
- Use GPT-3.5 for less critical tasks, GPT-4 for main features

---

This architecture gives you a solid foundation that's both beginner-friendly and production-ready! 🎯
