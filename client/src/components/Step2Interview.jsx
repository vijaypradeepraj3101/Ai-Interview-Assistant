import React, { useEffect, useMemo, useRef, useState } from "react";
import maleVideo from "../assets/videos/male-ai.mp4";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaWaveSquare,
  FaRegClock,
} from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";
import { HiSparkles } from "react-icons/hi2";

function Step2Interview({ interviewData, onFinish, isDarkMode = false }) {
  const { interviewId, questions = [], userName, mode } = interviewData || {};

  const [hasStarted, setHasStarted] = useState(false);
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [error, setError] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const answerRef = useRef("");
  const speakingRef = useRef(false);
  const utteranceRef = useRef(null);
  const finishingRef = useRef(false);

  const currentQuestion = questions[currentIndex];
  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const totalQuestions = questions.length || 0;
  const progressPercent = totalQuestions
    ? Math.round(((currentIndex + 1) / totalQuestions) * 100)
    : 0;

  const sectionLabel = useMemo(() => {
    const rawSection = currentQuestion?.section || currentQuestion?.category || "";
    if (rawSection) return rawSection;

    if (currentIndex === 0) return "Introduction";
    if ((mode || "").toLowerCase() === "hr") return "Behavioral Round";
    return "Technical Round";
  }, [currentQuestion, currentIndex, mode]);

  const statusLabel = useMemo(() => {
    if (isAIPlaying) return "AI speaking";
    if (isSubmitting || isTransitioning || isFinishing) return "Processing";
    if (!isMicOn) return "Mic paused";
    return "Listening";
  }, [isAIPlaying, isSubmitting, isTransitioning, isFinishing, isMicOn]);

  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  useEffect(() => {
    const speechRecognitionSupported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
    const speechSynthesisSupported = "speechSynthesis" in window;

    if (!speechRecognitionSupported || !speechSynthesisSupported) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!speechSupported || !window.speechSynthesis) return;

    const assignVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || !voices.length) return;

      const femaleVoice =
        voices.find((voice) => {
          const name = voice.name.toLowerCase();
          return (
            name.includes("zira") ||
            name.includes("samantha") ||
            name.includes("female")
          );
        }) || voices.find((voice) => voice.lang?.toLowerCase().includes("en"));

      const maleVoice = voices.find((voice) => {
        const name = voice.name.toLowerCase();
        return (
          name.includes("david") ||
          name.includes("mark") ||
          name.includes("male")
        );
      });

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
      } else if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
      } else {
        setSelectedVoice(voices[0]);
      }
    };

    assignVoices();
    window.speechSynthesis.onvoiceschanged = assignVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [speechSupported]);

  const stopMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  const startMic = () => {
    if (
      !speechSupported ||
      !recognitionRef.current ||
      isAIPlaying ||
      !isMicOn ||
      isSubmitting ||
      isTransitioning ||
      isFinishing
    ) {
      return;
    }

    try {
      recognitionRef.current.start();
    } catch {}
  };

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!speechSupported || !window.speechSynthesis || !text) {
        resolve();
        return;
      }

      try {
        window.speechSynthesis.cancel();
      } catch {}

      const utterance = new SpeechSynthesisUtterance(
        text.replace(/,/g, ", ").replace(/\./g, ". ")
      );

      utteranceRef.current = utterance;

      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.lang = selectedVoice?.lang || "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        speakingRef.current = true;
        setIsAIPlaying(true);
        stopMic();
        setSubtitle(text);
        videoRef.current?.play?.().catch(() => {});
      };

      utterance.onend = () => {
        speakingRef.current = false;
        setIsAIPlaying(false);
        videoRef.current?.pause?.();
        if (videoRef.current) videoRef.current.currentTime = 0;

        if (isMicOn && !isTransitioning && !isSubmitting && !isFinishing) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          utteranceRef.current = null;
          resolve();
        }, 250);
      };

      utterance.onerror = () => {
        speakingRef.current = false;
        setIsAIPlaying(false);
        setSubtitle("");
        videoRef.current?.pause?.();
        if (videoRef.current) videoRef.current.currentTime = 0;
        utteranceRef.current = null;
        resolve();
      };

      try {
        setTimeout(() => {
          try {
            window.speechSynthesis.speak(utterance);
          } catch {
            resolve();
          }
        }, 80);
      } catch {
        resolve();
      }
    });
  };

  useEffect(() => {
    if (!speechSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript?.trim() || "";

      if (transcript) {
        setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };

    recognition.onerror = () => {};

    recognition.onend = () => {
      if (
        isMicOn &&
        !speakingRef.current &&
        !feedback &&
        !isSubmitting &&
        !isTransitioning &&
        !isFinishing
      ) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
        recognition.abort();
      } catch {}
    };
  }, [speechSupported, isMicOn, feedback, isSubmitting, isTransitioning, isFinishing]);

  useEffect(() => {
    if (!hasStarted || isIntroPhase || !currentQuestion) return;
    setTimeLeft(currentQuestion.timeLimit || 60);
  }, [hasStarted, isIntroPhase, currentIndex, currentQuestion]);

  useEffect(() => {
    if (!hasStarted || isIntroPhase || !currentQuestion || feedback || isTransitioning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isIntroPhase, currentQuestion, feedback, isTransitioning]);

  const beginInterview = async () => {
    setError("");
    setHasStarted(true);

    await speakText(
      `Hi ${userName || "there"}, welcome to Prepnexa AI. We will begin your ${
        mode === "HR" ? "HR" : mode === "Mixed" ? "mixed" : "technical"
      } interview now.`
    );

    await speakText(
      "Please answer clearly and keep your response structured. We will go one question at a time."
    );

    setIsIntroPhase(false);

    setTimeout(async () => {
      if (questions[0]?.question) {
        await speakText(questions[0].question);
      }
    }, 400);
  };

  useEffect(() => {
    if (!hasStarted || isIntroPhase || !currentQuestion || currentIndex === 0) return;

    const askCurrentQuestion = async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));

      if (currentIndex === questions.length - 1) {
        await speakText("This is your final question. Take your time and answer clearly.");
      }

      await speakText(currentQuestion.question);
    };

    askCurrentQuestion();
  }, [hasStarted, isIntroPhase, currentIndex, currentQuestion, questions.length]);

  useEffect(() => {
    if (!hasStarted || isIntroPhase || !currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback && !isTransitioning) {
      submitAnswer(true);
    }
  }, [timeLeft, hasStarted, isIntroPhase, currentQuestion, isSubmitting, feedback, isTransitioning]);

  useEffect(() => {
    return () => {
      stopMic();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleMic = () => {
    setIsMicOn((prev) => {
      const next = !prev;
      if (!next) {
        stopMic();
      } else {
        setTimeout(() => startMic(), 0);
      }
      return next;
    });
  };

  const finishInterview = async () => {
    if (finishingRef.current) return;

    finishingRef.current = true;
    stopMic();
    setIsMicOn(false);
    setError("");
    setIsFinishing(true);

    try {
      await speakText(
        `Thank you ${userName || "there"}. That was the end of your interview. Please wait while I prepare your final report.`
      );

      const result = await axios.post(
        `${ServerUrl}/api/interview/finish`,
        { interviewId },
        { withCredentials: true }
      );

      onFinish(result.data);
    } catch (err) {
      console.error(err);
      setError("Could not finish the interview. Please try again.");
      finishingRef.current = false;
    } finally {
      setIsFinishing(false);
    }
  };

  const moveToNextQuestion = async () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setError("");
    setSubtitle("");

    const isLastQuestion = currentIndex + 1 >= questions.length;

    if (isLastQuestion) {
      await finishInterview();
      setIsTransitioning(false);
      return;
    }

    await speakText("Let us move to the next question.");

    setAnswer("");
    setFeedback("");
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(false);
  };

  const submitAnswer = async (isAutoSubmit = false) => {
    if (isSubmitting || !currentQuestion || isTransitioning) return;

    if (!answerRef.current.trim()) {
      if (isAutoSubmit) {
        setAnswer("No answer provided.");
        answerRef.current = "No answer provided.";
      } else {
        setError("Please answer the current question before submitting.");
        return;
      }
    }

    stopMic();
    setError("");
    setIsSubmitting(true);

    try {
      const finalAnswer = answerRef.current.trim() || "No answer provided.";

      const result = await axios.post(
        `${ServerUrl}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentIndex,
          answer: finalAnswer,
          timeTaken: Math.max(0, (currentQuestion.timeLimit || 60) - timeLeft),
        },
        { withCredentials: true }
      );

      const receivedFeedback =
        result?.data?.feedback || "Your answer has been submitted.";
      setFeedback(receivedFeedback);

      await speakText(receivedFeedback);
      await moveToNextQuestion();
    } catch (err) {
      console.error(err);
      setError("Answer submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const theme = {
    page: isDarkMode
      ? "min-h-screen bg-[#070b11] text-white"
      : "min-h-screen bg-[#f8fafc] text-slate-900",
    shell: isDarkMode
      ? "overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1118] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
      : "overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]",
    leftBorder: isDarkMode
      ? "border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10"
      : "border-b border-slate-200 lg:border-b-0 lg:border-r lg:border-slate-200",
    badge: isDarkMode
      ? "mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300"
      : "mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700",
    videoWrap: isDarkMode
      ? "overflow-hidden rounded-[20px] border border-white/10 bg-black"
      : "overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100",
    mutedLabel: isDarkMode
      ? "text-[11px] uppercase tracking-[0.16em] text-slate-500"
      : "text-[11px] uppercase tracking-[0.16em] text-slate-500",
    strongText: isDarkMode ? "text-sm font-medium text-white/90" : "text-sm font-medium text-slate-800",
    sectionLine: isDarkMode
      ? "grid grid-cols-2 gap-6 border-y border-white/8 py-4"
      : "grid grid-cols-2 gap-6 border-y border-slate-200 py-4",
    timerCard: isDarkMode
      ? "rounded-[20px] border border-white/8 bg-white/[0.025] px-4 py-4"
      : "rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4",
    timerInner: isDarkMode
      ? "flex items-center justify-center rounded-[18px] bg-[#06090f] px-4 py-5"
      : "flex items-center justify-center rounded-[18px] bg-white px-4 py-5",
    titleWrap: isDarkMode
      ? "mb-8 border-b border-white/10 pb-6"
      : "mb-8 border-b border-slate-200 pb-6",
    eyebrow: isDarkMode
      ? "text-xs font-semibold uppercase tracking-[0.26em] text-emerald-400"
      : "text-xs font-semibold uppercase tracking-[0.26em] text-emerald-600",
    title: isDarkMode
      ? "mt-3 text-[30px] font-semibold tracking-[-0.02em] text-white"
      : "mt-3 text-[30px] font-semibold tracking-[-0.02em] text-slate-900",
    desc: isDarkMode
      ? "mt-2 max-w-2xl text-sm leading-7 text-slate-400"
      : "mt-2 max-w-2xl text-sm leading-7 text-slate-600",
    startCard: isDarkMode
      ? "rounded-[22px] border border-white/8 bg-white/[0.025] p-6"
      : "rounded-[22px] border border-slate-200 bg-slate-50 p-6",
    startText: isDarkMode
      ? "max-w-xl text-sm leading-7 text-slate-300"
      : "max-w-xl text-sm leading-7 text-slate-600",
    questionCard: isDarkMode
      ? "rounded-[22px] border border-white/8 bg-white/[0.02] p-5 sm:p-6"
      : "rounded-[22px] border border-slate-200 bg-slate-50 p-5 sm:p-6",
    questionMeta: isDarkMode
      ? "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"
      : "text-xs font-semibold uppercase tracking-[0.16em] text-slate-500",
    questionText: isDarkMode
      ? "text-base font-semibold leading-8 text-white sm:text-[18px]"
      : "text-base font-semibold leading-8 text-slate-900 sm:text-[18px]",
    answerLabel: isDarkMode ? "text-sm font-medium text-slate-200" : "text-sm font-medium text-slate-700",
    answerCount: isDarkMode ? "text-xs text-slate-500" : "text-xs text-slate-500",
    textarea: isDarkMode
      ? "h-[260px] w-full resize-none rounded-[20px] border border-white/8 bg-[#0d141d] p-4 text-[15px] leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:bg-[#101925] sm:h-[320px] sm:p-5 disabled:opacity-70"
      : "h-[260px] w-full resize-none rounded-[20px] border border-slate-200 bg-white p-4 text-[15px] leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white sm:h-[320px] sm:p-5 disabled:opacity-70",
    sessionText: isDarkMode ? "pt-5 text-center text-xs text-slate-500" : "pt-5 text-center text-xs text-slate-500",
  };

  return (
    <div className={theme.page}>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={theme.shell}
        >
          <div className="grid lg:grid-cols-[420px_minmax(0,1fr)]">
            <div className={theme.leftBorder}>
              <div className="p-6 sm:p-8">
                <div className={theme.badge}>
                  <HiSparkles />
                  Live interview
                </div>

                <div className={theme.videoWrap}>
                  <video
                    src={videoSource}
                    key={videoSource}
                    ref={videoRef}
                    muted
                    playsInline
                    preload="auto"
                    className="aspect-[4/4.7] w-full object-cover"
                  />
                </div>

                <div className="mt-5 space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className={theme.mutedLabel}>Progress</p>
                      <p className={theme.strongText}>
                        {Math.min(currentIndex + 1, totalQuestions || 1)} / {totalQuestions}
                      </p>
                    </div>

                    <div className={isDarkMode ? "h-1.5 overflow-hidden rounded-full bg-white/10" : "h-1.5 overflow-hidden rounded-full bg-slate-200"}>
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className={theme.sectionLine}>
                    <div>
                      <p className={theme.mutedLabel}>Section</p>
                      <p className={`mt-2 ${theme.strongText}`}>{sectionLabel}</p>
                    </div>

                    <div>
                      <p className={theme.mutedLabel}>Status</p>
                      <p
                        className={`mt-2 inline-flex items-center gap-2 text-sm font-medium ${
                          statusLabel === "AI speaking"
                            ? "text-emerald-500"
                            : statusLabel === "Processing"
                            ? "text-amber-500"
                            : statusLabel === "Mic paused"
                            ? isDarkMode
                              ? "text-slate-300"
                              : "text-slate-600"
                            : "text-cyan-500"
                        }`}
                      >
                        <FaWaveSquare className="text-[11px]" />
                        {statusLabel}
                      </p>
                    </div>
                  </div>

                  <div className={theme.timerCard}>
                    <div className="mb-3 flex items-center justify-between">
                      <span className={theme.mutedLabel}>Time remaining</span>
                      <span className={isDarkMode ? "inline-flex items-center gap-2 text-[11px] font-medium text-slate-400" : "inline-flex items-center gap-2 text-[11px] font-medium text-slate-500"}>
                        <FaRegClock className="text-[11px]" />
                        {currentQuestion?.timeLimit || 60}s limit
                      </span>
                    </div>

                    <div className={theme.timerInner}>
                      <Timer
                        timeLeft={timeLeft}
                        totalTime={currentQuestion?.timeLimit || 60}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  </div>

                  {subtitle && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={isDarkMode
                        ? "rounded-[18px] border border-emerald-400/15 bg-emerald-500/5 px-4 py-4"
                        : "rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-4"}
                    >
                      <p className={isDarkMode
                        ? "text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300"
                        : "text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700"}>
                        AI speaking
                      </p>
                      <p className={isDarkMode
                        ? "mt-2 text-sm leading-7 text-emerald-100"
                        : "mt-2 text-sm leading-7 text-emerald-900"}>
                        {subtitle}
                      </p>
                    </motion.div>
                  )}

                  {!speechSupported && (
                    <div className={isDarkMode
                      ? "rounded-[18px] border border-amber-400/20 bg-amber-500/5 px-4 py-4 text-sm leading-7 text-amber-200"
                      : "rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-800"}>
                      Voice features are limited in this browser. You can still type and submit answers manually.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mx-auto max-w-2xl">
                <div className={theme.titleWrap}>
                  <p className={theme.eyebrow}>PREPNEXA AI</p>

                  <h2 className={theme.title}>Interview Session</h2>

                  <p className={theme.desc}>
                    Answer each question clearly and stay concise. Your response is submitted one question at a time, followed by AI feedback and automatic progression to the next question.
                  </p>
                </div>

                {!hasStarted ? (
                  <div className={theme.startCard}>
                    <p className={theme.startText}>
                      Your interview is ready. Once you begin, the interviewer will ask questions, review each response, and continue automatically until the session is complete.
                    </p>

                    <button
                      onClick={beginInterview}
                      className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
                    >
                      Begin Interview
                    </button>
                  </div>
                ) : (
                  <>
                    {!isIntroPhase && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={theme.questionCard}
                      >
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                          <p className={theme.questionMeta}>
                            Question {currentIndex + 1} of {questions.length}
                          </p>

                          <span className={isDarkMode
                            ? "rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300"
                            : "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"}>
                            {sectionLabel}
                          </span>
                        </div>

                        <div className={theme.questionText}>
                          {currentQuestion?.question}
                        </div>

                        {currentIndex === questions.length - 1 && (
                          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-amber-500">
                            Final question
                          </p>
                        )}
                      </motion.div>
                    )}

                    <div className="pt-6">
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <p className={theme.answerLabel}>Your answer</p>
                          <p className={theme.answerCount}>
                            {answer.trim().length} characters
                          </p>
                        </div>

                        <textarea
                          placeholder="Start speaking or type your answer here..."
                          onChange={(e) => {
                            setAnswer(e.target.value);
                            if (error) setError("");
                          }}
                          value={answer}
                          disabled={isSubmitting || isTransitioning || isFinishing}
                          className={theme.textarea}
                        />
                      </div>

                      {error && (
                        <div className={isDarkMode
                          ? "mt-4 rounded-[18px] border border-red-400/20 bg-red-500/5 px-4 py-4 text-sm text-red-300"
                          : "mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"}>
                          {error}
                        </div>
                      )}

                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={isDarkMode
                            ? "mt-5 rounded-[18px] border border-emerald-400/20 bg-emerald-500/5 px-4 py-4"
                            : "mt-5 rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-4"}
                        >
                          <p className={isDarkMode
                            ? "text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300"
                            : "text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700"}>
                            AI feedback
                          </p>
                          <p className={isDarkMode
                            ? "mt-2 text-sm leading-7 text-slate-100"
                            : "mt-2 text-sm leading-7 text-slate-700"}>
                            {feedback}
                          </p>
                          <p className={isDarkMode
                            ? "mt-3 text-xs text-emerald-200/80"
                            : "mt-3 text-xs text-emerald-700/80"}>
                            Moving to the next question automatically...
                          </p>
                        </motion.div>
                      )}

                      {!feedback && (
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <motion.button
                            onClick={toggleMic}
                            whileTap={{ scale: 0.96 }}
                            disabled={isSubmitting || isTransitioning || isFinishing}
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              isDarkMode
                                ? isMicOn
                                  ? "border-white/10 bg-white/10 text-white hover:bg-white/15"
                                  : "border-white/10 bg-slate-700 text-white hover:bg-slate-600"
                                : isMicOn
                                ? "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                                : "border-slate-200 bg-slate-200 text-slate-700 hover:bg-slate-300"
                            }`}
                            aria-label={isMicOn ? "Mute microphone" : "Enable microphone"}
                          >
                            {isMicOn ? (
                              <FaMicrophone size={18} />
                            ) : (
                              <FaMicrophoneSlash size={18} />
                            )}
                          </motion.button>

                          <motion.button
                            onClick={() => submitAnswer(false)}
                            disabled={isSubmitting || !currentQuestion || isTransitioning || isFinishing}
                            whileTap={{ scale: 0.98 }}
                            className={isDarkMode
                              ? "flex-1 rounded-2xl bg-white py-3.5 text-sm font-semibold text-black transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                              : "flex-1 rounded-2xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"}
                          >
                            {isSubmitting
                              ? "Submitting answer..."
                              : isTransitioning
                              ? "Moving to next question..."
                              : isFinishing
                              ? "Finishing interview..."
                              : "Submit Answer"}
                          </motion.button>
                        </div>
                      )}

                      <p className={theme.sessionText}>
                        {userName ? `${userName}` : "Candidate"} session active
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Step2Interview;
