import { useState, type ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
};

export function RevealBox({ label, children, hint, className }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`my-3${className ? ` ${className}` : ""}`}>
      {!open ? (
        <button className="reveal-btn" onClick={() => setOpen(true)}>
          ❥ {label}
        </button>
      ) : (
        <div className="fade-up rounded-md border border-[color-mix(in_oklab,var(--burgundy)_35%,transparent)] bg-[color-mix(in_oklab,var(--gold)_10%,transparent)] p-3">
          {children}
          <button
            className="ink-caption mt-2 underline"
            onClick={() => setOpen(false)}
          >
            close
          </button>
        </div>
      )}
      {hint && !open && <div className="ink-caption mt-1">{hint}</div>}
    </div>
  );
}

type QuizProps = {
  question: string;
  options: string[];
  sarcasticReply?: (choice: string) => string;
};

export function Quiz({ question, options, sarcasticReply }: QuizProps) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="my-3 rounded-md border border-dashed border-[color-mix(in_oklab,var(--burgundy)_45%,transparent)] p-3">
      <div className="ink-hand mb-2">{question}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <button
            key={`${i}-${o}`}
            className="choice-btn"
            data-selected={picked === o}
            onClick={() => setPicked(o)}
          >
            {o}
          </button>
        ))}
      </div>
      {picked && (
        <div className="ink-hand fade-up mt-3 text-[var(--burgundy-deep)]">
          {sarcasticReply
            ? sarcasticReply(picked)
            : `"${picked}" — noted in the permanent record. 💌`}
        </div>
      )}
    </div>
  );
}

export function Polaroid({
  caption,
  rotate = -3,
  imageSrc,
}: {
  caption: string;
  rotate?: number;
  imageSrc?: string;
}) {
  return (
    <figure className="polaroid" style={{ ["--rot" as string]: `${rotate}deg` }}>
      <div className="frame">
        {imageSrc ? (
          <img src={imageSrc} alt={caption} className="h-full w-full object-cover" />
        ) : (
          <span>paste our photo here 📷</span>
        )}
      </div>
      <figcaption className="ink-caption mt-2 text-center">{caption}</figcaption>
    </figure>
  );
}

export function VideoReveal({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-3">
      {!open ? (
        <button className="reveal-btn" onClick={() => setOpen(true)}>
          ▶ {label}
        </button>
      ) : (
        <div className="fade-up rounded-md border border-[color-mix(in_oklab,var(--burgundy)_35%,transparent)] bg-[var(--burgundy-deep)] p-3">
          <div className="grid aspect-video place-items-center rounded bg-black/60 text-center text-[var(--cream)]">
            <div>
              <div className="ink-hand text-[var(--gold-soft)]">drop your video here</div>
              <div className="text-xs opacity-70">
                replace this box with a &lt;video src="..."&gt; tag
              </div>
            </div>
          </div>
          <button className="ink-caption mt-2 text-[var(--gold-soft)] underline" onClick={() => setOpen(false)}>
            close
          </button>
        </div>
      )}
    </div>
  );
}

export function AudioReveal({ label, src }: { label: string; src: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-3">
      {!open ? (
        <button className="reveal-btn" onClick={() => setOpen(true)}>
          ▶ {label}
        </button>
      ) : (
        <div className="audio-reveal fade-up">
          <div className="audio-reveal-title">♫ our song</div>
          <audio controls autoPlay preload="metadata" className="audio-player" src={src}>
            Your browser does not support the audio element.
          </audio>
          <div className="audio-reveal-message">This is love baby</div>
          <button className="audio-reveal-close" onClick={() => setOpen(false)}>
            close
          </button>
        </div>
      )}
    </div>
  );
}
