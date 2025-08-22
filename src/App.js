import StudentFlow from "./components/StudentFlow";
import ParentFlow from "./components/ParentFlow";
import { Typewriter } from 'react-simple-typewriter'
import TypewriterList from './components/TypewriterList'
import { useState, useRef, useEffect, useMemo } from "react";
import { motion,  useMotionValue, useTransform, useSpring, useReducedMotion } from "framer-motion";
import {
  Info,
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  Play,
  Calculator,
  Clock,
  BookOpenCheck,
  Circle,
  RefreshCw,
  ClipboardList,
  ArrowRight,
  ArrowDownRight,
} from "lucide-react";


function NextStepBar({
  label = "Next: Watch a 2-minute overview",
  target = "#video",
  className = "",
}) {
  const onClick = (e) => {
    e.preventDefault();
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.button
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 " +
        "text-sm font-semibold shadow-sm transition-colors " +
        // default (light area)
        "border-slate-900/10 bg-white/70 text-slate-800 backdrop-blur hover:bg-white/90 " +
        className
      }
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <span>{label}</span>
      <ArrowDownRight className="h-4 w-4" />
    </motion.button>
  );
}

function SoftParticles({ count = 16, className = "" }) {
  const prefersReduced = useReducedMotion();
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: 140 + Math.random() * 200,
        dur: 12 + Math.random() * 10,
        delay: -Math.random() * 8,
        hue: Math.random(),
        drift: (Math.random() - 0.5) * 40,
      })),
    [count]
  );

  const pickColor = (h) =>
    h < 0.33
      ? "rgba(34,211,238,0.35)"
      : h < 0.66
      ? "rgba(59,130,246,0.32)"
      : "rgba(168,85,247,0.32)";

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden mix-blend-screen ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      {seeds.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-2xl"
          style={{
            left: `${s.x * 100}%`,
            top: `${s.y * 100}%`,
            width: s.size,
            height: s.size,
            background: pickColor(s.hue),
            mixBlendMode: "screen",
          }}
          initial={false}
          animate={
            prefersReduced
              ? undefined
              : { y: [0, -20, 0, 24, 0], x: [0, s.drift, 0], opacity: [0.3, 0.55, 0.4, 0.5, 0.3] }
          }
          transition={prefersReduced ? undefined : { duration: s.dur, delay: s.delay, ease: "easeInOut", repeat: Infinity }}
        />
      ))}
    </div>
  );
}

/* =======================
   1-Minute Readiness Quiz
   ======================= */
function ReadinessQuiz({ visible = false, onStudent, onParent, innerRef }) {
  // --- Questions (edit freely) ---
  const questions = useMemo(() => ([
    {
      id: "q1",
      icon: <Calculator className="h-5 w-5" />,
      text: "How confident do you feel with your current math/science class?",
      options: [
        { value: "high", label: "Very confident" },
        { value: "medium", label: "Somewhat confident" },
        { value: "low", label: "Not confident yet" },
      ],
    },
    {
      id: "q2",
      icon: <Clock className="h-5 w-5" />,
      text: "How often do you complete homework on time?",
      options: [
        { value: "always", label: "Always" },
        { value: "usually", label: "Usually" },
        { value: "rarely", label: "Sometimes/rarely" },
      ],
    },
    {
      id: "q3",
      icon: <BookOpenCheck className="h-5 w-5" />,
      text: "What best describes your study routine?",
      options: [
        { value: "system", label: "I have a system and schedule" },
        { value: "some", label: "I study but inconsistently" },
        { value: "none", label: "I cram / not sure how to study" },
      ],
    },
    {
      id: "q4",
      icon: <Calculator className="h-5 w-5" />,
      text: "When you get stuck on a problem, what happens next?",
      options: [
        { value: "strategy", label: "I try strategies and usually solve it" },
        { value: "ask", label: "I ask a friend/teacher or look it up" },
        { value: "stuck", label: "I get stuck and move on" },
      ],
    },
    {
      id: "q5",
      icon: <Clock className="h-5 w-5" />,
      text: "Time until next test/major assignment?",
      options: [
        { value: "soon", label: "This week" },
        { value: "near", label: "Within 2–3 weeks" },
        { value: "far", label: "A month or more" },
      ],
    },
    {
      id: "q6",
      icon: <BookOpenCheck className="h-5 w-5" />,
      text: "Biggest help you want from tutoring right now?",
      options: [
        { value: "content", label: "Understanding content" },
        { value: "practice", label: "Practice & problem-solving" },
        { value: "skills", label: "Study/test strategies & planning" },
      ],
    },
  ]), []);

  // --- State ---
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const total = questions.length;

  // save/restore (optional)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("quiz-answers") || "{}");
      if (saved && saved.answers && saved.step >= 0) {
        setAnswers(saved.answers);
        setStep(Math.min(saved.step, total - 1));
      }
    } catch {}
  }, [total]);

  useEffect(() => {
    localStorage.setItem("quiz-answers", JSON.stringify({ answers, step }));
  }, [answers, step]);

  const current = questions[step];
  const progress = Math.round((step / total) * 100);

  function select(value) {
    setAnswers(a => ({ ...a, [current.id]: value }));
  }
  function next() {
    if (step < total - 1) setStep(s => s + 1);
  }
  function back() {
    if (step > 0) setStep(s => s - 1);
  }
  function reset() {
    setAnswers({});
    setStep(0);
    localStorage.removeItem("quiz-answers");
  }

  // --- Scoring (simple bands) ---
  const score = useMemo(() => {
    const weights = {
      high: 0, medium: 1, low: 2,
      always: 0, usually: 1, rarely: 2,
      system: 0, some: 1, none: 2,
      strategy: 0, ask: 1, stuck: 2,
      soon: 2, near: 1, far: 0
    };
    return Object.entries(answers).reduce((sum, [, v]) => sum + (weights[v] ?? 0), 0);
  }, [answers]);

  const done = Object.keys(answers).length === total;

  let band = "Explorer", color = "from-emerald-500 to-cyan-500", msg = "You’re in good shape—let’s sharpen with targeted practice and a study blueprint.";
  if (score >= 4 && score <= 7) { band = "Momentum Builder"; color = "from-cyan-500 to-indigo-500"; msg = "You’ll benefit from consistent problem-solving reps + structured weekly goals."; }
  if (score >= 8) { band = "Launch Support"; color = "from-indigo-500 to-violet-500"; msg = "Let’s stabilize the foundation quickly and build confident test-day habits."; }

  return (
    <section
      id="quiz"
      ref={innerRef}
      className={
        "relative bg-[linear-gradient(to_right,_#c7d2fe,_#e9d5ff,_#bae6fd)] transition-all duration-300 " +
        (visible
          ? "py-14 sm:py-16 opacity-100 translate-y-0"
          : "py-0 opacity-0 -translate-y-1 pointer-events-none h-0 overflow-hidden")
      }
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-[980px] px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-900">1-Minute Readiness Quiz</h2>
        <div className="mx-auto mt-3 mb-8 h-1 w-28 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full" />

        {/* progress */}
        <div className="relative h-2 w-full rounded-full bg-white/60 ring-1 ring-white/60 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* card */}
        {!done ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-6 rounded-2xl bg-white/80 backdrop-blur ring-1 ring-black/10 shadow-xl p-5 sm:p-7"
          >
            <div className="flex items-center gap-3 text-slate-900">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                {current.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">{current.text}</h3>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {current.options.map(opt => {
                const selected = answers[current.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => select(opt.value)}
                    className={`group rounded-xl px-4 py-3 text-left font-medium ring-1 transition
                      ${selected
                        ? "bg-cyan-600 text-white ring-cyan-600 shadow-lg"
                        : "bg-white/70 ring-slate-300 hover:bg-white"}`}
                    aria-pressed={selected}
                  >
                    <span className="inline-flex items-center gap-2">
                      {selected ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5 text-slate-400" />}
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={back}
                disabled={step === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/70 ring-1 ring-slate-300 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <div className="text-sm text-slate-600">Question {step + 1} of {total}</div>

              <button
                onClick={next}
                disabled={answers[current.id] == null}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto]"
          >
            {/* result card */}
            <div className="rounded-2xl bg-white/85 backdrop-blur ring-1 ring-black/10 shadow-xl p-6">
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white bg-gradient-to-r ${color}`}>
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold">{band}</span>
              </div>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">Your best next step</h3>
              <p className="mt-2 text-slate-700">{msg}</p>

              <ul className="mt-4 space-y-2 text-slate-800">
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" /> 1:1 tutoring tailored to your current unit</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" /> Weekly micro-goals + check-ins</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" /> Study/test strategies that stick</li>
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="/schedule-session.html"
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-5 py-3 font-semibold text-white hover:bg-cyan-500"
                >
                  Book your free hour
                </a>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 ring-1 ring-slate-300"
                >
                  <RefreshCw className="h-4 w-4" /> Retake
                </button>
              </div>

              {/* NEW: route to student/parent flows */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={onStudent}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-700 hover:bg-indigo-800 px-5 py-3 font-semibold text-white hover:bg-slate-900"
                >
                  I’m a Student
                </button>
                <button
                  onClick={onParent}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-700 hover:bg-indigo-800 px-5 py-3 font-semibold text-white hover:bg-slate-900"
                >
                  I’m a Parent
                </button>
              </div>
            </div>

            {/* quick summary tile */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-white/70 to-white/40 ring-1 ring-black/10 backdrop-blur">
              <div className="text-sm font-semibold text-slate-700">Your responses</div>
              <div className="mt-3 space-y-2 text-slate-800">
                {questions.map(q => (
                  <div key={q.id} className="flex items-start gap-2">
                    <span className="mt-0.5 text-slate-400">•</span>
                    <div className="min-w-0">
                      <div className="font-medium">{q.text}</div>
                      <div className="text-sm text-slate-600">
                        {q.options.find(o => o.value === answers[q.id])?.label ?? "—"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
// --- Quiz teaser button (desktop pill, click => open quiz) ---
function QuizTeaserCard({ className = "", onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={
        `block w-72 mx-auto rounded-full px-6 py-4 text-white font-semibold
         bg-gradient-to-r from-cyan-600 to-indigo-700
         shadow-[0_10px_30px_-10px_rgba(59,130,246,0.55)]
         hover:from-cyan-500 hover:to-indigo-600
         focus:outline-none focus:ring-2 focus:ring-cyan-400 text-center
         ${className}`
      }
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Main Row */}
      <span className="flex items-center justify-center gap-2 leading-none">
        <ClipboardList className="h-5 w-5 opacity-90" />
        <span>1-Minute Readiness Quiz</span>
        <ArrowRight className="h-4 w-4 opacity-90" />
      </span>
      {/* Subtext */}
      <span className="block text-xs font-normal opacity-90 mt-1">
        See how prepared you are !
      </span>
    </motion.button>
  );
}
function PizazzButton({
  children,
  onClick,
  icon: Icon,
  className = "",
}) {
  const prefersReduced = useReducedMotion();

  // mouse tracking for “magnetic” tilt + glow
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rx = useTransform(my, [ -1, 1 ], [ 6, -6 ]); // rotateX
  const ry = useTransform(mx, [ -1, 1 ], [ -8, 8 ]); // rotateY
  const srx = useSpring(rx, { stiffness: 200, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18, mass: 0.4 });

  function handleMouseMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;  // 0..1
    const y = (e.clientY - r.top) / r.height;  // 0..1
    mx.set((x - 0.5) * 2); // -1..1
    my.set((y - 0.5) * 2);
    // expose to CSS for glow position
    e.currentTarget.style.setProperty("--x", `${x * 100}%`);
    e.currentTarget.style.setProperty("--y", `${y * 100}%`);
  }

  function handleMouseLeave(e) {
    mx.set(0); my.set(0);
    e.currentTarget.style.setProperty("--x", "50%");
    e.currentTarget.style.setProperty("--y", "50%");
  }

  return (
    <motion.div
      className={`relative rounded-full p-[2px] w-72 ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(34,211,238,0.9), rgba(59,130,246,0.9), rgba(168,85,247,0.9))",
        boxShadow: "0 10px 30px -10px rgba(59,130,246,0.55)",
      }}
      whileHover={prefersReduced ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      <motion.button
        type="button"
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative w-full rounded-full px-6 py-4 bg-slate-950/70 text-white font-semibold
                   ring-1 ring-white/15 backdrop-blur-md overflow-hidden"
        style={
          prefersReduced
            ? undefined
            : { rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }
        }
        whileTap={prefersReduced ? { scale: 0.98 } : { scale: 0.98, y: 0 }}
      >
        {/* pointer-follow glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-0 rounded-[inherit] opacity-60"
          style={{
            background:
              "radial-gradient(140px 90px at var(--x,50%) var(--y,50%), rgba(34,211,238,.35), transparent 60%)",
            mixBlendMode: "screen",
          }}
        />

        {/* shine sweep */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/15"
          initial={false}
          whileHover={prefersReduced ? undefined : { x: "150%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ filter: "blur(4px)" }}
        />

        <span className="relative z-10 flex items-center justify-center gap-2">
          {Icon && <Icon className="h-5 w-5 opacity-90" />}
          <span>{children}</span>
        </span>
      </motion.button>
    </motion.div>
  );
}


export default function App() {
const [showStudentFlow, setShowStudentFlow] = useState(false);
const [showParentFlow, setShowParentFlow] = useState(false);
const [navOpen, setNavOpen] = useState(false);
const [showQuiz, setShowQuiz] = useState(false);
const quizRef = useRef(null);

// when showQuiz flips true, scroll to the quiz section after it mounts
useEffect(() => {
  if (showQuiz && quizRef.current) {
    // let the DOM paint, then scroll
    requestAnimationFrame(() => {
      quizRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}, [showQuiz]);

if (showStudentFlow) return <StudentFlow />;
if (showParentFlow) return <ParentFlow />;



function BrandFlip({ className = "" }) {
  const [flipped, setFlipped] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <a
      href="/"
      aria-label="Top Level Tutoring — home"
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
    >
      <motion.span
        className="block whitespace-nowrap"
        style={{ perspective: 1000, transformStyle: "preserve-3d" }}
        animate={prefersReduced ? { opacity: 1 } : { rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {/* FRONT */}
        <span className="absolute inset-0 [backface-visibility:hidden]">
          <span className="text-slate-900">Top </span>
          <span className="text-cyan-700">Level </span>
          <span className="text-slate-900">Tutoring</span>
        </span>
        {/* BACK */}
        <span className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent drop-shadow-sm">
            Empower • Learn • Succeed !!
          </span>
        </span>
        {/* Spacer to reserve width */}
        <span className="invisible">Top Level Tutoring</span>
      </motion.span>
    </a>
  );
}

// =====================
// NavLinkFancy (BOLDER)
// =====================
function NavLinkFancy({ href, children }) {
  const prefersReduced = useReducedMotion();

  return (
  
    <motion.a
      href={href}
      className="relative inline-flex items-center px-1 py-1 text-[15px] font-medium text-white
                 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2
                 focus-visible:ring-offset-cyan-700 rounded"
      initial={false}
      whileHover={prefersReduced ? undefined : { y: -3, scale: 1.05 }}
      whileFocus={prefersReduced ? undefined : { y: -3, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
    >
      {/* Text */}
      <span className="relative z-10">{children}</span>

      {/* Underline */}
      <motion.span
        aria-hidden="true"
        className="absolute left-0 right-0 -bottom-1 h-[3px] rounded-full bg-cyan-300
                   shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        initial={{ scaleX: 0 }}
        whileHover={prefersReduced ? undefined : { scaleX: 1 }}
        whileFocus={prefersReduced ? undefined : { scaleX: 1 }}
        style={{ originX: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
      />

      {/* Glow */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-md"
        initial={{ opacity: 0, scale: 0.9 }}
        whileHover={prefersReduced ? undefined : { opacity: 0.4, scale: 1.1 }}
        whileFocus={prefersReduced ? undefined : { opacity: 0.4, scale: 1.1 }}
        transition={{ duration: 0.25 }}
        style={{
          background:
            "radial-gradient(40px 20px at center, rgba(34,211,238,0.45), transparent 70%)",
        }}
      />
    </motion.a>
  );
}
  return (
    <div className="font-sans text-gray-800">
      {/* LBCC-style Navbar (mobile-first, desktop preserved) */}
<header className="relative z-[100] bg-[linear-gradient(to_right,_#06b6d4,_#0e7490,_#06b6d4)] border-b border-cyan-700 text-white">
  <div className="mx-auto w-full md:max-w-none px-3 md:px-0">
    {/* Desktop / tablet bar */}
    <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center h-16">
      <div className="justify-self-start md:pl-16">
  <BrandFlip className="font-extrabold tracking-tight text-[24px] lg:text-[26px]" />
</div>
    

      {/* Nav (center) */}
      <nav className="flex items-center gap-8 text-[15px] font-medium drop-shadow-sm">
  <NavLinkFancy href="#about">About</NavLinkFancy>
  <NavLinkFancy href="#services">Services</NavLinkFancy>
  <NavLinkFancy href="#contact">Contact</NavLinkFancy>
</nav>

      {/* Socials + CTA (right) — nudge left */}
      <div className="ml-auto flex items-center gap-4 justify-end pr-3 md:pr-4 shrink-0">
        <a
          href="https://www.instagram.com/ariekeuning"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <img src="/icons/instagram.svg" className="h-6 w-6 opacity-80 hover:opacity-100" alt="" />
        </a>
        <a
          href="https://www.facebook.com/ariekeuning"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <img src="/icons/facebook.svg" className="h-6 w-6 opacity-80 hover:opacity-100" alt="" />
        </a>
        <a
          href="https://www.linkedin.com/in/arie-keuning-370636139"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <img src="/icons/linkedin.svg" className="h-6 w-6 opacity-80 hover:opacity-100" alt="" />
        </a>
        <a
          href="/schedule-session.html"
          className="hidden lg:inline-flex items-center rounded-full bg-cyan-600 px-4 py-2 text-white font-semibold hover:bg-cyan-700 shadow-sm"
        >
          Free hour
        </a>
      </div>
    </div>

    {/* Mobile bar */}
    <div className="md:hidden flex items-center justify-between h-16">
      <a href="/" className="font-extrabold tracking-tight text-[20px]">
        <span className="text-slate-900">Top </span>
        <span className="text-cyan-700">Level </span>
        <span className="text-slate-900">Tutoring</span>
      </a>
      <button
        onClick={() => setNavOpen(true)}
        aria-label="Open menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900/10 hover:bg-slate-900/15"
      >
        {/* hamburger */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" className="text-slate-800" />
        </svg>
      </button>
    </div>
  </div>

  {/* Mobile drawer – keep your existing polished version below unchanged */}
  {navOpen && (
    <div className="md:hidden fixed inset-0 z-[60]">
      <button
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        onClick={() => setNavOpen(false)}
        aria-label="Close menu"
      />
      <aside className="absolute right-0 top-0 h-full w-[86%] max-w-[420px] bg-white shadow-2xl rounded-l-2xl ring-1 ring-slate-900/10 overflow-hidden">
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/70">
          <span className="font-extrabold tracking-tight text-[20px]">
            <span className="text-slate-900">Top </span>
            <span className="text-cyan-700">Level </span>
            <span className="text-slate-900">Tutoring</span>
          </span>
          <button
            onClick={() => setNavOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-900/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <nav className="py-2 divide-y divide-slate-200/70">
          <div className="px-2 py-2 space-y-1">
            <a
              href="#about"
              onClick={() => setNavOpen(false)}
              className="block px-4 py-3 rounded-xl text-[17px] text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
            >
              About
            </a>
            <a
              href="#services"
              onClick={() => setNavOpen(false)}
              className="block px-4 py-3 rounded-xl text-[17px] text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
            >
              Services
            </a>
            <a
              href="#contact"
              onClick={() => setNavOpen(false)}
              className="block px-4 py-3 rounded-xl text-[17px] text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
            >
              Contact
            </a>
          </div>

          <div className="px-4 py-3 flex items-center gap-3">
            <a
              href="https://www.instagram.com/ariekeuning"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
            >
              <img src="/icons/instagram.svg" alt="" className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com/ariekeuning"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
            >
              <img src="/icons/facebook.svg" alt="" className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/arie-keuning-370636139"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
            >
              <img src="/icons/linkedin.svg" alt="" className="h-5 w-5" />
            </a>
          </div>
        </nav>

        <div className="px-4 pt-1 pb-4">
          <a
            href="/schedule-session.html"
            onClick={() => setNavOpen(false)}
            className="inline-flex w-full items-center justify-center rounded-full bg-cyan-600 py-3 text-white font-semibold shadow-sm hover:bg-cyan-700 active:scale-[0.99] transition"
          >
            Book your free hour
          </a>
        </div>
      </aside>
    </div>
  )}
</header>
<div className="w-full border-t border-gray-400"></div>

      {/* Hero Section with two full-half panes and text overlay (video on left) */}
<section className="relative w-full bg-gray-100 overflow-hidden">
  <div className="grid grid-cols-1 md:grid-cols-2">

    {/* LEFT: ambient video + overlay + text */}
    <div className="relative h-[320px] sm:h-[380px] md:h-[500px]">
      <video
        className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
        src="/Final Background Video 2.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/Pic2.jpg"
      />
      {/* Fallback image for prefers-reduced-motion */}
      <img
        src="/Pic2.jpg"
        alt="Student studying"
        className="absolute inset-0 w-full h-full object-cover hidden motion-reduce:block"
      />

      {/* darken for readability */}
      <div className="absolute inset-0 bg-black/35 md:bg-black/40 pointer-events-none" />

      {/* text overlay */}
      <div className="relative z-10 flex items-center h-full">
        <div className="px-5 sm:px-8 md:px-12 text-white max-w-xl md:max-w-2xl">
          <h2 className="font-bold mb-3 text-[clamp(22px,5.5vw,36px)] md:text-[42px] leading-tight md:leading-snug">
            Tutoring That Works For You
          </h2>
          <p className="mb-4 text-[clamp(14px,3.8vw,20px)] md:text-[20px] leading-relaxed md:leading-relaxed">
            Get personalized support from a local tutor who understands your goals. Whether you or your
            student need help with a specific class or want to build strong academic habits, I am here to help.
          </p>

          {/* CTA row */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a
              href="/schedule-session.html"
              className="inline-block bg-cyan-500 text-white px-5 sm:px-6 py-2.5 rounded font-semibold hover:bg-blue-900 text-[clamp(14px,3.6vw,18px)] md:text-lg"
            >
              Schedule a Free, One-hour Session !
            </a>

            {/* Overview button — hidden on mobile, shown ≥ sm */}
            <NextStepBar
              label="Watch a 2-minute overview"
              target="#video"
              className="hidden sm:inline-flex border-white/20 bg-white/85 text-slate-900 hover:bg-white"
            />
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT: second image (desktop only) */}
    <div className="hidden md:block">
      <img
        src="/Pic3.jpg"
        alt="Right Image"
        className="w-full h-[500px] object-cover"
      />
    </div>
  </div>
</section>

    {/* User Type Selection Section – periwinkle gradient */}
<section className="isolate text-center py-12 px-4 overflow-x-hidden bg-[linear-gradient(to_right,_#c7d2fe,_#e9d5ff,_#bae6fd)]">
  <div
    className="
      mx-auto max-w-[1800px]
      grid items-center gap-8
      grid-cols-1
      /* Only create 3 columns on 2XL+ so laptops NEVER show side images */
      2xl:[grid-template-columns:minmax(0,1fr)_minmax(0,900px)_minmax(0,1fr)]
    "
  >
    {/* LEFT image — show ONLY on very large screens (2xl+) */}
    <div className="hidden 2xl:block overflow-visible justify-self-end">
      <div className="relative">
        <img
          src="/Tutoring Laptop Photo 7.png"
          alt="Online tutoring preview"
          className="
            object-contain
            w-[clamp(420px,28vw,980px)]
            mix-blend-darken
            [filter:contrast(1.06)_saturate(1.04)_brightness(1.02)]
          "
          loading="lazy"
        />
        {/* keep callout out of center; hide below 2xl automatically by wrapper */}
        <div className="absolute bottom-5 left-6 bg-white shadow-lg rounded-md px-6 py-4 w-72 text-sm text-gray-700 z-10 border border-gray-200">
          Studies show that online tutoring with interactive whiteboard tools can be just as effective—if not more effective—than in-person teaching.
        </div>
      </div>
    </div>

    {/* CENTER content — always centered, single column on laptops & below */}
    <div className="place-self-center mx-auto min-w-0">
      <div className="flex flex-col items-center gap-6 max-w-[900px]">
        <h2 className="text-[clamp(22px,4.5vw,40px)] md:text-4xl font-semibold text-gray-900">
          Confidence-building support, proven success.
        </h2>

        <p className="text-[clamp(14px,3.6vw,18px)] md:text-lg text-gray-700">
          Let&apos;s see how I can help you:
        </p>

        <PizazzButton icon={GraduationCap} onClick={() => setShowStudentFlow(true)} className="mt-1">
          I’m a Student
        </PizazzButton>

        <PizazzButton icon={Users} onClick={() => setShowParentFlow(true)}>
          I’m a Parent
        </PizazzButton>

        <div className="mt-3">
          <QuizTeaserCard className="hidden sm:block mx-auto" onClick={() => setShowQuiz(true)} />
          <a
            href="#quiz"
            onClick={(e) => { e.preventDefault(); setShowQuiz(true); }}
            className="sm:hidden block text-sm font-semibold text-cyan-700 underline underline-offset-4 text-center"
          >
            1-minute readiness quiz →
          </a>
        </div>
      </div>
    </div>

    {/* RIGHT image — show ONLY on very large screens (2xl+) */}
    <div className="hidden 2xl:flex items-center justify-self-start">
      <img
        src="/ButtonLeft1.png"
        alt="Pathway to Success"
        className="
          object-contain shrink-0
          w-[clamp(360px,22vw,760px)]
          mix-blend-darken [filter:contrast(1.05)_saturate(1.05)]
          drop-shadow-md
        "
        loading="lazy"
      />
    </div>
  </div>
</section>

      {/* Student Flow Conditional Render - removed from here */}

      {/* Video Section – modernized with particles + quiz CTA */}
<section id="video" className="relative w-full bg-[linear-gradient(180deg,#0b2630_0%,#0b2530_30%,#0e2431_100%)] py-14 sm:py-16">
  {/* ✨ floating glow background */}
  <SoftParticles count={18} />

  <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_minmax(720px,2fr)_1fr] lg:gap-16 lg:items-start text-white">
    {/* LEFT: Subject Areas */}
    <div className="order-2 lg:order-1 w-full min-w-0">
      <h3 className="text-2xl font-bold text-cyan-300 mb-4 tracking-tight">Subject Areas</h3>
      <ul className="space-y-3 text-cyan-100/90">
        {[
          "Algebra I & II, Advanced Algebra II",
          "Pre-Calculus, AP Calc (AB/BC), Calc I/II",
          "Geometry & Trigonometry",
          "Statistics and AP Stats",
          "General Chemistry 1/2 and AP Chem",
          "Biology and AP Bio",
          "General Physics & AP Physics (1/2 & C)",
          "Physical Earth Science and Geology",
        ].map((item, i) => (
          <li key={i} className="flex gap-3 items-start">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* CENTER: Video Card */}
   <div className="order-1 lg:order-2 relative z-10 w-full max-w-2xl xl:max-w-3xl mx-auto">
  <motion.div
    className="relative rounded-2xl p-[2px]"
    // Remove translate hover to avoid any chance of fullscreen being blocked by transforms
    whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}
    transition={{ type: "spring", stiffness: 300, damping: 24 }}
    style={{
      background:
        "linear-gradient(135deg, rgba(34,211,238,0.7), rgba(59,130,246,0.6), rgba(168,85,247,0.6))",
    }}
  >
    <div className="relative rounded-2xl overflow-hidden bg-slate-950/90 ring-1 ring-white/10">
      {/* Corner glows */}
      <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-[radial-gradient(400px_200px_at_70%_-80px,rgba(59,130,246,0.25),transparent),radial-gradient(300px_180px_at_10%_120%,rgba(168,85,247,0.25),transparent)]" />

      {/* Responsive 16:9 area that the iframe fully fills */}
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube-nocookie.com/embed/BJMI5NYQ3yg"
          title="Top Level Tutoring - A Personalized Approach"
          frameBorder="0"
          // Give explicit fullscreen permission (some browsers require both)
          allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      </div>
    </div>
  </motion.div>

  <div className="mt-4 text-center text-sm text-cyan-100/80">
    Studies show that well-designed online tutoring with interactive tools can be as effective as in-person—sometimes more.
  </div>
    </div>

    {/* RIGHT: 3-Step Approach */}
<div className="order-3 lg:order-3 w-full">
  <h3 className="text-2xl font-bold text-emerald-300 mb-4 tracking-tight">
    A 3-Step Approach
  </h3>
  <ul className="space-y-4 text-emerald-100/90">
    <li className="flex gap-3 items-start">
      <FlaskConical className="mt-0.5 h-6 w-6 shrink-0 text-emerald-300" />
      <div>
        <p className="font-semibold text-emerald-200">Step 1</p>
        <p className="leading-relaxed">
          Determine what the student needs help in, and discover their personal learning style.
        </p>
      </div>
    </li>
    <li className="flex gap-3 items-start">
      <FlaskConical className="mt-0.5 h-6 w-6 shrink-0 text-emerald-300" />
      <div>
        <p className="font-semibold text-emerald-200">Step 2</p>
        <p className="leading-relaxed">
          Create applicable scenarios and problems that relate to the student, making concepts stick on a personal level.
        </p>
      </div>
    </li>
    <li className="flex gap-3 items-start">
      <FlaskConical className="mt-0.5 h-6 w-6 shrink-0 text-emerald-300" />
      <div>
        <p className="font-semibold text-emerald-200">Step 3</p>
        <p className="leading-relaxed">
          Turn these scenarios into potential test questions—and even have the student teach them back to me.
        </p>
      </div>
    </li>
  </ul>
</div>
  </div>
</section>

{/* Services: left text | vertical divider | right video */}
<section
  id="services"
  className="py-16 bg-[linear-gradient(to_right,_#c7d2fe,_#e9d5ff,_#bae6fd)] md:px-0 px-6"
>
  {/* Full-width grid on desktop so the left can hug the edge */}
  <div className="max-w-none md:grid md:grid-cols-12 md:gap-10 md:items-start">

    {/* LEFT — wider, closer to the edge, less wrapping */}
    <div className="md:col-span-7 md:pl-10 space-y-10">
      <div>
        <h3 className="text-2xl font-bold text-cyan-500 mb-2">Tailored Lesson Plans</h3>
        <p className="text-lg text-slate-800 leading-relaxed">
          Utilizing teacher-recommended and student-favored techniques, I present students with a personalized lesson plan
          which breaks down concepts into manageable, comprehensible pieces, and progresses only after the student has
          mastered that topic.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-blue-600 mb-2">Online Tutoring</h3>
        <p className="text-lg text-slate-800 leading-relaxed">
          I offer flexible, remote sessions using Zoom and collaborative tools to make distance learning interactive and
          highly effective.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-cyan-500 mb-2">Academic Coaching</h3>
        <p className="text-lg text-slate-800 leading-relaxed">
          Get help with time management, test prep, or college readiness. I've found that a focus on academic coaching
          helps students develop strategies that stick beyond one course.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-emerald-600 mb-2">Affordable Pricing</h3>
        <p className="text-lg text-slate-800 leading-relaxed">
          After your first free hour, ongoing sessions are just $40 per hour—a rate that reflects both quality instruction
          and accessibility. I strive to make high-quality tutoring available to all students.
        </p>
      </div>
    </div>

    {/* DIVIDER — desktop only */}
<div className="hidden md:flex md:col-span-1 items-stretch justify-center">
  <div className="w-[2px] h-[560px] rounded-full
                  bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500
                  shadow-[0_0_0_1px_rgba(0,0,0,0.3)]" />
</div>

    {/* RIGHT — benefits card + CTA (constrained width, slight left nudge, mobile spacing) */}
<div className="md:col-span-4 md:-ml-2 md:pr-6 w-full md:max-w-[420px] mt-8 md:mt-0 mx-auto md:mx-0">
  <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/10 bg-white/80 backdrop-blur p-6">
    <h4 className="text-xl font-bold text-slate-900">What You’ll Get</h4>
    <p className="text-slate-600 text-sm mt-1">
      Focused, 1-on-1 support that builds mastery and confidence.
    </p>

    <ul className="mt-5 space-y-3">
      <li className="flex gap-3">
        <span className="mt-1">✅</span>
        <div>
          <p className="font-semibold text-slate-900">Personalized plan</p>
          <p className="text-slate-600 text-sm">Targets current class + skill gaps.</p>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="mt-1">✅</span>
        <div>
          <p className="font-semibold text-slate-900">Live Zoom tutoring</p>
          <p className="text-slate-600 text-sm">Interactive whiteboard & screen share.</p>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="mt-1">✅</span>
        <div>
          <p className="font-semibold text-slate-900">Study & test strategies</p>
          <p className="text-slate-600 text-sm">Note-taking, practice plans, review checklists.</p>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="mt-1">✅</span>
        <div>
          <p className="font-semibold text-slate-900">Flexible scheduling</p>
          <p className="text-slate-600 text-sm">Weeknights & weekends available.</p>
        </div>
      </li>
    </ul>

    <div className="mt-6 grid grid-cols-2 gap-3">
      <div className="rounded-xl p-4 text-center bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
        <div className="text-sm opacity-90">First Hour</div>
        <div className="text-lg font-semibold">FREE</div>
      </div>
      <div className="rounded-xl p-4 text-center bg-slate-900 text-white">
        <div className="text-sm opacity-90">Ongoing Rate</div>
        <div className="text-lg font-semibold">$40 / hr</div>
      </div>
    </div>

    <a
  href="/schedule-session.html"
  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-cyan-600 px-5 py-3 text-white font-semibold shadow hover:bg-cyan-700 transition"
>
  Schedule Your Free Hour
</a>

    <p className="mt-2 text-xs text-slate-500 text-center">
      No contracts • Cancel anytime
    </p>

    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0" />
  </div>
</div>
</div>
</section>

      
     {/* Testimonials Section */}
<section
  id="testimonials"
  className="relative py-16 px-4 bg-[linear-gradient(to_right,_#c7d2fe,_#e9d5ff,_#bae6fd)]"
>
  {/* Title with side pills */}
  <div className="flex items-center justify-center gap-6 flex-wrap">
    {/* Left pill */}
    <div className="pointer-events-auto inline-flex items-center justify-center px-6 py-3 rounded-full shadow-xl ring-1 ring-white/20 bg-[#6f72a4]/95 text-white font-semibold text-[16px] sm:text-[17px] leading-none tracking-[0.01em] whitespace-nowrap">
      ⭐ 4.9/5 average rating
    </div>

    {/* Title */}
    <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 text-center">
      Hear from Satisfied Customers
    </h2>

    {/* Right pill */}
    <div className="pointer-events-auto inline-flex items-center justify-center px-6 py-3 rounded-full shadow-xl ring-1 ring-white/20 bg-[#6f72a4]/95 text-white font-semibold text-[16px] sm:text-[17px] leading-none tracking-[0.01em] whitespace-nowrap">
      📆 Flexible scheduling
    </div>
  </div>

  {/* Accent underline */}
  <div className="mx-auto mt-2 mb-10 h-1 w-28 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full" />

  {/* Cards grid (3 items: 1 on mobile, 2 on md, 3 on xl) */}
  <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
    {/* Vanessa Fors */}
    <div className="group relative bg-white p-6 rounded-lg border-2 border-blue-500/70 ring-1 ring-blue-200/30 shadow transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      <span className="absolute -top-3 -left-3 h-10 w-10 md:h-11 md:w-11 rounded-full bg-cyan-500 text-white grid place-items-center text-2xl md:text-3xl shadow-sm">“</span>
      <p className="text-gray-700 italic">
        I came failing—Arie’s passion for teaching, patience, and mastery helped me exceed every expectation.
      </p>
      <p className="mt-4 font-semibold text-gray-800">
        — Vanessa Fors, STEM Student at Folsom Lake College (Final Grade: B)
      </p>
    </div>

    {/* Khaled Harris */}
    <div className="group relative bg-white p-6 rounded-lg border-2 border-blue-500/70 ring-1 ring-blue-200/30 shadow transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      <span className="absolute -top-3 -left-3 h-10 w-10 md:h-11 md:w-11 rounded-full bg-cyan-500 text-white grid place-items-center text-2xl md:text-3xl shadow-sm">“</span>
      <p className="text-gray-700 italic">
        Arie turned difficult subjects into confidence and clarity through patience, knowledge, and encouragement.
      </p>
      <p className="mt-4 font-semibold text-gray-800">
        — Khaled Harris, Pre-med at Folsom Lake College (Final Grade: A)
      </p>
    </div>

    {/* Sam Fouret */}
    <div className="group relative bg-white p-6 rounded-lg border-2 border-blue-500/70 ring-1 ring-blue-200/30 shadow transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      <span className="absolute -top-3 -left-3 h-10 w-10 md:h-11 md:w-11 rounded-full bg-cyan-500 text-white grid place-items-center text-2xl md:text-3xl shadow-sm">“</span>
      <p className="text-gray-700 italic">
        Arie made chemistry understandable—clear, patient, reliable, and far better than any textbook.
      </p>
      <p className="mt-4 font-semibold text-gray-800">
        — Sam Fouret, STEM Student at Folsom Lake College (Final Grade: B)
      </p>
    </div>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="bg-blue-50 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-cyan-500 mb-4">About Top Level Tutoring</h2>
          <p className="text-lg">
            Founded by a local, Folsom-based molecular bio major, this service is dedicated to providing compassionate, effective support for learners at all levels. My personal mission is rooted in mentorship, accessibility, and educational success.
          </p>
        </div>
      </section>

      {/* Contact Section */}
<section
  id="contact"
  className="relative bg-gradient-to-r from-cyan-700 via-cyan-400 to-cyan-700 text-white py-20"
>
  {/* subtle dot pattern */}
  <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

  <div className="container mx-auto px-6">
    <div
      className="
        mx-auto grid max-w-[1280px]
        grid-cols-1 gap-6
        lg:grid-cols-[320px_minmax(0,560px)_320px] lg:gap-8
        xl:grid-cols-[360px_minmax(0,560px)_360px]
        items-start lg:items-stretch
      "
    >
      {/* Left rail (lg+) */}
      <aside className="hidden lg:flex min-w-0 flex-col gap-4 text-white/90">
        <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur p-4">
          <p className="text-base font-semibold">Reach me</p>
          <p className="text-base mt-1 whitespace-normal xl:whitespace-nowrap">📞 916-517-9769</p>
          <p className="text-base flex items-center gap-2 whitespace-normal xl:whitespace-nowrap">
            <span className="shrink-0">✉️</span>
            <span>arie@topleveltutoring.com</span>
          </p>
        </div>
        <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur p-4">
          <p className="text-base whitespace-normal xl:whitespace-nowrap">
            ⏱ Avg. reply: <span className="font-semibold">under 24h</span>
          </p>
          <p className="text-base whitespace-normal xl:whitespace-nowrap">🔒 Your info stays private</p>
        </div>
      </aside>

      {/* Form card */}
      <div className="relative rounded-2xl border border-white/20 bg-white/95 text-slate-800 shadow-2xl backdrop-blur p-6 sm:p-8">
        <h2 className="text-3xl font-bold mb-2 text-cyan-700 text-center">Contact Me</h2>
        <p className="text-center text-base text-slate-600 mb-6">
          I'm here to help. Reach out to book a session or ask a question.
        </p>

        <form
          action="https://formspree.io/f/xblonwwg"
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            fetch(form.action, {
              method: form.method,
              body: data,
              headers: { Accept: 'application/json' },
            }).then((response) => {
              if (response.ok) {
                window.location.href = '/thank-you.html';
              } else {
                alert("Something went wrong. Please try again.");
              }
            });
          }}
          className="max-w-xl mx-auto"
        >
          {/* Honeypot (optional anti-spam) */}
          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

          {/* Optional subject for Formspree */}
          <input type="hidden" name="_subject" value="New message from Top Level Tutoring" />

          <div className="mb-4">
            <input
              type="text" name="name" placeholder="Your Name" required
              className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div className="mb-4">
            <input
              type="email" name="email" placeholder="Your Email" required
              className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div className="mb-4">
            <textarea
              name="message" rows="5" placeholder="Your Message" required
              className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-600 px-4 py-3 text-white font-semibold hover:bg-cyan-700"
          >
            Send Message
          </button>

          {/* small reassurance / alt contact */}
          <p className="text-center text-sm text-slate-600 mt-4">
            Prefer phone? Call or leave a voicemail:{" "}
            <span className="font-semibold text-slate-700">916-517-9769</span>
          </p>
        </form>
      </div>

      {/* Right rail (lg+) */}
      <aside className="hidden lg:flex min-w-0 flex-col gap-4 text-white/90">
        <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur p-4">
          <p className="text-base font-semibold whitespace-normal xl:whitespace-nowrap">What you get</p>
          <ul className="mt-2 space-y-1 text-base">
            <li className="whitespace-normal xl:whitespace-nowrap">✅ Personalized study plan</li>
            <li className="whitespace-normal xl:whitespace-nowrap">✅ Weekly progress check</li>
            <li className="whitespace-normal xl:whitespace-nowrap">✅ Interactive whiteboard</li>
          </ul>
        </div>
        <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur p-4">
          <p className="text-base whitespace-normal xl:whitespace-nowrap">⭐ 5/5 from recent students</p>
        </div>
      </aside>
    </div>
  </div>


  {/* bottom wave */}
  <svg className="absolute bottom-0 left-0 w-full translate-y-1" viewBox="0 0 1440 48" fill="none" aria-hidden="true">
    <path d="M0 24C240 48 480 0 720 0s480 48 720 24v24H0V24Z" fill="white" className="opacity-90" />
  </svg>
</section>

<ReadinessQuiz
  visible={showQuiz}
  onStudent={() => setShowStudentFlow(true)}
  onParent={() => setShowParentFlow(true)}
  innerRef={quizRef}
/>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Top Level Tutoring. All rights reserved.</p>
      </footer>
    </div>
  );
}
