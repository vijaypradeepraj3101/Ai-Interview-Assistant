import React from "react";
import { BsRobot, BsGithub, BsTwitterX, BsLinkedin } from "react-icons/bs";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#f8fafc] px-6 py-12 transition-colors duration-300 dark:border-slate-800 dark:bg-[#020617]">

      <div className="mx-auto max-w-6xl">

        {/* TOP SECTION */}

        <div className="grid gap-12 md:grid-cols-2 md:items-start">

          {/* LEFT */}

          <div>

            {/* LOGO */}

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950">
                <BsRobot size={18} />
              </div>

              <div>

                <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  Prepnexa AI
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  AI interview preparation platform
                </p>

              </div>

            </div>

            {/* DESCRIPTION */}

            <p className="mt-5 max-w-md text-[15px] leading-7 text-slate-600 dark:text-slate-300">
              Practice technical and HR interviews with AI-powered feedback,
              smarter evaluation, and structured preparation designed for
              placements.
            </p>

            {/* SOCIAL LINKS */}

            <div className="mt-6 flex items-center gap-3">

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-emerald-500/30 dark:hover:text-emerald-400"
              >
                <BsGithub size={16} />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-emerald-500/30 dark:hover:text-emerald-400"
              >
                <BsLinkedin size={16} />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-emerald-500/30 dark:hover:text-emerald-400"
              >
                <BsTwitterX size={16} />
              </a>

            </div>

          </div>

          {/* RIGHT */}

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">

            {/* PLATFORM */}

            <div>

              <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white">
                Platform
              </h3>

              <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">

                <Link
                  to="/"
                  className="block transition hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Home
                </Link>

                <Link
                  to="/interview"
                  className="block transition hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Start Interview
                </Link>

                <Link
                  to="/history"
                  className="block transition hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Reports
                </Link>

              </div>

            </div>

            {/* FEATURES */}

            <div>

              <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white">
                Features
              </h3>

              <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">

                <p>AI feedback</p>

                <p>Resume questions</p>

                <p>Performance tracking</p>

              </div>

            </div>

            {/* SUPPORT */}

            <div>

              <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white">
                Support
              </h3>

              <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">

                <p>Help center</p>

                <p>Privacy</p>

                <p>Terms</p>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM SECTION */}

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 Prepnexa AI. Practice better, perform smarter.
          </p>

          <p>
            Built for placement preparation and interview confidence.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;