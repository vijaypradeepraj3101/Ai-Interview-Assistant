import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import Auth from "../pages/Auth";

function AuthModel({ onClose }) {

  const { userData } = useSelector((state) => state.user);

  const modalRef = useRef(null);

  useEffect(() => {

    if (userData) {
      onClose();
    }

  }, [userData, onClose]);

  useEffect(() => {

    const handleKeyDown = (event) => {

      if (event.key === "Escape") {
        onClose();
      }

    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {

      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "auto";

    };

  }, [onClose]);

  const handleOverlayClick = (event) => {

    if (
      modalRef.current &&
      !modalRef.current.contains(event.target)
    ) {
      onClose();
    }

  };

  return (

    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
    >

      {/* MODAL */}

      <div
        ref={modalRef}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
        aria-label="Authentication modal"
      >

        {/* CLOSE BUTTON */}

        <button
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-black dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
        >

          <FaTimes size={13} />

        </button>

        {/* CONTENT */}

        <div className="max-h-[90vh] overflow-y-auto">

          <Auth isModel={true} />

        </div>

      </div>

    </div>

  );
}

export default AuthModel;