// src/components/StudentFlow.jsx
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ---------------------------
   Motion / style utilities
---------------------------- */
const stepVariants = {
  initial: { opacity: 0, x: 30, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -30, scale: 0.98 },
};
const stepTransition = { type: "tween", duration: 0.28, ease: "easeInOut" };

// Unified gradient CTA — fast, snappy hover
const ctaGradient =
  "bg-gradient-to-r from-cyan-500 to-indigo-500 " +
  "hover:from-cyan-400 hover:to-indigo-400 " +
  "text-white rounded-full shadow-lg hover:shadow-xl " +
  "transition-[transform,box-shadow,background-position,opacity] duration-150 ease-out " +
  "will-change-transform";

// Reusable Back / Back-to-home style
const backBtnBase =
  "inline-flex items-center justify-center rounded-full border text-sm " +
  "px-4 py-2 transition-[background-color,color,box-shadow,transform] duration-150 ease-out " +
  "border-blue-700 text-blue-700 hover:text-white hover:bg-blue-700 " +
  "shadow-sm hover:shadow-md";

export default function StudentFlow() {
  const [role] = useState("student");
  const [level, setLevel] = useState("");
  const [step, setStep] = useState("intro");

  const [subject, setSubject] = useState("");
  const [topicDetails, setTopicDetails] = useState("");
  const [time, setTime] = useState("");
  const [ampm, setAmPm] = useState("AM");
  const [days, setDays] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [canCall, setCanCall] = useState(false);

  const [studySubjects, setStudySubjects] = useState("");
  const [studyOptions, setStudyOptions] = useState({
    memory: false,
    learner: false,
    ai: false,
    combo: false,
    all: false,
  });

  const handleOptionChange = (option) => {
    setStudyOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("topicDetails", topicDetails);
    formData.append("time", `${time} ${ampm}`);
    formData.append("days", days);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("studySubjects", studySubjects);
    formData.append("studyOptions", JSON.stringify(studyOptions));
    formData.append("role", role);
    formData.append("level", level);
    formData.append("canCall", canCall ? "Yes" : "No");

    await fetch("https://formspree.io/f/xblonwwg", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    }).then((response) => {
      if (response.ok) {
        window.location.replace("/thank-you.html");
      } else {
        alert("Something went wrong. Please try again.");
      }
    });
  };

  /* ---------------------------
     Progress bar calculation
  ---------------------------- */
  const stepOrder = useMemo(
    () => [
      "intro",
      "select-level",
      "highschool-options",
      "highschool-test",
      "highschool-master",
      "highschool-study",
      "college-options",
      "college-test",
      "college-master",
      "college-study",
      "time-selection",
      "final-info",
    ],
    []
  );

  const currentIndex = Math.max(0, stepOrder.indexOf(step));
  const totalSteps = stepOrder.length;
  const progressPct = Math.round((currentIndex / (totalSteps - 1)) * 100);

  return (
  <div className="relative min-h-screen flex flex-col overflow-hidden">
    {/* Animated gradient background */}
    <motion.div
      aria-hidden
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: "100% 50%" }}
      transition={{
        duration: 18,
        repeat: Infinity,
        repeatType: "reverse", // smooth ping-pong, no snap
        ease: "linear",
      }}
      className="pointer-events-none absolute inset-0 -z-10
                 bg-gradient-to-r from-cyan-300 via-indigo-300 to-violet-300
                 bg-[length:200%_200%]"
    />

    {/* Subtle vignette */}
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(255,255,255,0.35),transparent)]" />

    {/* Top bar (sticky, safe-area-aware, mobile-safe) */}
    <div
      className="
        sticky top-0 z-50 w-full shadow-md
        bg-[linear-gradient(to_right,_#06b6d4,_#199bb8,_#06b6d4)]
        pt-[env(safe-area-inset-top)]
      "
    >
      {/* bar content row */}
      <div className="flex items-center h-12 sm:h-14 px-2 sm:px-4 w-full">
        {/* Left button */}
        <a
          href="/"
          className="
            inline-flex items-center gap-1.5
            h-8 sm:h-9
            rounded-full border border-white/80
            px-3 sm:px-4
            text-xs sm:text-sm font-medium
            text-white/95 bg-white/0
            hover:bg-white hover:text-cyan-700 hover:shadow-md
            transition-colors
          "
          style={{ lineHeight: "1.25rem" }} /* keeps text vertically crisp */
        >
          ← Back to Home
        </a>
      </div>
</div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-7xl items-start">
          {/* Left: Form card */}
          <div className="relative bg-white/80 backdrop-blur rounded-2xl w-full p-8 sm:p-10 shadow-xl ring-1 ring-black/10 overflow-hidden">
            {/* Card accent glow */}
            <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-[radial-gradient(500px_200px_at_-10%_-10%,rgba(34,211,238,0.18),transparent),radial-gradient(400px_200px_at_110%_120%,rgba(139,92,246,0.18),transparent)]" />

            {/* Progress bar (no step text) */}
            <div className="relative mb-6">
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500"
                  style={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {step === "intro" && (
                <motion.div
                  key="intro"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={stepTransition}
                  className="relative w-full"
                >
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome, fellow student!
                  </h1>
                  <p className="text-lg text-gray-700 mb-2">
                    I’m here to support you in your academic journey and help you succeed.
                  </p>
                  <p className="text-base text-gray-600 mb-8">
                    You’ll answer a few quick questions so I can put together a personalized plan.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "tween", duration: 0.12 }}
                    onClick={() => setStep("select-level")}
                    className={`w-full text-lg py-4 ${ctaGradient}`}
                  >
                    Let’s Get Started !!
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -1, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "tween", duration: 0.12 }}
                    onClick={() => (window.location.href = "/")}
                    className={backBtnBase + " mt-6"}
                  >
                    &larr; Back to Home
                  </motion.button>
                </motion.div>
              )}

              {step === "select-level" && (
                <motion.div
                  key="select-level"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={stepTransition}
                  className="relative w-full"
                >
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    What grade level are you in?
                  </h1>

                  <div className="flex flex-col items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "tween", duration: 0.12 }}
                      onClick={() => {
                        setLevel("High School");
                        setStep("highschool-options");
                      }}
                      className={`w-80 sm:w-96 text-lg py-4 ${ctaGradient}`}
                    >
                      High School
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "tween", duration: 0.12 }}
                      onClick={() => {
                        setLevel("College");
                        setStep("college-options");
                      }}
                      className={`w-80 sm:w-96 text-lg py-4 ${ctaGradient}`}
                    >
                      College
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ y: -1, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "tween", duration: 0.12 }}
                    onClick={() => setStep("intro")}
                    className={backBtnBase + " mt-8"}
                  >
                    &larr; Back
                  </motion.button>
                </motion.div>
              )}

              {/* Shared template for HS/College branches */}
              {["highschool", "college"].map((lvl) => (
                <React.Fragment key={`frag-${lvl}`}>
                  {["options", "test", "master", "study"].map((type) => {
                    const stepKey = `${lvl}-${type}`;
                    if (step !== stepKey) return null;

                    return (
                      <motion.div
                        key={`step-${stepKey}`}
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={stepTransition}
                        className="relative w-full"
                      >
                        {type === "options" && (
                          <>
                            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                              How can I help you succeed?
                            </h1>

                            <div className="flex flex-col items-center space-y-6">
                              <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "tween", duration: 0.12 }}
                                onClick={() => setStep(`${lvl}-master`)}
                                className={`w-80 sm:w-96 text-lg py-4 ${ctaGradient}`}
                              >
                                Master a Subject
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "tween", duration: 0.12 }}
                                onClick={() => setStep(`${lvl}-test`)}
                                className={`w-80 sm:w-96 text-lg py-4 ${ctaGradient}`}
                              >
                                Prepare for a Test
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "tween", duration: 0.12 }}
                                onClick={() => setStep(`${lvl}-study`)}
                                className={`w-80 sm:w-96 text-lg py-4 ${ctaGradient}`}
                              >
                                Build Stronger Study Skills
                              </motion.button>
                            </div>

                            <motion.button
                              whileHover={{ y: -1, scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "tween", duration: 0.12 }}
                              onClick={() => setStep("select-level")}
                              className={backBtnBase + " mt-6"}
                            >
                              &larr; Back
                            </motion.button>
                          </>
                        )}

                        {type === "test" && (
                          <>
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                              What subject will the test be on?
                            </h1>

                            <input
                              type="text"
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              placeholder={lvl === "college" ? "e.g., Gen Chem, Stats" : "e.g., Algebra II, Chemistry"}
                              className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg mb-4"
                            />
                            <textarea
                              value={topicDetails}
                              onChange={(e) => setTopicDetails(e.target.value)}
                              placeholder="Optional: Describe the topic or chapters"
                              className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg mb-6 resize-none"
                            />

                            <motion.button
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "tween", duration: 0.12 }}
                              onClick={() => setStep("time-selection")}
                              className={`w-full text-lg py-3 ${ctaGradient}`}
                            >
                              Next
                            </motion.button>

                            <motion.button
                              whileHover={{ y: -1, scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "tween", duration: 0.12 }}
                              onClick={() => setStep(`${lvl}-options`)}
                              className={backBtnBase + " mt-4"}
                            >
                              &larr; Back
                            </motion.button>
                          </>
                        )}

                        {type === "master" && (
                          <>
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                              Which subject would you like help with?
                            </h1>

                            <input
                              type="text"
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              placeholder={lvl === "college" ? "e.g., Gen Chem, Biochem, Calculus" : "e.g., Algebra, Biology, Chemistry"}
                              className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg mb-4"
                            />
                            <textarea
                              value={topicDetails}
                              onChange={(e) => setTopicDetails(e.target.value)}
                              placeholder="Optional: Describe the topic or chapters"
                              className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg mb-6 resize-none"
                            />

                            <motion.button
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "tween", duration: 0.12 }}
                              onClick={() => setStep("time-selection")}
                              className={`w-full text-lg py-3 ${ctaGradient}`}
                            >
                              Next
                            </motion.button>

                            <motion.button
                              whileHover={{ y: -1, scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "tween", duration: 0.12 }}
                              onClick={() => setStep(`${lvl}-options`)}
                              className={backBtnBase + " mt-4"}
                            >
                              &larr; Back
                            </motion.button>
                          </>
                        )}

                        {type === "study" && (
                          <>
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                              Which types of subjects are you studying?
                            </h1>

                            <textarea
                              value={studySubjects}
                              onChange={(e) => setStudySubjects(e.target.value)}
                              placeholder="e.g., Math, Biology, Psychology"
                              className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg mb-6 resize-none"
                            />

                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                              Which of these strategies are you interested in:
                            </h2>

                            <div className="space-y-4 mb-6">
                              {[
                                ["memory", "Discover new memory techniques"],
                                ["learner", "Understand my personal learning style"],
                                ["ai", "Learn to create practice tests using AI tools"],
                                ["combo", "Combine study strategies into one personalized plan"],
                              ].map(([key, label]) => (
                                <motion.label
                                  key={key}
                                  whileTap={{ scale: 0.98 }}
                                  className="flex items-center gap-3 text-lg text-gray-800"
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!studyOptions[key]}
                                    onChange={() => handleOptionChange(key)}
                                    className="h-5 w-5 accent-cyan-600"
                                  />
                                  {label}
                                </motion.label>
                              ))}
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "tween", duration: 0.12 }}
                              onClick={() => setStep("time-selection")}
                              className={`w-full text-lg py-3 ${ctaGradient}`}
                            >
                              Next
                            </motion.button>

                            <motion.button
                              whileHover={{ y: -1, scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "tween", duration: 0.12 }}
                              onClick={() =>
                                setStep(step === "highschool-study" ? "highschool-options" : "college-options")
                              }
                              className={backBtnBase + " mt-4"}
                            >
                              &larr; Back
                            </motion.button>
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </React.Fragment>
              ))}

              {step === "time-selection" && (
                <motion.div
                  key="time-selection"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={stepTransition}
                  className="relative w-full"
                >
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Which days work best for tutoring?
                  </h1>

                  <textarea
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="e.g., Mondays and Wednesdays"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg mb-6 resize-none"
                  />

                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Which times of the day do you prefer?
                  </h1>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-4 mb-6">
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g., 4:00"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg"
                    />
                    <select
                      value={ampm}
                      onChange={(e) => setAmPm(e.target.value)}
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "tween", duration: 0.12 }}
                    onClick={() => setStep("final-info")}
                    className={`w-full text-lg py-3 ${ctaGradient}`}
                  >
                    Next
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -1, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "tween", duration: 0.12 }}
                    onClick={() =>
                      setStep(
                        subject
                          ? subject.match(/chem|bio|math|calc|stat|phys|org/i)
                            ? "college-master"
                            : "highschool-master"
                          : "select-level"
                      )
                    }
                    className={backBtnBase + " mt-4"}
                  >
                    &larr; Back
                  </motion.button>
                </motion.div>
              )}

              {step === "final-info" && (
                <motion.div
                  key="final-info"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={stepTransition}
                  className="relative w-full"
                >
                  <form onSubmit={handleSubmit}>
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                      Your Contact Information
                    </h1>

                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg mb-4"
                    />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg mb-4"
                    />

                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your Phone Number"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg mb-4"
                    />

                    <label className="flex items-center text-lg mb-6">
                      <input
                        type="checkbox"
                        name="Can I call you?"
                        className="mr-3 h-5 w-5 accent-cyan-600"
                        checked={canCall}
                        onChange={(e) => setCanCall(e.target.checked)}
                      />
                      Would you like to receive a phone call?
                    </label>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "tween", duration: 0.12 }}
                      type="submit"
                      className={`w-full text-lg py-3 ${ctaGradient}`}
                    >
                      Submit
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -1, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "tween", duration: 0.12 }}
                      onClick={() => setStep("time-selection")}
                      type="button"
                      className={backBtnBase + " mt-4"}
                    >
                      &larr; Back
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Visual / points */}
          <div className="w-full">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <motion.img
                src="/Pic2.jpg"
                alt="Tutoring Screenshot"
                whileHover={{ rotate: 1.5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="rounded-2xl shadow-2xl ring-4 ring-cyan-300/30"
              />
              {/* soft glow behind image */}
              <div className="pointer-events-none absolute -inset-4 rounded-3xl blur-2xl bg-cyan-300/20" />
            </motion.div>

            <ul className="mt-6 list-none space-y-4 text-lg text-gray-800">
              {[
                "Personalized tutoring helps you master tough topics faster.",
                "Build confidence with problem-solving reps and targeted feedback.",
                "Learn study/test strategies that actually stick for exam day.",
              ].map((t, i) => (
                <li
                  key={i}
                  className="relative pl-7 before:content-[''] before:absolute before:left-0 before:top-2 before:h-3 before:w-3 before:rounded-full before:bg-gradient-to-r before:from-cyan-500 before:to-violet-500"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <footer className="bg-gray-200/80 backdrop-blur text-center text-sm text-gray-700 py-4">
        &copy; {new Date().getFullYear()} Top Level Tutoring. All rights reserved.
      </footer>
    </div>
  );
}