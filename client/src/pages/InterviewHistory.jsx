import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { BsBarChart, BsClockHistory, BsArrowRight } from "react-icons/bs";
import { ServerUrl } from "../App";

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const result = await axios.get(
          `${ServerUrl}/api/interview/get-interview`,
          { withCredentials: true }
        );

        setInterviews(result.data || []);
      } catch (error) {
        console.error(error);
        setErrorMsg("Unable to load your interview history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getMyInterviews();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 8) {
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
    }
    if (score >= 5) {
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
    }
    return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300";
  };

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
    }
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto w-[92vw] max-w-6xl">
        <div className="mb-10 flex flex-wrap items-start gap-4">
          <button
            onClick={() => navigate("/")}
            className="mt-1 rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FaArrowLeft />
          </button>

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <BsClockHistory size={15} />
              Prepnexa AI session archive
            </div>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              Interview history
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Review your past interviews, scores, and detailed performance reports.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <div className="h-5 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div className="h-4 w-32 rounded bg-slate-100 dark:bg-slate-800"></div>
                    <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-12 w-20 rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
                    <div className="h-8 w-24 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : errorMsg ? (
          <div className="rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm dark:border-red-500/20 dark:bg-slate-900">
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Something went wrong
            </p>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Try again
            </button>
          </div>
        ) : interviews.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              <BsBarChart size={22} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              No interviews yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Your completed interview sessions and reports will appear here.
              Start your first practice session to build your performance history.
            </p>
            <button
              onClick={() => navigate("/interview")}
              className="mt-6 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
            >
              Start interview
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {interviews.map((item, index) => (
              <div
                key={item._id || index}
                onClick={() => navigate(`/report/${item._id}`)}
                className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Session {index + 1}
                      </span>

                      <span
                        className={`rounded-full px-4 py-1 text-xs font-medium capitalize ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status || "pending"}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {item.role || "Interview session"}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {item.experience || "Experience not specified"} •{" "}
                      {item.mode || "General mode"}
                    </p>

                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div
                      className={`rounded-2xl px-5 py-3 text-center ${getScoreColor(
                        item.finalScore || 0
                      )}`}
                    >
                      <p className="text-xl font-bold">
                        {item.finalScore || 0}/10
                      </p>
                      <p className="text-xs font-medium">Overall score</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition group-hover:text-emerald-600 dark:text-slate-300 dark:group-hover:text-emerald-400">
                      View report
                      <BsArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewHistory;