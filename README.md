<<<<<<< HEAD
# GovAssist AI — Government Scheme Recommendation System

> **B.Tech Final Year Project** | React + Spring Boot 3 + PostgreSQL + Gemini AI

---

## 🏛️ Overview

GovAssist AI is an intelligent system that recommends eligible government schemes to Indian citizens based on their personal profile using a **Java Rule Engine** for eligibility decisions and **Gemini AI** for explanations and chatbot support.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios |
| Backend | Spring Boot 3.2, Java 21, Spring Security |
| Auth | JWT (JJWT 0.12) |
| Database | PostgreSQL |
| AI | Google Gemini API (gemini-pro) |
| Build | Maven |

---

## 📂 Project Structure

```
project/
├── govassist-backend/          ← Spring Boot
│   ├── src/main/java/com/govassist/
│   │   ├── config/             SecurityConfig, CorsConfig
│   │   ├── controller/         AuthController, UserController, SchemeController, AIController
│   │   ├── dto/                RegisterRequest, LoginRequest, AuthResponse, UserProfileRequest/Response, RecommendationResponse, ChatRequest/Response
│   │   ├── entity/             User, Scheme, Recommendation
│   │   ├── repository/         UserRepository, SchemeRepository, RecommendationRepository
│   │   ├── security/           JwtUtil, JwtAuthenticationFilter, UserDetailsServiceImpl
│   │   └── service/            AuthService, UserService, SchemeService, RecommendationService, AIService
│   └── src/main/resources/
│       ├── application.properties
│       └── schema.sql          ← DB schema + 20 seeded schemes
│
└── govassist-frontend/         ← React + Vite
    └── src/
        ├── context/            AuthContext.jsx
        ├── services/           api.js
        ├── pages/              Home, Login, Register, Dashboard, Profile, Schemes, Admin
        └── components/         Navbar, SchemeCard, ChatBot
```

---

## ⚙️ Setup Instructions

### 1. MySQL Database

```sql
-- Run schema.sql in MySQL
mysql -u root -p < govassist-backend/src/main/resources/schema.sql
```

Or just start the app with `spring.jpa.hibernate.ddl-auto=create` and manually insert seeds.

### 2. Backend Configuration

Edit `govassist-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/govassist_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_DB_PASSWORD

jwt.secret=govassist-secret-key-for-jwt-token-signing-must-be-256-bits-long-for-security
jwt.expiration=86400000

ai.gemini.api-key=YOUR_GEMINI_API_KEY_HERE
ai.gemini.model=gemini-pro
```

### 3. Run Backend

```bash
cd govassist-backend
mvn clean install
mvn spring-boot:run
# Server starts at http://localhost:8080
```

### 4. Install & Run Frontend

```bash
cd govassist-frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

---

## 🔌 REST API Reference

### Auth Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### User Endpoints (Protected)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update profile + documents |

### Scheme Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/schemes/all` | All active schemes (public) |
| GET | `/api/schemes/{id}` | Single scheme |
| POST | `/api/schemes/recommend` | Run rule engine + generate recommendations |
| GET | `/api/schemes/recommendations` | Get existing recommendations |

### AI Endpoints (Protected)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/ai/chat` | Chatbot conversation |
| POST | `/api/ai/explain` | Explain scheme eligibility |
| POST | `/api/ai/alternatives` | Suggest alternative schemes |
| GET | `/api/ai/guidance/{schemeName}` | Step-by-step apply guide |

---

## 🔐 Authentication Flow

```
Register → POST /api/auth/register → JWT Token
Login    → POST /api/auth/login    → JWT Token
All secured routes → Authorization: Bearer <token>
```

---

## 🧠 Rule Engine Logic

The **Spring Boot Rule Engine** in `RecommendationService.java` checks:

1. **Age** — min/max age range from scheme
2. **Gender** — scheme-specific (MALE/FEMALE/ALL)
3. **Income** — annual income ≤ scheme's max_income
4. **Category** — GEN/OBC/SC/ST match
5. **Occupation** — eligible occupations list
6. **Documents** — checks each required document against user's documents

**Eligibility Score** = (criteria met / total criteria) × 100%

> ⚠️ AI is NOT used for eligibility calculation — only for explanations and chat.

---

## 🤖 AI Features (Gemini API)

| Feature | Prompt Type |
|---------|-------------|
| Scheme Chatbot | Context-aware Q&A with user profile |
| Eligibility Explanation | Why eligible/not, in simple language |
| Alternative Schemes | 3 alternatives when not eligible |
| Application Guidance | Step-by-step how to apply |

---

## 📋 Database Schema (3 Tables)

- **`users`** — Profile, documents (boolean flags), role
- **`schemes`** — All scheme details with eligibility rules
- **`recommendations`** — User × Scheme eligibility results

---

## 🌟 Key Features

- ✅ Rule-based eligibility (no AI bias)
- ✅ Eligibility score (0-100%)
- ✅ Eligible + ineligible schemes with reasons
- ✅ Missing document alerts
- ✅ Unlockable schemes (if you get missing docs)
- ✅ AI chatbot (Gemini)
- ✅ AI eligibility explanations
- ✅ Alternative scheme suggestions
- ✅ Application guidance
- ✅ 20 real government schemes seeded
- ✅ Responsive Tailwind UI
- ✅ JWT authentication
- ✅ Admin panel

---

## 📦 Pre-seeded Schemes

1. PM Kisan Samman Nidhi
2. PM Awas Yojana (Gramin & Urban)
3. PM Ujjwala Yojana
4. Sukanya Samriddhi Yojana
5. Ayushman Bharat - PMJAY
6. PM Mudra Yojana
7. National Scholarship Portal
8. Atal Pension Yojana
9. PM Jeevan Jyoti Bima Yojana
10. PM Suraksha Bima Yojana
11. Kisan Credit Card
12. Beti Bachao Beti Padhao
13. MGNREGA
14. Startup India
15. Stand Up India
16. Post Matric Scholarship (SC)
17. Pre Matric Scholarship (ST)
18. Vishwakarma Yojana
19. Skill India Mission
20. + More via Admin Panel

---

## 👤 Demo Credentials

After setup, register at `/register` or use:
- Email: `admin@govassist.com` / Password: `admin123` (create manually)

---

*Made with ❤️ for India | B.Tech Final Year Project 2024*
=======
# Government-Scheme-AI-Assistant
>>>>>>> 947d4f7c71a0335784315d9bd9405b313c041f84
