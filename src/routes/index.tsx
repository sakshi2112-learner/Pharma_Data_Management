import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FallingHearts } from "@/components/FallingHearts";
import { PasswordGate } from "@/components/PasswordGate";
import { Notebook } from "@/components/Notebook";
const frontCoverUrl = "/front-cover.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Us — A Year in a Notebook 💌" },
      { name: "description", content: "A romantic, old-school digital notebook celebrating one year of us — every month, every memory, bound in one place." },
      { property: "og:title", content: "Us — A Year in a Notebook 💌" },
      { property: "og:description", content: "One year, twelve months, endless little moments — turn the pages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [gate, setGate] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <FallingHearts count={30} />

      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-10">
        <div className="mb-6 text-center fade-up">
          <div className="font-display tracking-[0.35em] text-[var(--gold-soft)]/80 text-xs sm:text-sm">
            SEPT 2025 — SEPT 2026
          </div>
          <h1 className="gold-shimmer mt-2 font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight">
            One year down, forever to go.
          </h1>
          <p className="mt-3 font-display italic text-lg text-[var(--cream)]/80">
            one year. one notebook. turn it slowly.
          </p>
        </div>

        {/* Book on stand */}
        <button
          onClick={() => setGate(true)}
          className="group relative outline-none"
          aria-label="Open the notebook"
        >
          <div className="cover-breath candle-glow relative w-[260px] sm:w-[340px] md:w-[400px] overflow-hidden rounded-[4px_10px_10px_4px]" style={{ aspectRatio: "0.72 / 1" }}>
            <div
              className="absolute inset-0 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7),0_20px_40px_-10px_rgba(0,0,0,0.5)]"
              style={{
                backgroundImage: `url(${frontCoverUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Centered title */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center px-6">
                <div className="font-display font-semibold text-[var(--gold-soft)] text-4xl sm:text-5xl italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  Us
                </div>
                <div className="mx-auto my-3 h-px w-12 bg-[var(--gold-soft)] opacity-80" />
                <div className="font-display font-bold uppercase tracking-[0.28em] text-[11px] sm:text-xs text-[var(--gold-soft)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  365 days of you &amp; me
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 font-hand text-[var(--gold-soft)] text-lg opacity-90 transition-all group-hover:opacity-100 group-hover:translate-y-[-2px]">
            ✧ tap the book to open ✧
          </div>
        </button>

        <div className="mt-10 max-w-md text-center font-body text-sm text-[var(--cream)]/60">
          hand-bound with 1 year of memories, 5 years of friendship,
          and one very specific inside joke you already know.
        </div>
      </section>

      {gate && !open && (
        <PasswordGate onUnlock={() => { setOpen(true); setGate(false); }} onClose={() => setGate(false)} />
      )}
      {open && <Notebook onClose={() => setOpen(false)} />}
    </main>
  );
}
