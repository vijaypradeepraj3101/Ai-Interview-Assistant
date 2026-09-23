import React, { useState } from "react";
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      const name = user?.displayName || "User";
      const email = user?.email;

      if (!email) {
        throw new Error("Google account email not available");
      }

      const result = await axios.post(
        `${ServerUrl}/api/auth/google`,
        { name, email },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
    } catch (error) {
      console.error(error);
      dispatch(setUserData(null));
      setErrorMsg("Unable to continue with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full ${
        isModel
          ? "py-4"
          : "flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-6 py-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={`w-full overflow-hidden border bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${
          isModel
            ? "max-w-md rounded-3xl p-8 border-emerald-100 dark:border-slate-800"
            : "max-w-xl rounded-[32px] border-emerald-100 p-8 sm:p-10 md:p-12 dark:border-slate-800"
        }`}
      >
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
            <BsRobot size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Prepnexa AI
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI Interview Practice Platform
            </p>
          </div>
        </div>

        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <IoSparkles size={16} />
            Smart mock interviews for real placements
          </div>

          <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
            Continue with Google
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400 md:text-base">
            Sign in to start AI-powered interview practice, track performance,
            review detailed feedback, and improve with every session.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-800/70">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Resume-based
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Tailored interview flow
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-800/70">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              AI feedback
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Actionable score insights
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-800/70">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Progress history
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Track your improvement
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleGoogleAuth}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <FcGoogle size={20} />
          {loading ? "Signing you in..." : "Continue with Google"}
        </motion.button>

        {errorMsg && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {errorMsg}
          </div>
        )}

        <p className="mt-6 text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">
          By continuing, you agree to use Prepnexa AI for interview practice and
          personalized performance evaluation.
        </p>
      </motion.div>
    </div>
  );
}

export default Auth;