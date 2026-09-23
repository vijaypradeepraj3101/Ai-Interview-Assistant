import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  FaFileUpload,
  FaRegFileAlt,
  FaBriefcase,
  FaUserTie,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Step1Setup({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userData) return;

    setRole(
      userData.role ||
        userData.targetRole ||
        userData.jobRole ||
        userData.profile?.role ||
        ""
    );

    setExperience(
      userData.experience ||
        userData.yearsOfExperience ||
        userData.profile?.experience ||
        ""
    );

    setMode(userData.interviewMode === "HR" ? "HR" : "Technical");

    if (Array.isArray(userData.skills) && userData.skills.length > 0) {
      setSkills(userData.skills);
    } else if (
      Array.isArray(userData.profile?.skills) &&
      userData.profile.skills.length > 0
    ) {
      setSkills(userData.profile.skills);
    }

    if (Array.isArray(userData.projects) && userData.projects.length > 0) {
      setProjects(userData.projects);
    } else if (
      Array.isArray(userData.profile?.projects) &&
      userData.profile.projects.length > 0
    ) {
      setProjects(userData.profile.projects);
    }
  }, [userData]);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;

    setError("");
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/resume`,
        formData,
        { withCredentials: true }
      );

      const parsedRole = result?.data?.role || "";
      const parsedExperience = result?.data?.experience || "";
      const parsedProjects = Array.isArray(result?.data?.projects)
        ? result.data.projects
        : [];
      const parsedSkills = Array.isArray(result?.data?.skills)
        ? result.data.skills
        : [];
      const parsedResumeText = result?.data?.resumeText || "";

      setRole(parsedRole);
      setExperience(parsedExperience);
      setProjects(parsedProjects);
      setSkills(parsedSkills);
      setResumeText(parsedResumeText);
      setAnalysisDone(true);
    } catch (error) {
      console.error("Resume upload error:", error);
      console.error("Resume upload response:", error?.response?.data);

      setError(
        error?.response?.data?.message || "Resume analysis failed. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    if (!role.trim() || !experience.trim() || loading) return;

    setError("");
    setLoading(true);

    const payload = {
      role: role.trim(),
      experience: experience.trim(),
      mode,
      resumeText: resumeText || "",
      projects: Array.isArray(projects) ? projects : [],
      skills: Array.isArray(skills) ? skills : [],
    };

    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/generate-questions`,
        payload,
        { withCredentials: true }
      );

      if (userData) {
        dispatch(
          setUserData({
            ...userData,
            role: payload.role,
            experience: payload.experience,
            interviewMode: payload.mode,
            skills: payload.skills,
            projects: payload.projects,
            credits: result?.data?.creditsLeft,
          })
        );
      }

      onStart(result.data);
    } catch (error) {
      console.error("Start interview error:", error);
      console.error("Start interview response:", error?.response?.data);

      setError(
        error?.response?.data?.message ||
          "Unable to start the interview right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[30px] bg-white text-slate-900 transition-colors dark:bg-[#050816] dark:text-white">
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/20" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/20" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:55px_55px] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />

      <div className="relative z-10 flex min-h-[720px] items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-6xl overflow-hidden rounded-[34px] border border-slate-200 bg-white/90 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_0_80px_rgba(16,185,129,0.08)]"
        >
          <div className="grid lg:grid-cols-[1.1fr_500px]">
            <div className="relative hidden border-r border-slate-200 bg-slate-50 lg:flex dark:border-white/10 dark:bg-transparent">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />

              <div className="relative flex flex-col justify-between p-10">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                    <HiSparkles />
                    AI Powered Interview Suite
                  </div>

                  <h1 className="max-w-lg text-5xl font-bold leading-[1.1] text-slate-900 dark:text-white">
                    Smart AI
                    <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-cyan-400">
                      {" "}
                      Interview Platform
                    </span>
                  </h1>

                  <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    Intelligent interview workflows with resume analysis,
                    adaptive AI questioning, technical evaluation, and
                    personalized interview experiences.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      <FaUserTie size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        AI Interview Sessions
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        Technical and HR interview rounds generated dynamically
                        with AI.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300">
                      <FaBriefcase size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Resume Intelligence
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        Analyze projects, skills and experience to create
                        personalized interview questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative p-6 sm:p-10">
              <div className="mx-auto max-w-md">
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
                    PREPNEXA AI
                  </p>

                  <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                    Interview Dashboard
                  </h2>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Configure your interview preferences to continue.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Target Role
                    </label>

                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Frontend Developer"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:bg-white/10 dark:focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Experience
                    </label>

                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Fresher / 2 Years"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:bg-white/10 dark:focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Interview Mode
                    </label>

                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-emerald-400 dark:focus:bg-white/10 dark:focus:ring-emerald-500/10"
                    >
                      <option value="Technical">Technical</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Resume Upload
                    </label>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group cursor-pointer rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 transition-all hover:border-emerald-400 hover:bg-emerald-50 dark:border-white/15 dark:bg-white/5 dark:hover:border-emerald-400/40 dark:hover:bg-emerald-500/5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-xl text-white shadow-lg">
                            {resumeFile ? <FaRegFileAlt /> : <FaFileUpload />}
                          </div>

                          <div>
                            <p className="max-w-[180px] truncate text-sm font-medium text-slate-900 dark:text-white">
                              {resumeFile ? resumeFile.name : "Upload Resume"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              PDF / DOC / DOCX
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUploadResume();
                          }}
                          disabled={!resumeFile || analyzing}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
                        >
                          {analyzing
                            ? "Analyzing..."
                            : analysisDone
                            ? "Re-analyze"
                            : "Analyze"}
                        </button>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      hidden
                      onChange={(e) =>
                        setResumeFile(e.target.files?.[0] || null)
                      }
                    />
                  </div>

                  {analysisDone && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-400/20 dark:bg-emerald-500/10"
                    >
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Resume analyzed successfully
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {skills.slice(0, 6).map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleStart}
                    disabled={!role.trim() || !experience.trim() || loading}
                    className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-4 text-sm font-semibold text-white transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Starting Interview..." : "Start Interview"}

                    {!loading && (
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    )}
                  </button>

                  <p className="pt-2 text-center text-xs text-slate-500 dark:text-slate-500">
                    Powered by intelligent AI interview workflows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Step1Setup;