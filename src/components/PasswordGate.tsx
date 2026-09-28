import { useState } from "react";

const CORRECT = "mahi&gotiperson";

type Q = { q: string; options: string[]; correctIndex: number };
const QUIZ: Q[] = [
  { q: "Do you love me??", options: ["yes", "obviously", "Ho re betaa.."], correctIndex: 2 },
  { q: "Would you ever leave me??", options: ["yes", "No", "Yes after 77 years."], correctIndex: 2 },
  { q: "If you are my goto person then I'm yours??", options: ["darling", "babe", "Goti person"], correctIndex: 2 },
];

export function PasswordGate({ onUnlock, onClose }: { onUnlock: () => void; onClose: () => void }) {
  const [value, setValue] = useState("");
  const [err, setErr] = useState(false);
  const [mode, setMode] = useState<"pw" | "quiz" | "hint" | "failed">("pw");
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim().toLowerCase() === CORRECT) onUnlock();
    else {
      setErr(true);
      setTimeout(() => setErr(false), 600);
    }
  }

  function checkQuiz() {
    const allRight = QUIZ.every((q, i) => answers[i] === q.correctIndex);
    setMode(allRight ? "hint" : "failed");
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm px-4">
      <div className="fade-up w-full max-w-md rounded-lg border border-[var(--gold)]/40 bg-[var(--burgundy-deep)]/95 p-6 shadow-2xl">
        {mode === "pw" && (
          <form onSubmit={submit}>
            <div className="text-center">
              <div className="gold-shimmer font-display text-2xl font-semibold tracking-wide">
                A tiny lock on our story
              </div>
              <div className="mt-1 font-body text-sm text-[var(--cream)]/70">
                whisper the secret to turn the first page
              </div>
            </div>

            <input
              type="password"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="your secret…"
              className={`mt-5 w-full rounded-md border bg-black/30 px-4 py-3 font-body text-[var(--cream)] outline-none transition-all ${
                err ? "border-[var(--destructive)] animate-[shake_.5s]" : "border-[var(--gold)]/50 focus:border-[var(--gold)]"
              }`}
            />
            {err && <div className="mt-2 font-display italic text-sm text-[var(--rose)]">not quite, try again 💔</div>}

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => { setAnswers([null, null, null]); setMode("quiz"); }}
                className="rounded-md border border-[var(--gold)]/50 px-3 py-1.5 font-display text-xs text-[var(--gold-soft)] hover:bg-[var(--gold)]/10"
              >
                need a hint?
              </button>
            </div>

            <div className="mt-5 flex justify-between gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-[var(--gold)]/40 px-4 py-2 font-display text-sm text-[var(--cream)]/80 hover:bg-black/30"
              >
                not yet
              </button>
              <button
                type="submit"
                className="rounded-md bg-[var(--gold)] px-5 py-2 font-display text-sm font-semibold text-[var(--burgundy-deep)] hover:brightness-110"
              >
                open the notebook
              </button>
            </div>
          </form>
        )}

        {mode === "quiz" && (
          <div>
            <div className="text-center">
              <div className="font-display text-xl font-semibold text-[var(--gold-soft)]">
                earn your hint 🕵️
              </div>
              <div className="mt-1 font-display italic text-sm text-[var(--cream)]/70">
                get all 3 right, no cheating
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {QUIZ.map((q, i) => (
                <div key={i}>
                  <div className="font-display text-sm text-[var(--cream)]">{i + 1}. {q.q}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => setAnswers((a) => a.map((v, idx) => (idx === i ? oi : v)))}
                        className={`rounded-md border px-3 py-1.5 font-display text-xs transition-all ${
                          answers[i] === oi
                            ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--burgundy-deep)]"
                            : "border-[var(--gold)]/40 text-[var(--cream)] hover:bg-[var(--gold)]/10"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between gap-2">
              <button
                onClick={() => setMode("pw")}
                className="rounded-md border border-[var(--gold)]/40 px-4 py-2 font-display text-sm text-[var(--cream)]/80 hover:bg-black/30"
              >
                ← back
              </button>
              <button
                onClick={checkQuiz}
                disabled={answers.some((a) => a === null)}
                className="rounded-md bg-[var(--gold)] px-5 py-2 font-display text-sm font-semibold text-[var(--burgundy-deep)] hover:brightness-110 disabled:opacity-50"
              >
                check
              </button>
            </div>
          </div>
        )}

        {mode === "hint" && (
          <div className="text-center">
            <div className="font-display text-2xl font-semibold text-[var(--gold-soft)]">
              you passed 💛
            </div>
            <div className="mt-3 font-display italic text-[var(--cream)]">
              hint: my two most fav jokes of all time — <br></br> 1st is a english song <br></br>2nd is the one person that I am to you
              <br></br> joined with an <strong>&amp;</strong>, all lowercase.
            </div>
            {/* <div className="mt-2 font-display text-xs text-[var(--cream)]/60">
              (yourname &amp; the person you are to me — one word each)
            </div> */}
            <button
              onClick={() => setMode("pw")}
              className="mt-5 rounded-md bg-[var(--gold)] px-5 py-2 font-display text-sm font-semibold text-[var(--burgundy-deep)] hover:brightness-110"
            >
              got it — back to password
            </button>
          </div>
        )}

        {mode === "failed" && (
          <div className="text-center">
            <div className="font-display text-2xl font-semibold text-[var(--rose)]">
              nope 💔
            </div>
            <div className="mt-2 font-display italic text-[var(--cream)]">
              one or more answers were wrong. no hint for you.
            </div>
            <div className="mt-1 font-display text-sm text-[var(--cream)]/70">
              think harder. you know me.
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <button
                onClick={() => { setAnswers([null, null, null]); setMode("quiz"); }}
                className="rounded-md border border-[var(--gold)]/50 px-4 py-2 font-display text-sm text-[var(--gold-soft)] hover:bg-[var(--gold)]/10"
              >
                try again
              </button>
              <button
                onClick={() => setMode("pw")}
                className="rounded-md bg-[var(--gold)] px-5 py-2 font-display text-sm font-semibold text-[var(--burgundy-deep)] hover:brightness-110"
              >
                back to password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
