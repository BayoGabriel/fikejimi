"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import confetti from "canvas-confetti";
import Image from "next/image";
import Wanted from "@/assets/Priceless.png";
import Luffy from "@/assets/luffy.jpg";
import Luffy1 from "@/assets/luffy1.jpg";
import Luffy2 from "@/assets/luffy3.jpg";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useTypewriter(text: string, enabled: boolean, speedMs = 22) {
  const [out, setOut] = useState("");

  useEffect(() => {
    if (!enabled) {
      setOut(text);
      return;
    }

    let i = 0;
    setOut("");

    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speedMs);

    return () => window.clearInterval(id);
  }, [text, enabled, speedMs]);

  return out;
}

type StepId =
  | "intro"
  | "journey"
  | "treasure"
  | "crew"
  | "question"
  | "success";

const journeyLines = [
  "Some pirates sail the world searching for the one piece…",
  "But somehow, I didn’t need the Grand Line — I found something priceless in you.",
  "Being around you feels like calm seas after a long storm.",
  "And I keep thinking… maybe this is the start of my favorite adventure.",
];

const treasureCards = [
  "Your smile… yeah, that’s worth more than any bounty",
  "The way you make me laugh — effortlessly",
  "Your energy… it changes everything around you",
  "You, just being you… that’s my favorite part",
];

const noMessages = [
  "Hmm… that doesn’t feel right 😌",
  "Try again, future girlfriend",
  "This option is under maintenance 😂",
  "Be serious Fike 😭",
  "You clicked wrong — I forgive you",
];

function TenorGif({
  postId,
  className,
  aspectRatio,
}: {
  postId: string;
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div className={className ? className : ""}>
      <div
        className="tenor-gif-embed"
        data-postid={postId}
        data-share-method="host"
        data-aspect-ratio={aspectRatio ?? "1"}
        data-width="100%"
      />
    </div>
  );
}

function HeartBurst({ active }: { active: boolean }) {
  const reduce = useReducedMotion();

  const hearts = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      const delay = i * 0.06;
      const x = (Math.random() * 2 - 1) * 140;
      const y = -220 - Math.random() * 120;
      const s = 0.9 + Math.random() * 0.8;
      const r = (Math.random() * 2 - 1) * 30;
      return { delay, x, y, s, r, id: i };
    });
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 0, scale: 0.4, x: 0, y: 60, rotate: 0 }}
          animate={
            reduce
              ? { opacity: 0 }
              : {
                  opacity: [0, 1, 0],
                  scale: [0.4, h.s, h.s * 1.05],
                  x: [0, h.x],
                  y: [60, h.y],
                  rotate: [0, h.r],
                }
          }
          transition={{ duration: 1.2, ease: "easeOut", delay: h.delay }}
          className="text-4xl"
        >
          ❤
        </motion.div>
      ))}
    </div>
  );
}

function PillButton({
  children,
  onClick,
  variant,
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={
        "h-14 w-full select-none rounded-full px-6 text-base font-semibold tracking-tight active:scale-[0.99] disabled:opacity-60 " +
        (variant === "primary"
          ? "bg-white/85 text-zinc-950 shadow-[0_16px_50px_rgba(255,255,255,0.18)] ring-1 ring-white/60 backdrop-blur transition hover:bg-white"
          : "bg-white/12 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/18") +
        (className ? " " + className : "")
      }
    >
      {children}
    </button>
  );
}

export default function LoveExperience() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<StepId>("intro");
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const [showYesGif, setShowYesGif] = useState(false);

  const startedAt = useMemo(() => {
    const now = new Date();
    return new Date(now.getTime() - 1000 * 60 * 60 * 24 * 200 - 1000 * 60 * 17);
  }, []);

  const [sinceText, setSinceText] = useState("...");
  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - startedAt.getTime();
      const s = Math.floor(diff / 1000);
      const days = Math.floor(s / 86400);
      const hours = Math.floor((s % 86400) / 3600);
      const mins = Math.floor((s % 3600) / 60);
      const secs = s % 60;
      setSinceText(`${days}d ${hours}h ${mins}m ${secs}s`);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);

  const progress = useMemo(() => {
    const order: StepId[] = [
      "intro",
      "journey",
      "treasure",
      "crew",
      "question",
      "success",
    ];
    const i = order.indexOf(step);
    const base = clamp(i / (order.length - 1), 0, 1);
    if (step === "journey") {
      const extra = (journeyIndex + 1) / (journeyLines.length + 1);
      return clamp(0.18 + extra * 0.18, 0, 1);
    }
    return base;
  }, [step, journeyIndex]);

  const [noAttempt, setNoAttempt] = useState(0);
  const [noLabel, setNoLabel] = useState("No");
  const [noMessage, setNoMessage] = useState("");
  const [noPos, setNoPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [journeyMessage, setJourneyMessage] = useState(
    "Tap to continue… and if you tap the little hearts, you might find secrets.",
  );

  const questionAreaRef = useRef<HTMLDivElement | null>(null);

  const journeyText = useTypewriter(
    journeyLines[journeyIndex] ?? "",
    !reduce,
    22,
  );

  function go(next: StepId) {
    setStep(next);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bumpNo() {
    const el = questionAreaRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const maxX = Math.max(0, rect.width - 180);
    const maxY = Math.max(0, rect.height - 120);

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    setNoAttempt((n) => {
      const next = n + 1;
      setNoMessage(noMessages[next % noMessages.length]);
      if (next >= 6) setNoLabel("Think again 🥺");
      if (next >= 9) {
        setNoLabel("...");
        window.setTimeout(() => setNoLabel("No"), 650);
      }
      return next;
    });

    setNoPos({ x, y });
  }

  function celebrateYes() {
    setShowBurst(true);
    window.setTimeout(() => setShowBurst(false), 1400);

    setShowYesGif(true);
    window.setTimeout(() => setShowYesGif(false), 2200);

    try {
      const colors = ["#ff4da6", "#ffd166", "#7bdff2", "#ffffff"]; // pink, gold, ocean, white
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.72 },
        colors,
      });
      confetti({
        particleCount: 70,
        spread: 110,
        origin: { y: 0.62 },
        colors,
      });
    } catch {
    }

    window.setTimeout(() => go("success"), 550);
  }
  const luffyImages = [Luffy, Luffy1, Luffy2];

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#070912] text-white">
      <Script src="https://tenor.com/embed.js" strategy="afterInteractive" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,77,166,0.35),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(123,223,242,0.28),transparent_45%),radial-gradient(circle_at_50%_85%,rgba(255,209,102,0.25),transparent_45%)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-wave opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-wave2 opacity-55" />
        <div className="absolute inset-0 bg-maplines opacity-30" />
      </div>

      <div className="fixed left-4 top-4 z-40 flex items-center gap-3">
        <div className="w-36 rounded-full bg-white/10 p-1 ring-1 ring-white/20 backdrop-blur">
          <div className="h-2.5 rounded-full bg-white/15">
            <motion.div
              className="h-2.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-200 to-amber-200"
              initial={false}
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            />
          </div>
        </div>
        {/* <div className="rounded-full bg-black/20 px-3 py-1 text-[11px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur">
          Love meter
        </div> */}
      </div>

      <main className="relative mx-auto flex w-full max-w-md flex-col px-5 pb-16 pt-24">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex min-h-[78dvh] flex-col justify-center"
            >
              <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight">
                Hey <span className="text-rose-200">Fike…</span>{" "}
                <span className="text-3xl">🏴‍☠️❤️</span>
              </h1>
              <p className="mt-4 max-w-sm text-pretty text-base leading-7 text-white/80">
                I’ve been meaning to tell you something… but not in a normal
                way. <br /> So I made you a little adventure, because some
                stories deserve more than just words.
              </p>
              <Image src={Wanted} alt="cool" className="w-full mt-4" />
              <div className="mt-8 space-y-3">
                <PillButton
                  variant="primary"
                  onClick={() => {
                    go("journey");
                  }}
                  className="shadow-[0_24px_70px_rgba(255,77,166,0.25)]"
                >
                  Start the journey
                </PillButton>
              </div>

              <motion.div
                aria-hidden
                className="pointer-events-none absolute -top-6 right-2 opacity-70"
                animate={reduce ? undefined : { y: [0, -10, 0] }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-2xl ring-1 ring-white/20 backdrop-blur">
                  🧡
                </div>
              </motion.div>
            </motion.section>
          )}

          {step === "journey" && (
            <motion.section
              key="journey"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="min-h-[78dvh]"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
                  Chapter {journeyIndex + 1} / {journeyLines.length}
                </div>
                <div className="rounded-full bg-black/20 px-3 py-2 text-xs font-semibold text-white/85 ring-1 ring-white/15 backdrop-blur">
                  Tap to continue
                </div>
              </div>

              <button
                onClick={() => {
                  const next = journeyIndex + 1;
                  if (next >= journeyLines.length) go("treasure");
                  else setJourneyIndex(next);
                }}
                className="relative w-full text-left"
              >
                <div className="rounded-3xl bg-white/8 p-6 ring-1 ring-white/14 backdrop-blur">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold ring-1 ring-white/15">
                    <span>🌊</span>
                    <span>On the ocean of destiny</span>
                  </div>

                  <div className="min-h-[120px] text-balance text-2xl font-semibold leading-snug tracking-tight">
                    {journeyText}
                    <span className="inline-block w-2" />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xs font-medium text-white/70">
                      {journeyIndex === journeyLines.length - 1
                        ? "Next: treasure"
                        : "Next: another page"}
                    </div>
                    <motion.div
                      aria-hidden
                      className="text-xl"
                      animate={reduce ? undefined : { x: [0, 6, 0] }}
                      transition={{
                        duration: 1.7,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      ✨
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-3 left-6 h-3 w-3 rounded-full bg-rose-300/70 blur-[1px]"
                  animate={
                    reduce
                      ? undefined
                      : { opacity: [0.3, 1, 0.4], scale: [0.8, 1.2, 0.9] }
                  }
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </button>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.button
                    key={i}
                    className="rounded-2xl bg-white/6 p-4 text-left ring-1 ring-white/10 backdrop-blur active:scale-[0.99]"
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                    onClick={() => {
                      const msgs = [
                        "If you found this, you owe me a smile.",
                        "Tiny secret: I’m really into you.",
                        "Treasure hint: it’s you.",
                        "You’re special.",
                        "Plot twist: I like you… a lot.",
                        "You’re my favorite pirate.",
                      ];
                      const msg = msgs[i % msgs.length];
                      setJourneyMessage(msg);
                      window.setTimeout(
                        () =>
                          setJourneyMessage(
                            "Tap to continue… and if you tap the little hearts, you might find secrets.",
                          ),
                        2000,
                      );
                    }}
                  >
                    <div className="text-[11px] font-semibold text-white/70">
                      Tap
                    </div>
                    <div className="mt-1 text-lg">❤</div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-black/20 p-4 text-sm text-white/75 ring-1 ring-white/10">
                {journeyMessage}
              </div>
            </motion.section>
          )}

          {step === "treasure" && (
            <motion.section
              key="treasure"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="min-h-[78dvh]"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
                <span>💎</span>
                <span>Treasure section</span>
              </div>

              <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight">
                What makes you a treasure?
              </h2>

              <div className="mt-6 space-y-3">
                {treasureCards.map((t, i) => {
                  const img = luffyImages[i % luffyImages.length];

                  return (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.08,
                        ease: "easeOut",
                      }}
                      className="rounded-3xl bg-white/8 p-5 ring-1 ring-white/14 backdrop-blur"
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
                          <Image
                            src={img}
                            alt="luffy"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-white/85">
                            Treasure #{i + 1}
                          </div>
                          <div className="mt-1 text-lg font-semibold leading-snug tracking-tight">
                            {t}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-amber-200/15 via-rose-200/10 to-cyan-200/10 p-5 ring-1 ring-white/14 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white/70">
                      Treasure chest
                    </div>
                    <div className="mt-1 text-base font-semibold">
                      Some treasures sparkle… but you actually changed my days.
                    </div>
                  </div>
                  <motion.div
                    aria-hidden
                    className="text-3xl"
                    animate={
                      reduce
                        ? undefined
                        : { rotate: [0, -6, 6, 0], y: [0, -4, 0] }
                    }
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    🧰
                  </motion.div>
                </div>

                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-200/30 blur-3xl"
                  animate={reduce ? undefined : { opacity: [0.2, 0.5, 0.25] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <div className="mt-7">
                <PillButton variant="primary" onClick={() => go("crew")}>
                  Continue
                </PillButton>
              </div>
            </motion.section>
          )}

          {step === "crew" && (
            <motion.section
              key="crew"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="min-h-[78dvh]"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
                <span>🏴‍☠️</span>
                <span>Crew invitation</span>
              </div>

              <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight">
                Every great adventure needs the right person by your side…
              </h2>

              <p className="mt-4 text-base leading-7 text-white/80">
                So <span className="font-semibold text-rose-100">Fike</span>…
                will you join my crew? 🏴‍☠️❤
              </p>

              <div className="mt-6 overflow-hidden rounded-3xl bg-white/6 p-4 ring-1 ring-white/12 backdrop-blur">
                <div className="mb-3 text-xs font-semibold text-white/70">
                  Mood right now
                </div>
                <TenorGif
                  postId="2492925402587233181"
                  className="rounded-2xl overflow-hidden"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-3xl bg-white/8 p-5 ring-1 ring-white/14 backdrop-blur">
                  <div className="text-xs font-semibold text-white/70">
                    Role
                  </div>
                  <div className="mt-1 text-lg font-semibold">First Mate</div>
                </div>
                <div className="rounded-3xl bg-white/8 p-5 ring-1 ring-white/14 backdrop-blur">
                  <div className="text-xs font-semibold text-white/70">
                    Oath
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    To laugh a lot
                  </div>
                </div>
                <div className="col-span-2 rounded-3xl bg-white/8 p-5 ring-1 ring-white/14 backdrop-blur">
                  <div className="text-xs font-semibold text-white/70">
                    Map coordinates
                  </div>
                  <div className="mt-1 text-base font-semibold text-white/90">
                    (My heart) → (Your smile)
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <PillButton variant="primary" onClick={() => go("question")}>
                  I’m ready…
                </PillButton>
                <PillButton variant="secondary" onClick={() => go("treasure")}>
                  Back
                </PillButton>
              </div>
            </motion.section>
          )}

          {step === "question" && (
            <motion.section
              key="question"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="min-h-[78dvh]"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
                <span>💖</span>
                <span>The big question</span>
              </div>

              <h2 className="mt-6 text-center text-balance text-4xl font-semibold leading-[1.05] tracking-tight">
                Will you be my girlfriend,
                <span className="block text-rose-200">Fike</span>?
              </h2>

              <div
                ref={questionAreaRef}
                className="relative mt-8 rounded-3xl bg-white/6 p-5 ring-1 ring-white/12 backdrop-blur"
                style={{ height: 220 }}
              >
                <div className="grid gap-3">
                  <PillButton
                    variant="primary"
                    onClick={celebrateYes}
                    className="h-16 text-lg shadow-[0_24px_70px_rgba(255,77,166,0.25)]"
                  >
                    Yes ✅
                  </PillButton>

                  <div className="relative h-16">
                    <motion.button
                      type="button"
                      onPointerEnter={bumpNo}
                      onPointerDown={bumpNo}
                      animate={{
                        x: noPos.x,
                        y: noPos.y,
                        scale: noAttempt ? 0.98 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                      }}
                      className="absolute left-0 top-0 h-14 w-[170px] rounded-full bg-white/12 px-6 text-base font-semibold text-white ring-1 ring-white/25 backdrop-blur active:scale-[0.99]"
                    >
                      {noLabel} ❌
                    </motion.button>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-black/20 p-4 text-sm text-white/80 ring-1 ring-white/10">
                  {noMessage ||
                    "Only one choice is canon… and it’s the one where I get to love you properly."}
                </div>
              </div>

              <HeartBurst active={showBurst} />
              {showYesGif && (
                <div className="mt-5 overflow-hidden rounded-3xl bg-white/6 p-4 ring-1 ring-white/12 backdrop-blur">
                  <TenorGif
                    postId="24362468"
                    className="rounded-2xl overflow-hidden"
                  />
                </div>
              )}

              {noAttempt > 0 && (
                <div className="mt-5 overflow-hidden rounded-3xl bg-white/6 p-4 ring-1 ring-white/12 backdrop-blur">
                  <TenorGif
                    postId={
                      noAttempt % 2 === 0 ? "24471024" : "2464614774211392084"
                    }
                    aspectRatio={noAttempt % 2 === 0 ? "1" : "1.77778"}
                    className="rounded-2xl overflow-hidden"
                  />
                </div>
              )}

              <div className="mt-7">
                <PillButton variant="secondary" onClick={() => go("crew")}>
                  Back
                </PillButton>
              </div>
            </motion.section>
          )}

          {step === "success" && (
            <motion.section
              key="success"
              initial={{ opacity: 0, scale: 0.98, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex min-h-[78dvh] flex-col justify-center"
            >
              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-[28px] bg-white/10 text-4xl ring-1 ring-white/20 backdrop-blur">
                🫶
              </div>

              <h2 className="text-center text-balance text-4xl font-semibold leading-[1.05] tracking-tight">
                You just made me the happiest person alive{" "}
                <span className="text-rose-200">❤</span>
              </h2>
              <p className="mt-4 text-center text-base leading-7 text-white/80">
                Welcome to my crew,{" "}
                <span className="font-semibold text-rose-100">Fike</span> 🏴‍☠️
              </p>

              <div className="mt-6 overflow-hidden rounded-3xl bg-white/6 p-4 ring-1 ring-white/12 backdrop-blur">
                <TenorGif
                  postId="24362468"
                  className="rounded-2xl overflow-hidden"
                />
              </div>

              <div className="mt-8 space-y-3">
                <div className="rounded-3xl bg-white/8 p-6 text-center ring-1 ring-white/14 backdrop-blur">
                  <div className="text-xs font-semibold text-white/70">
                    Captain’s promise
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    I’m not perfect… but I’m serious about you. I’ll choose
                    you—again and again.
                  </div>
                </div>

                <PillButton
                  variant="primary"
                  onClick={() => {
                    setJourneyIndex(0);
                    setNoAttempt(0);
                    setNoLabel("No");
                    setNoMessage("");
                    setNoPos({ x: 0, y: 0 });
                    setJourneyMessage(
                      "Tap to continue… and if you tap the little hearts, you might find secrets.",
                    );
                    go("intro");
                  }}
                >
                  Replay the adventure
                </PillButton>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-center text-xs text-white/50">
          Made with love — for{" "}
          <span className="ml-1 font-semibold text-white/70">Fike</span>
        </div>
      </main>
    </div>
  );
}
