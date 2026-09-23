import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Timer({ timeLeft = 0, totalTime = 60, isDarkMode = false }) {
  const safeTotal = totalTime > 0 ? totalTime : 60;
  const safeTimeLeft = Math.max(timeLeft, 0);
  const percentage = Math.min((safeTimeLeft / safeTotal) * 100, 100);

  let pathColor = "#10b981";
  let textColor = isDarkMode ? "#f8fafc" : "#0f172a";
  let trailColor = isDarkMode ? "#1e293b" : "#e5e7eb";
  let statusText = "Time remaining";
  let statusClass = isDarkMode
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
    : "border-emerald-200 bg-emerald-50 text-emerald-700";

  if (safeTimeLeft <= 10) {
    pathColor = "#ef4444";
    textColor = isDarkMode ? "#fca5a5" : "#dc2626";
    statusText = "Ending soon";
    statusClass = isDarkMode
      ? "border-red-500/20 bg-red-500/10 text-red-300"
      : "border-red-200 bg-red-50 text-red-700";
  } else if (safeTimeLeft <= 20) {
    pathColor = "#f59e0b";
    textColor = isDarkMode ? "#fcd34d" : "#d97706";
    statusText = "Be concise";
    statusClass = isDarkMode
      ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
      : "border-amber-200 bg-amber-50 text-amber-700";
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-[26px] border p-4 shadow-sm ${
          isDarkMode
            ? "border-slate-800 bg-slate-950/70"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className="h-24 w-24 sm:h-28 sm:w-28"
          role="img"
          aria-label={`${safeTimeLeft} seconds remaining out of ${safeTotal} seconds`}
        >
          <CircularProgressbar
            value={percentage}
            text={`${safeTimeLeft}s`}
            styles={buildStyles({
              textSize: "18px",
              pathColor,
              textColor,
              trailColor,
              strokeLinecap: "round",
            })}
          />
        </div>
      </div>

      <div
        className={`mt-3 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusClass}`}
      >
        {statusText}
      </div>
    </div>
  );
}

export default Timer;