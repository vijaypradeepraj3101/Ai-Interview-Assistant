import React, { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import {
  BsStars,
  BsLightningCharge,
  BsShieldCheck,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedPlan, setSelectedPlan] =
    useState("pro");

  const [loadingPlan, setLoadingPlan] =
    useState(null);

  const [errorMsg, setErrorMsg] =
    useState("");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description:
        "A starter option for trying the platform and basic interview practice.",

      features: [
        "100 AI interview credits",
        "Basic performance report",
        "Voice interview access",
        "Limited history tracking",
      ],

      default: true,
    },

    {
      id: "starter",
      name: "Starter Pack",
      price: "₹50",
      credits: 200,

      description:
        "A simple pack for more interview attempts and better preparation.",

      features: [
        "200 AI interview credits",
        "Detailed feedback",
        "Performance analytics",
        "Full interview history",
      ],
    },

    {
      id: "pro",
      name: "Pro Pack",
      price: "₹100",
      credits: 500,

      description:
        "Built for serious preparation with better value and more interview practice.",

      features: [
        "500 AI interview credits",
        "Advanced AI feedback",
        "Skill trend analysis",
        "Priority AI processing",
      ],

      badge: "Best Value",
    },
  ];

  // PAYMENT FUNCTION
  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);
      setErrorMsg("");

      // PLAN AMOUNT
      const amount =
        plan.id === "starter"
          ? 50
          : plan.id === "pro"
          ? 100
          : 0;

      // CREATE ORDER
      const result = await axios.post(
        `${ServerUrl}/api/payment/order`,
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits,
        },
        {
          withCredentials: true,
        }
      );

      console.log(
        "ORDER RESPONSE:",
        result.data
      );

      // RAZORPAY OPTIONS
      const options = {
        key: import.meta.env
          .VITE_RAZORPAY_KEY_ID,

        amount: result.data.amount,

        currency: "INR",

        name: "Prepnexa AI",

        description: `${plan.name} - ${plan.credits} Credits`,

        order_id: result.data.id,

        handler: async function (
          response
        ) {
          try {
            console.log(
              "PAYMENT SUCCESS:",
              response
            );

            // VERIFY PAYMENT
            const verifyPay =
              await axios.post(
                `${ServerUrl}/api/payment/verify`,
                response,
                {
                  withCredentials: true,
                }
              );

            console.log(
              "VERIFY SUCCESS:",
              verifyPay.data
            );

            // UPDATE USER DATA
            dispatch(
              setUserData(
                verifyPay.data.user
              )
            );

            alert(
              "Payment Successful 🎉 Credits Added!"
            );

            navigate("/");
          } catch (err) {
            console.log(
              "VERIFY ERROR:",
              err
            );

            setErrorMsg(
              err?.response?.data
                ?.message ||
                "Payment verification failed"
            );
          }
        },

        theme: {
          color: "#10b981",
        },
      };

      // OPEN RAZORPAY
      const rzp =
        new window.Razorpay(options);

      // PAYMENT FAILED
      rzp.on(
        "payment.failed",
        function (response) {
          console.log(
            "PAYMENT FAILED:",
            response.error
          );

          setErrorMsg(
            response.error
              ?.description ||
              "Payment failed"
          );
        }
      );

      rzp.open();
    } catch (error) {
      console.log(
        "CREATE ORDER ERROR:",
        error
      );

      setErrorMsg(
        error?.response?.data
          ?.message ||
          "Unable to start payment"
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900 transition-colors duration-300 dark:bg-[#0b0f14] dark:text-white">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-14 flex items-start gap-4">
          <button
            onClick={() => navigate("/")}
            className="mt-2 rounded-full border border-slate-200 bg-white p-3 text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <FaArrowLeft />
          </button>

          <div className="w-full text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              Prepnexa AI credit plans
            </div>

            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Choose your plan
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
              Flexible credit packs for
              interview practice,
              smarter feedback, and
              consistent improvement.
            </p>
          </div>
        </div>

        {/* ERROR */}
        {errorMsg && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {errorMsg}
          </div>
        )}

        {/* CARDS */}
        <div className="grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const isSelected =
              selectedPlan === plan.id;

            return (
              <motion.div
                key={plan.id}
                whileHover={
                  !plan.default
                    ? { y: -4 }
                    : {}
                }
                onClick={() =>
                  !plan.default &&
                  setSelectedPlan(plan.id)
                }
                className={`relative rounded-[28px] border p-8 transition-all duration-300 ${
                  isSelected
                    ? "border-emerald-500 bg-white shadow-2xl dark:bg-white/10"
                    : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
                } ${
                  plan.default
                    ? "cursor-default"
                    : "cursor-pointer"
                }`}
              >
                {plan.badge && (
                  <div className="absolute right-6 top-6 rounded-full bg-emerald-600 px-4 py-1 text-xs font-medium text-white shadow">
                    {plan.badge}
                  </div>
                )}

                {plan.default && (
                  <div className="absolute right-6 top-6 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    Included
                  </div>
                )}

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {plan.name}
                </h3>

                <div className="mt-4">
                  <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {plan.price}
                  </span>

                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    {plan.credits} Credits
                  </p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {plan.description}
                </p>

                <div className="mt-6 space-y-3">
                  {plan.features.map(
                    (feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3"
                      >
                        <FaCheckCircle className="mt-0.5 text-sm text-emerald-500 dark:text-emerald-400" />

                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {feature}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {!plan.default && (
                  <button
                    disabled={
                      loadingPlan ===
                      plan.id
                    }
                    onClick={(e) => {
                      e.stopPropagation();

                      if (!isSelected) {
                        setSelectedPlan(
                          plan.id
                        );
                      } else {
                        handlePayment(
                          plan
                        );
                      }
                    }}
                    className={`mt-8 w-full rounded-2xl py-3 font-semibold transition ${
                      isSelected
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {loadingPlan ===
                    plan.id
                      ? "Processing..."
                      : isSelected
                      ? "Proceed to pay"
                      : "Select plan"}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
