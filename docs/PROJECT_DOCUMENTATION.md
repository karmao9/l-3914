# InteliCourse - AI-Powered Course Recommendation System

## 📋 Project Overview

InteliCourse is a comprehensive educational platform that helps students make informed decisions about their academic journey through AI-powered course recommendations, consultations, and expert guidance. The platform combines modern web technologies with intelligent algorithms to provide personalized learning path suggestions.

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern React with hooks for building interactive UIs
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom design tokens
- **React Router DOM 6.26.2** - Client-side routing for SPA navigation

### UI Components & Libraries
- **shadcn/ui** - Reusable component library built on Radix UI primitives
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React 0.462.0** - Beautiful icon library
- **Sonner 1.5.0** - Toast notification system
- **React Hook Form 7.53.0** - Performant form library with validation
- **Zod 3.23.8** - Schema validation library

### State Management & Data Fetching
- **TanStack Query 5.56.2** - Powerful data synchronization for React
- **React Context API** - Built-in state management for authentication

### Backend & Database
- **Supabase** - Complete backend-as-a-service platform
  - **PostgreSQL** - Robust relational database with full SQL support
  - **Row Level Security (RLS)** - Database-level security policies
  - **Edge Functions** - Serverless functions for custom backend logic
  - **Authentication** - Built-in user management and JWT tokens
  - **Vector Extensions** - AI/ML capabilities with pgvector

### AI & Machine Learning
- **OpenAI API** - GPT models for intelligent course recommendations
- **Vector Embeddings** - Semantic similarity matching for course suggestions
- **Custom Recommendation Algorithm** - PostgreSQL functions for smart matching

### Styling & Design
- **Custom Design System** - Semantic color tokens and consistent theming
- **Arcade Theme** - Dark mode with purple/pink gradient accents
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints
- **Custom Animations** - Keyframe animations for smooth user experience

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend (React)                       │
├─────────────────────────────────────────────────────────────────┤
│  Authentication  │  Course Discovery  │  Recommendations        │
│  Context         │  Assessment        │  Consultations          │
├─────────────────────────────────────────────────────────────────┤
│                     Supabase Backend                            │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL DB   │  Edge Functions    │  Auth Service           │
│  RLS Policies    │  OpenAI Integration│  File Storage           │
├─────────────────────────────────────────────────────────────────┤
│                      External APIs                              │
│              OpenAI GPT Models for AI Recommendations           │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Key Features

### 1. User Authentication
- **Email/Password authentication** via Supabase Auth
- **User profiles** with display names and preferences
- **Protected routes** requiring authentication
- **Automatic session management** with refresh tokens

### 2. Course Discovery & Assessment
- **Interactive assessment** to understand student preferences
- **Smart questionnaire** covering:
  - Current academic program
  - Favorite subjects
  - Strengths and interests
  - Career aspirations
  - Learning preferences

### 3. AI-Powered Recommendations
- **OpenAI integration** for intelligent course matching
- **Vector similarity search** using PostgreSQL extensions
- **Personalized scoring** based on multiple factors
- **Detailed course information** including:
  - University and program details
  - Entry requirements
  - Career prospects
  - Average salary data
  - Employment rates

### 4. Consultation System
- **Book consultation** with education experts
- **Rating and feedback** system for consultations
- **Meeting room integration** with video call simulation
- **Chat functionality** during consultations

### 5. Meeting Room Features
- **Virtual meeting interface** with video simulation
- **Real-time chat** messaging system
- **Meeting controls** (mute, camera, screen share simulation)
- **Participant management** with join/leave functionality

### 6. Administrative Panel
- **Course management** and embedding generation
- **System monitoring** and analytics
- **User management** capabilities

## 🗄️ Database Schema

### Core Tables

#### `profiles`
```sql
- id (uuid, primary key, references auth.users)
- email (text)
- display_name (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `courses`
```sql
- id (uuid, primary key)
- title (text)
- university (text)
- field (text)
- description (text)
- key_subjects (text[])
- career_prospects (text[])
- entry_requirements (text)
- duration (text)
- location (text)
- average_salary (text)
- employment_rate (text)
- embedding (vector) // for AI similarity matching
- created_at (timestamp)
- updated_at (timestamp)
```

#### `student_responses`
```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- current_program (text)
- favorite_subjects (text)
- difficult_subjects (text)
- strengths (text)
- task_preference (text)
- career_interests (text)
- embedding (vector)
- created_at (timestamp)
```

#### `recommendations`
```sql
- id (uuid, primary key)
- student_response_id (uuid, references student_responses)
- course_id (uuid, references courses)
- similarity_score (decimal)
- created_at (timestamp)
```

#### `consultations`
```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- consultant_name (text)
- date (date)
- time (text)
- duration (text)
- status (text)
- rating (integer)
- feedback (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Database Functions

#### `get_course_recommendations()`
Smart matching algorithm that:
- Analyzes student program and interests
- Matches against course fields and subjects
- Returns scored recommendations (65-85% match rates)
- Uses PostgreSQL text matching with LIKE operators

#### `handle_new_user()`
Trigger function that:
- Automatically creates profile when user registers
- Extracts display_name from user metadata
- Ensures data consistency between auth and profiles

## 🔑 Environment Configuration

### Supabase Configuration
```
Project ID: pdktcvxuymbsyaevwjrp
Database URL: https://pdktcvxuymbsyaevwjrp.supabase.co
```

### Required Secrets
- `OPENAI_API_KEY` - For AI-powered recommendations
- `SUPABASE_URL` - Database connection URL
- `SUPABASE_ANON_KEY` - Public API key for client connections
- `SUPABASE_SERVICE_ROLE_KEY` - Admin access for server operations

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── AdminPanel.tsx   # Administrative interface
│   ├── EmailForm.tsx    # Newsletter subscription
│   ├── Header.tsx       # Navigation header
│   ├── Terminal.tsx     # Interactive terminal component
│   └── UserMenu.tsx     # User authentication menu
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication state management
├── pages/               # Route-based page components
│   ├── Index.tsx        # Landing page
│   ├── Auth.tsx         # Login/signup forms
│   ├── FindCourse.tsx   # Course discovery interface
│   ├── CreateGame.tsx   # Assessment questionnaire
│   ├── Recommendations.tsx # AI recommendation results
│   ├── Consultation.tsx # Consultation booking/rating
│   ├── MeetingRoom.tsx  # Virtual meeting interface
│   ├── Admin.tsx        # Administrative dashboard
│   └── NotFound.tsx     # 404 error page
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   └── supabase/       # Supabase client and types
└── lib/                # Utility functions

supabase/
├── functions/          # Edge Functions (serverless)
│   ├── generate-course-recommendations/ # AI recommendation engine
│   └── generate-course-embeddings/     # Vector embedding generation
└── config.toml         # Supabase project configuration
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd intelicourse
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy environment file
cp .env.example .env

# Update with your Supabase credentials
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

4. **Set up Supabase secrets**
- Navigate to Supabase Dashboard → Settings → Edge Functions
- Add `OPENAI_API_KEY` secret for AI functionality

5. **Run database migrations**
```bash
# Apply database schema and RLS policies
# (Handled automatically via Supabase migration system)
```

6. **Start development server**
```bash
npm run dev
```

## 🔄 Development Workflow

### Code Organization
- **Component-based architecture** with single responsibility
- **Custom hooks** for reusable logic
- **Context providers** for global state
- **TypeScript interfaces** for type safety

### Styling Guidelines
- Use **semantic tokens** from design system (no direct colors)
- **HSL color format** for all custom colors
- **Responsive design** with mobile-first approach
- **Consistent spacing** using Tailwind utilities

### State Management
- **React Context** for authentication state
- **TanStack Query** for server state caching
- **Local state** with useState for component-specific data
- **Form state** managed by React Hook Form

### API Integration
- **Supabase client** for all backend operations
- **Edge Functions** for custom business logic
- **OpenAI API** integration via server-side functions
- **Error handling** with try-catch and user notifications

## 🧪 Testing & Quality Assurance

### Code Quality
- **TypeScript** for compile-time error checking
- **ESLint** for code linting and consistency
- **Prettier** for code formatting (configured via Lovable)
- **Component testing** with React Testing Library (to be implemented)

### Security Features
- **Row Level Security (RLS)** on all database tables
- **JWT authentication** with automatic token refresh
- **API key management** via Supabase secrets
- **Input validation** with Zod schemas
- **XSS protection** via React's built-in sanitization

## 🚢 Deployment

### Lovable Platform
- **Automatic deployment** on code changes
- **Preview URLs** for testing
- **Custom domain** configuration available
- **Environment management** built-in

### Performance Optimizations
- **Lazy loading** for route-based code splitting
- **Image optimization** with proper alt attributes
- **Bundle size monitoring** via Vite analyzer
- **Database query optimization** with proper indexing

## 📈 Monitoring & Analytics

### Application Monitoring
- **Supabase Analytics** for database performance
- **Edge Function logs** for serverless debugging
- **Authentication metrics** via Supabase dashboard
- **User engagement** tracking (to be implemented)

### Error Handling
- **Global error boundaries** for React crashes
- **API error responses** with user-friendly messages
- **Form validation** with real-time feedback
- **Network error recovery** with retry logic

## 🔮 Future Enhancements

### Planned Features
- **Real-time notifications** via Supabase Realtime
- **Advanced filtering** for course search
- **Social features** for student connections
- **Mobile app** development with React Native
- **Multi-language support** with i18n

### Technical Improvements
- **Comprehensive testing suite** with Jest and React Testing Library
- **Performance monitoring** with Core Web Vitals
- **CI/CD pipeline** integration
- **Advanced caching strategies** for better performance

## 👥 Contributing

### Development Standards
1. Follow **TypeScript best practices**
2. Use **semantic commit messages**
3. Implement **responsive design** for all components
4. Write **comprehensive documentation** for new features
5. Follow **accessibility guidelines** (WCAG 2.1)

### Code Review Process
1. Create feature branch from main
2. Implement changes with proper testing
3. Submit pull request with detailed description
4. Address review feedback and iterate
5. Merge after approval and testing

---

*This documentation is maintained by the development team. Last updated: January 2025*