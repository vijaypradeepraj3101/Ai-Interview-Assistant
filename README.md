# Prepnexa AI – Production-Ready AI Interview Platform

Prepnexa AI is a production-ready AI interview platform built using the MERN stack. It helps users practice technical and HR interviews through resume-based question generation, voice-enabled interview rounds, intelligent feedback, credit-based access, and online payments using Razorpay.

This is not a basic CRUD project. It is a SaaS-style full stack application focused on real-world architecture, authentication, payments, deployment, and polished user experience.

---

## 🚀 Live Demo

👉 **Live Project:**  
[Prepnexa AI Live Demo](https://prepnexa-ai-client.onrender.com/)

---

## ✨ Features

- Resume upload and analysis
- AI-generated interview questions
- Technical and HR interview modes
- Timed interview workflow
- Voice-based interview interaction
- Intelligent feedback after each answer
- Final interview performance report
- User interview history tracking
- Credit-based interview access system
- Razorpay payment integration
- Firebase Google authentication
- Smooth animations using Framer Motion
- Fully deployed MERN stack application

---

## 🛠 Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- Firebase Authentication
- Razorpay

### Deployment
- Render

---

## 📌 Project Highlights

- SaaS-style full stack architecture
- Resume-driven personalized interview generation
- Real-time interview simulation experience
- Voice input and AI voice output support
- Secure authentication and protected routes
- Credit & payment system for monetization
- Production-ready deployment structure
- Modern responsive UI with animations

---

## ⚙️ Workflow

### 1️⃣ Interview Setup
Users enter their target role, experience level, and preferred interview mode. They can also upload their resume for personalized interview generation.

### 2️⃣ AI Interview Round
The platform generates interview questions dynamically and conducts a timed interview session. Users can answer using voice or text, and AI provides feedback after every response.

### 3️⃣ Final Performance Report
After completing the interview, users receive:
- Performance summary
- AI-generated feedback
- Strengths and weaknesses analysis
- Areas for improvement

---

## 🔐 Authentication

This project uses Firebase Google Authentication for secure login and account management.

---

## 💳 Payments & Credits

Prepnexa AI includes a credit-based system where users can purchase interview credits using Razorpay to unlock interview sessions and premium features.

---

## 🌐 Deployment

The complete MERN stack application is deployed on Render.

Frontend:  
[Prepnexa AI Frontend](https://prepnexa-ai-client.onrender.com/)

---

## 📁 Folder Structure

```bash
client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── assets/
│   └── App.jsx

server/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
└── server.js
```

---

## 🔑 Environment Variables

### Client `.env`

```env
VITE_SERVER_URL=your_backend_url
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Server `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=your_frontend_url
JWT_SECRET=your_jwt_secret
```

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/prepnexa-ai.git
cd prepnexa-ai
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

### 4. Configure Environment Variables

Create `.env` files inside both `client` and `server` folders.

### 5. Run Backend Server

```bash
cd server
npm run dev
```

### 6. Run Frontend

```bash
cd client
npm run dev
```

---

## 🎯 Use Cases

- Interview preparation for students and job seekers
- Technical and HR interview practice
- Final year major project submission
- SaaS-style portfolio project
- Learning real-world MERN stack architecture
- Freelance startup product foundation

---

## 🚀 What Makes This Project Different

- Not a basic CRUD application
- AI-powered interview generation
- Resume-based personalized interview flow
- Combines authentication, payments, file uploads, reporting, and deployment
- Designed with a real product mindset
- Production-ready scalable architecture

---

## 🔮 Future Improvements

- Admin dashboard
- Multi-language interview support
- Advanced analytics and score visualization
- Company-specific mock interview modes
- Subscription plans
- Webcam-based interview simulation
- AI-generated coding interview rounds

