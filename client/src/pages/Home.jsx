import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModel from "../components/AuthModel";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import {
  BsArrowRight,
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";

import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";

function Home() {
  const { userData } = useSelector((state) => state.user);

  const [showAuth, setShowAuth] = useState(false);

  const navigate = useNavigate();

  const handleProtectedRoute = (path) => {
    if (!userData) {
      setShowAuth(true);
      return;
    }

    navigate(path);
  };

  const workflowSteps = [
    {
      icon: <BsRobot size={20} />,
      step: "01",
      title: "Choose interview role",
      desc: "Select your target role and interview type.",
    },

    {
      icon: <BsMic size={20} />,
      step: "02",
      title: "Practice with AI",
      desc: "Answer technical and HR interview questions.",
    },

    {
      icon: <BsClock size={20} />,
      step: "03",
      title: "Improve every session",
      desc: "Review feedback and track your progress.",
    },
  ];

  const capabilities = [
    {
      icon: <BsBarChart size={20} />,
      title: "AI evaluation",
      desc: "Structured interview scoring and answer analysis.",
    },

    {
      icon: <BsFileEarmarkText size={20} />,
      title: "Resume-based questions",
      desc: "Questions generated from your skills and projects.",
    },

    {
      icon: <BsClock size={20} />,
      title: "Session tracking",
      desc: "Track interview history and improvement trends.",
    },

    {
      icon: <BsMic size={20} />,
      title: "Communication insights",
      desc: "Improve speaking confidence and delivery.",
    },
  ];

  const interviewModes = [
    {
      img: hrImg,
      title: "HR interview mode",
      desc: "Behavioral and recruiter-style interview preparation.",
    },

    {
      img: techImg,
      title: "Technical interview mode",
      desc: "Role-focused technical interview preparation.",
    },

    {
      img: confidenceImg,
      title: "Confidence insights",
      desc: "Improve speaking and communication quality.",
    },

    {
      img: creditImg,
      title: "Flexible credits",
      desc: "Simple usage-based interview sessions.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#020617] dark:text-white">

      <Navbar />

      <main className="px-6 pb-24 pt-3">

        {/* MAIN CONTAINER */}

        <div className="mx-auto max-w-6xl">

          {/* HERO SECTION */}

          <section className="relative overflow-hidden pb-24 pt-10">

            {/* BACKGROUND EFFECT */}

            <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl"></div>

            <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl"></div>

            {/* HERO GRID */}

            <div className="grid items-center gap-14 lg:grid-cols-2">

              {/* LEFT SIDE */}

              <div>

                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  AI-powered interview preparation
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mt-8 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-tight text-slate-900 dark:text-white lg:text-6xl"
                >
                  Practice smarter for your next interview
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="mt-8 max-w-2xl text-lg leading-9 text-slate-500 dark:text-slate-400"
                >
                  Practice technical and HR interviews with AI-powered feedback,
                  performance insights, and smarter interview preparation.
                </motion.p>

                {/* BUTTONS */}

                <div className="mt-10 flex flex-wrap gap-4">
                  <motion.button
                    onClick={() => handleProtectedRoute("/interview")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:bg-black dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-200"
                  >

                    Start interview

                    <BsArrowRight className="text-[15px]" />

                  </motion.button>

                  <motion.button
                    onClick={() => handleProtectedRoute("/history")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    View reports
                  </motion.button>

                </div>
              </div>

              {/* RIGHT SIDE */}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative"
              >

                <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_100px_rgba(15,23,42,0.10)] dark:border-slate-800 dark:bg-[#081225] dark:shadow-[0_20px_100px_rgba(0,0,0,0.45)]">

                  {/* TOP BAR */}

                  <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 dark:border-slate-800">

                    <div className="h-3 w-3 rounded-full bg-red-400"></div>

                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>

                    <div className="h-3 w-3 rounded-full bg-green-400"></div>

                  </div>

                  {/* CONTENT */}

                  <div className="space-y-5 p-6">

                    {/* AI QUESTION */}

                    <div className="rounded-3xl rounded-tl-md bg-slate-100 px-5 py-4 dark:bg-slate-800">

                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-emerald-500 dark:text-emerald-400">
                        Prepnexa AI
                      </p>

                      <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-200">
                        Explain useEffect in React.
                      </p>

                    </div>

                    {/* USER ANSWER */}

                    <div className="ml-auto max-w-[85%] rounded-3xl rounded-tr-md bg-emerald-500 px-5 py-4 text-slate-950">

                      <p className="text-xs font-semibold uppercase tracking-[0.15em]">
                        Your Response
                      </p>

                      <p className="mt-3 text-base leading-7">
                        useEffect handles side effects like API calls and DOM updates.
                      </p>

                    </div>

                    {/* FEEDBACK */}

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/70">

                      <div>

                        <p className="text-xs uppercase tracking-[0.15em] text-cyan-500 dark:text-cyan-400">
                          AI Feedback
                        </p>

                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          Clear and concise explanation
                        </p>

                      </div>

                      <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        Strong
                      </div>

                    </div>

                  </div>

                </div>

              </motion.div>

            </div>

          </section>

          {/* HOW IT WORKS */}

          <section className="py-28">

            <div className="max-w-2xl">

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                How it works
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                A simpler interview workflow
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-500 dark:text-slate-400">
                Focus on practice, feedback, and consistent improvement.
              </p>

            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">

              {workflowSteps.map((item, index) => (

                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-slate-200 bg-white p-7 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400">
                    {item.icon}
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                    Step {item.step}
                  </p>

                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </p>

                </motion.div>

              ))}

            </div>

          </section>

          {/* FEATURES */}

          <section className="py-28">

            <div className="max-w-2xl">

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Platform features
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Built for focused interview practice
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-500 dark:text-slate-400">
                Mock interviews, AI evaluation, session tracking, and detailed reports —
                designed to help you prepare with clarity.
              </p>

            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-2">

              {capabilities.map((item, index) => (

                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  className="rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-emerald-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60"
                >

                  <div className="flex items-start gap-5">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400">
                      {item.icon}
                    </div>

                    <div>

                      <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {item.title}
                      </h3>

                      <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </p>

                    </div>

                  </div>

                </motion.div>

              ))}

            </div>

          </section>

          {/* INTERVIEW MODES */}

          <section className="pb-20">

            <div className="mb-14 max-w-2xl">

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Interview modes
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Practice for different rounds
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-500 dark:text-slate-400">
                Switch between interview styles and improve specific parts of your preparation.
              </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {interviewModes.map((mode, index) => (

                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-5 transition-all duration-300 hover:border-emerald-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60"
                >

                  <div className="flex items-center gap-5">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">

                      <img
                        src={mode.img}
                        alt={mode.title}
                        className="h-7 w-7 object-contain"
                      />

                    </div>

                    <div>

                      <h3 className="font-semibold tracking-tight text-slate-900 dark:text-white">
                        {mode.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {mode.desc}
                      </p>

                    </div>

                  </div>

                  <BsArrowRight className="text-slate-400 transition duration-300 group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-slate-500 dark:group-hover:text-emerald-400" />

                </motion.div>

              ))}

            </div>

          </section>

        </div>

      </main>

      {showAuth && (
        <AuthModel onClose={() => setShowAuth(false)} />
      )}

      <Footer />

    </div>
  );
}

export default Home;