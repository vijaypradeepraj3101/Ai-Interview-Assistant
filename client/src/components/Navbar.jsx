import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { BsRobot, BsCoin, BsMoonStars, BsSun } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navbarRef = useRef(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else if (storedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!navbarRef.current?.contains(event.target)) {
        setShowCreditPopup(false);
        setShowUserPopup(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${ServerUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCreditClick = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }

    setShowCreditPopup((prev) => !prev);
    setShowUserPopup(false);
  };

  const handleUserClick = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }

    setShowUserPopup((prev) => !prev);
    setShowCreditPopup(false);
  };

  const userInitial = userData?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <div className="sticky top-0 z-50 flex justify-center bg-[#f5f7fb]/80 px-4 pt-5 backdrop-blur-md dark:bg-slate-950/80">
        <motion.div
          ref={navbarRef}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative flex w-full max-w-6xl items-center justify-between rounded-[24px] border border-emerald-100 bg-white/95 px-4 py-4 shadow-[0_10px_30px_rgba(16,24,40,0.08)] md:px-6 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-left"
            aria-label="Go to homepage"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-md">
              <BsRobot size={18} />
            </div>

            <div className="hidden md:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                AI Interview Platform
              </p>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Prepnexa AI
              </h1>
            </div>
          </button>

          <div className="relative flex items-center gap-3 md:gap-4">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-yellow-300 dark:hover:bg-slate-700"
            >
              {darkMode ? <BsSun size={18} /> : <BsMoonStars size={18} />}
            </button>

            <div className="relative">
              <button
                onClick={handleCreditClick}
                aria-label="Open credits menu"
                aria-haspopup="dialog"
                aria-expanded={showCreditPopup}
                className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
              >
                <BsCoin size={18} />
                <span>{userData?.credits ?? 0}</span>
              </button>

              {showCreditPopup && (
                <div className="absolute right-0 z-50 mt-3 w-72 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Credit balance
                  </p>
                  <p className="mb-4 text-sm leading-6 text-gray-600 dark:text-slate-300">
                    Use credits to unlock interview sessions, practice rounds, and detailed AI feedback.
                  </p>
                  <button
                    onClick={() => {
                      setShowCreditPopup(false);
                      navigate("/pricing");
                    }}
                    className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-black dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                  >
                    Buy credits
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={handleUserClick}
                aria-label="Open user menu"
                aria-haspopup="menu"
                aria-expanded={showUserPopup}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
              >
                {userData ? userInitial : <FaUserAstronaut size={15} />}
              </button>

              {showUserPopup && (
                <div className="absolute right-0 z-50 mt-3 w-64 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {userData?.name}
                  </p>
                  <p className="mb-4 text-xs text-gray-500 dark:text-slate-400">
                    Manage your account, credits, and interview activity
                  </p>

                  <button
                    onClick={() => {
                      setShowUserPopup(false);
                      navigate("/history");
                    }}
                    className="mb-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-black dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <FaHistory size={14} />
                    Interview History
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    <HiOutlineLogout size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default Navbar;