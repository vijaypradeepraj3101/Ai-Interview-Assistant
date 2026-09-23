# Prepnexa AI – Production-Ready AI Interview Platform

Prepnexa AI is a production-ready AI interview platform built using the MERN stack. It helps users practice technical and HR interviews through resume-based question generation, voice-enabled interview rounds, intelligent feedback, credit-based access, and online payments using Razorpay.

This is not a basic CRUD project. It is a SaaS-style full stack application focused on real-world architecture, authentication, payments, deployment, and polished user experience.

---

## Features

- Resume upload and analysis
- AI-generated interview questions
- Technical and HR interview modes
- Timed interview workflow
- Voice-based interview interaction
- Intelligent feedback after each answer
- Final interview report and performance review
- User interview history
- Credit-based usage system
- Razorpay payment integration
- Firebase Google authentication
- Smooth UI animations with Framer Motion
- Full stack deployment on Render

---

## Tech Stack

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

## Project Highlights

- Real SaaS-style full stack architecture
- Resume-driven personalized question generation
- Live interview simulation experience
- Voice input and AI voice output
- Secure authentication flow
- Credit and payment system for monetization
- Production deployment ready structure

---

## Workflow

### Step 1 – Interview Setup
Users enter their target role, experience level, and preferred interview mode. They can also upload a resume to make the interview more personalized.

### Step 2 – AI Interview Round
The platform generates interview questions and conducts a timed session. Users can answer using voice or text, and AI gives feedback after every response.

### Step 3 – Final Report
After the interview ends, the user receives a report with feedback, performance summary, and areas for improvement.

---

## Authentication

This project uses Firebase Google Authentication for secure user login and account access.

---

## Payments and Credits

The platform includes a credit-based access system where users can purchase credits using Razorpay. These credits are used to access interview sessions and premium features.

---

## Deployment

The full stack application is deployed on Render.

---

## Folder Structure

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

## Environment Variables

Create a `.env` file in both client and server directories.

### Client
```env
VITE_SERVER_URL=your_backend_url
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Server
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

## Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/prepnexa-ai.git
cd prepnexa-ai
```

### 2. Install frontend dependencies
```bash
cd client
npm install
```

### 3. Install backend dependencies
```bash
cd ../server
npm install
```

### 4. Add environment variables
Create `.env` files in both `client` and `server` folders.

### 5. Run backend
```bash
cd server
npm run dev
```

### 6. Run frontend
```bash
cd client
npm run dev
```

---

## Use Cases

- Interview practice for students and job seekers
- Technical and HR preparation
- Final year major project submission
- SaaS-style portfolio project
- Learning real-world MERN stack architecture
- Freelance product starter idea

---

## What Makes This Project Different

- Not a simple CRUD app
- Includes AI-powered logic and resume-based personalization
- Combines authentication, file upload, payments, reporting, and deployment
- Designed with a real product mindset instead of only tutorial-level implementation

---

## Future Improvements

- Add admin dashboard
- Add multi-language interview support
- Improve analytics and score visualization
- Add company-specific mock interview modes
- Add subscription plans
- Add webcam-based interview simulation

---

## Demo

Add your live project link here:

```md
[Live Demo](https://your-live-link.com)
```

---

## Author

**Manish Kumar**  
Full Stack Developer | MERN Stack Developer

---

## License

This project is for educational and portfolio use. You can add an official MIT License if you want open-source sharing.