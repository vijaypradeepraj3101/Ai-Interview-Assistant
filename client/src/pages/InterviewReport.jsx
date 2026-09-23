import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { ServerUrl } from "../App";
import Step3Report from "../components/Step3Report";

function InterviewReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const result = await axios.get(
          `${ServerUrl}/api/interview/report/${id}`,
          { withCredentials: true }
        );

        setReport(result.data);
      } catch (error) {
        console.error(error);
        setErrorMsg("We could not load this interview report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    } else {
      setLoading(false);
      setErrorMsg("Invalid report link.");
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-full border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <FaArrowLeft className="text-slate-300 dark:text-slate-600" />
            </div>

            <div>
              <div className="h-7 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6">
              <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                <div className="mx-auto mt-5 h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="mx-auto mt-3 h-3 w-44 rounded bg-slate-100 dark:bg-slate-800"></div>
              </div>

              <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="h-5 w-36 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="mt-5 space-y-4">
                  <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800"></div>
                  <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800"></div>
                  <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800"></div>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="mt-6 h-64 rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
              </div>

              <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="h-5 w-44 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="mt-6 space-y-5">
                  <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
                  <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
                  <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="w-full max-w-lg rounded-[32px] border border-red-100 bg-white p-8 text-center shadow-xl dark:border-red-500/20 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300">
            <FaExclamationTriangle />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Unable to load report
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {errorMsg}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/history")}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Back to history
            </button>

            <button
              onClick={() => window.location.reload()}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Step3Report report={report} />;
}

export default InterviewReport;