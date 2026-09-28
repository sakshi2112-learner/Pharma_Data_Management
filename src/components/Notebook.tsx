import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import HTMLFlipBookRaw from "react-pageflip";
const HTMLFlipBook = HTMLFlipBookRaw as unknown as React.ComponentType<any>;
import { AudioReveal, Polaroid, Quiz, RevealBox, VideoReveal } from "./PageBits";
import coverAsset from "@/assets/cover-us.asset.json";
const frontCoverUrl = "/front-cover.jpg";
const backCoverUrl = "/back-cover.jpg";

type PageProps = { children: ReactNode; number?: number; cover?: boolean };

const CornerOrnament = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 58 C2 30 30 2 58 2"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
      opacity="0.6"
    />
    <path
      d="M8 58 C8 34 34 8 58 8"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="none"
      opacity="0.4"
    />
    <path
      d="M2 58 L2 42 C2 28 10 14 22 8 L28 5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
    <circle cx="4" cy="54" r="2.5" fill="currentColor" opacity="0.35" />
    <circle cx="54" cy="4" r="2.5" fill="currentColor" opacity="0.35" />
    <path
      d="M2 48 Q12 46 16 38"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="none"
      opacity="0.4"
    />
    <path
      d="M48 2 Q46 12 38 16"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="none"
      opacity="0.4"
    />
    <path
      d="M6 52 C10 48 14 44 18 36 Q20 32 24 28"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

const Page = forwardRef<HTMLDivElement, PageProps>(({ children, number, cover }, ref) => {
  return (
    <div ref={ref} className={cover ? "cover-face" : "paper"}>
      {!cover && (
        <div className={`page-inner${number ? ` page-${number}` : ""}`}>
          <div className="page-corner tl" style={{ color: "var(--burgundy)" }}>
            <CornerOrnament />
          </div>
          <div className="page-corner tr" style={{ color: "var(--burgundy)" }}>
            <CornerOrnament />
          </div>
          <div className="page-corner bl" style={{ color: "var(--burgundy)" }}>
            <CornerOrnament />
          </div>
          <div className="page-corner br" style={{ color: "var(--burgundy)" }}>
            <CornerOrnament />
          </div>
          {children}
          {number !== undefined && (
            <div className="ink-caption mt-4 text-center opacity-60">— {number} —</div>
          )}
        </div>
      )}
      {cover && children}
    </div>
  );
});
Page.displayName = "Page";

const BookVideo = (props: React.VideoHTMLAttributes<HTMLVideoElement>) => (
  <video
    {...props}
    playsInline
    // defaultPlaybackRate={1}
    onLoadedMetadata={(e) => {
      const video = e.currentTarget;
      video.playbackRate = 1;
      video.defaultPlaybackRate = 1;
    }}
    onCanPlay={(e) => {
      const video = e.currentTarget;
      video.playbackRate = 1;
      video.defaultPlaybackRate = 1;
    }}
  />
);

function Ornament() {
  return <div className="divider-ornament my-1">✦</div>;
}

function MonthHeader({ month, year, tag }: { month: string; year: string; tag?: string }) {
  return (
    <header className="mb-3">
      <div className="flex items-center justify-between gap-2">
        <span className="chip">
          {month} {year}
        </span>
        {tag && <span className="ink-caption">{tag}</span>}
      </div>
    </header>
  );
}

type Props = { onClose: () => void };

export function Notebook({ onClose }: Props) {
  const bookRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [showEnd, setShowEnd] = useState(false);
  const [isBookClosing, setIsBookClosing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [dims, setDims] = useState({ w: 340, h: 500, portrait: true });

  // New state to control the video popup
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  // State to control the dattu image popup
  const [isImageOpen, setIsImageOpen] = useState(false);
  // State to control the mahalaxmi image popup
  const [isMahalaxmiOpen, setIsMahalaxmiOpen] = useState(false);
  // State to control the vc video popup
  const [isVcVideoOpen, setIsVcVideoOpen] = useState(false);
  // State to control the palat video popup
  const [isPalatVideoOpen, setIsPalatVideoOpen] = useState(false);

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // reserve for top bar + padding
      const availH = vh - 100;
      const availW = vw - 24;
      const portrait = vw < 900;
      const ratio = 0.7; // width / height
      let h = Math.min(availH, portrait ? 720 : 780);
      let w = h * ratio;
      const maxW = portrait ? availW : availW / 2;
      if (w > maxW) {
        w = maxW;
        h = w / ratio;
      }
      setDims({ w: Math.floor(w), h: Math.floor(h), portrait });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const flip = (dir: "prev" | "next") => {
    const api = bookRef.current?.pageFlip?.();
    if (!api) return;
    if (dir === "prev") api.flipPrev();
    else api.flipNext();
  };

  const handleAttemptClose = () => {
    if (isBookClosing) return;
    setIsBookClosing(true);
    setShowEnd(false);
    setTimeout(() => setShowEnd(true), 650);
  };

  const stopPageFlip = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-black/85 backdrop-blur-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 text-[var(--cream)]">
        <button
          onClick={handleAttemptClose}
          className="rounded-md border border-[var(--gold)]/40 px-2.5 py-1 font-display text-xs hover:bg-white/5"
        >
          ← close
        </button>
        <div className="font-display text-xs text-[var(--gold-soft)]">
          page {page + 1} / {totalPages || "…"}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => flip("prev")}
            className="rounded-md border border-[var(--gold)]/40 px-2.5 py-1 font-display text-xs hover:bg-white/5"
          >
            ‹ prev
          </button>
          <button
            onClick={() => flip("next")}
            className="rounded-md border border-[var(--gold)]/40 px-2.5 py-1 font-display text-xs hover:bg-white/5"
          >
            next ›
          </button>
        </div>
      </div>

      {/* Book stage */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-2 relative">
        <div className={`book-shell relative ${isBookClosing ? "book-closing" : ""}`}>
          <HTMLFlipBook
            key={`${dims.portrait ? "p" : "l"}-${dims.w}-${dims.h}`}
            ref={bookRef}
            width={dims.w}
            height={dims.h}
            size="fixed"
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            drawShadow={true}
            usePortrait={dims.portrait}
            className={`mx-auto ${isBookClosing ? "book-closing" : ""}`}
            onFlip={(e: any) => {
              const nextPage = e.data;
              setPage(nextPage);
              setShowEnd(false);
            }}
            onInit={(e: any) => setTotalPages(e.data?.pages || 0)}
            onChangeState={() => {
              const api = bookRef.current?.pageFlip?.();
              if (api) setTotalPages(api.getPageCount());
            }}
          >
            {/* FRONT COVER — simple burgundy leather w/ gold border */}
            <Page cover>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${frontCoverUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 grid place-items-center"
                style={{ zIndex: 4 }}
              >
                <div className="text-center px-8">
                  <div className="font-display italic font-semibold text-[var(--gold-soft)] text-2xl sm:text-3xl drop-shadow-[0_3px_10px_rgba(0,0,0,1)]">
                    Prashi Tales
                  </div>
                  <div className="mx-auto my-4 h-px w-16 bg-[var(--gold-soft)] opacity-80" />
                  <div className="font-display font-bold uppercase tracking-[0.28em] text-sm sm:text-base text-[var(--gold-soft)] drop-shadow-[0_3px_8px_rgba(0,0,0,1)] leading-relaxed">
                    365 days of
                    <br />
                    you &amp; me
                  </div>
                </div>
              </div>
            </Page>

            {/* INSIDE COVER — our photo */}
            <Page cover>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(/clg1.jpg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="cover-vignette" />
              <div
                className="absolute inset-0 flex flex-col justify-end p-5 text-center"
                style={{ zIndex: 4 }}
              >
                <div className="font-display italic text-[var(--gold-soft)] text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  <b>
                    Our first Photo together — <br></br> It all started from here...
                  </b>
                </div>
              </div>
            </Page>

            {/* TITLE */}
            <Page number={1}>
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="chip">To My Baby 🧸ྀི</div>
                <h1 className="ink-title mt-4">a little book of us</h1>
                {/* <Ornament /> */}
                <p className="ink-body max-w-md">
                  Even after five years of being best friends, this past year together has changed
                  everything. I wanted to bind our story into a book because—knowing how old-school
                  I am—I needed a tangible place to hold every laugh, every moment, and every
                  precious memory from the last 365 days. They mean the world to me.
                </p>
                <div className="ink-hand mt-5">— Sakass..💌</div>
              </div>
            </Page>

            {/* ═══════════════════════════════════════════════════════
              CHAPTER 1 — THE STRANGER WHO STAYED
              Getting to know each other, trying to be friends
              ═══════════════════════════════════════════════════════ */}

            {/* CHAPTER 1 TITLE PAGE */}
            <Page number={2}>
              <div className="chapter-title-page">
                <div className="chapter-label">chapter one</div>
                <div className="chapter-rule" />
                <h1 className="chapter-name">The Stranger Who Stayed</h1>
                <div className="chapter-rule" />
                <p className="chapter-sub">
                  a college, an awkward "hi", and a gut feeling that this one was different.
                </p>
              </div>
            </Page>

            {/* CH1 — the awkward hi */}
            <Page number={3}>
              <br></br>
              <h5 className="ink-title" style={{ fontSize: "16px" }}>
                an awkward, judgy little "hi"✋😃
              </h5>
              <br></br>
              <Ornament />
              <p className="ink-body" style={{ fontSize: "13px" }}>
                I'll never forget our first day of college. We suddenly looked at each other, and
                you were staring a bit awkwardly, so I just waved and said "hi" from a distance. I
                know I was being super judgy at the time! But honestly, I know you fell in love with
                me right then. Don't even try to deny it!
              </p>
              {/* UPDATED: Link converted to trigger the video popup */}
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsVideoOpen(true);
                }}
                onPointerDownCapture={stopPageFlip}
                onMouseDownCapture={stopPageFlip}
                onTouchStartCapture={stopPageFlip}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="ink-hand mt-3 block text-[#4A2E1B] hover:text-[#2c1b10] underline cursor-pointer"
              >
                Evidence of your instant crush
              </p>
            </Page>

            {/* CH1 — the maths crush + strategic bestie */}
            <Page number={4}>
              <h2 className="ink-title" style={{ fontSize: "18px" }}>
                Math genius🧠 = certified hottie😏
              </h2>
              <Ornament />
              <p className="ink-body" style={{ fontSize: "13px" }}>
                Then came the maths class. You solved a problem before anyone else in the room and
                something inside me just went — <em>oh my god</em>. Solving a sum faster than the
                whole class is genuinely the hottest thing I have ever witnessed. I don't make the
                rules.
              </p>
              <p className="ink-body mt-2" style={{ fontSize: "13px" }}>
                And right there, a very serious internal decision was made:
              </p>
              <p className="ink-hand mt-2 text-[var(--burgundy-deep)]" style={{ fontSize: "15px" }}>
                "bhai, kaam ka banda hai. mera CGPA badh jayega. rakh leti hoon isko." 🎯
              </p>
              <p className="ink-body mt-2" style={{ fontSize: "13px" }}>
                And that, your honour, is the strategic origin story of the greatest friendship of
                my life. You're welcome.
              </p>
            </Page>

            {/* CH1 — the bond forming naturally */}
            <Page number={5}>
              <br></br> <br></br>
              <h2 className="ink-title" style={{ fontSize: "18px" }}>
                two "Just Friends", slowly becoming a habit
              </h2>
              <p className="ink-body" style={{ fontSize: "12px" }}>
                It all started with you explaining a math problem to me. Because your attendance was
                so low, I became the one giving you my class notes and keeping you updated on
                submission dates and assignment deadlines. Before I knew it, you were the person I’d
                look for in a crowd. Choosing you as my project partner turned out to be the best
                decision I ever made. It gave us a reason to interact every day, and it kept us
                together right until Final year.
              </p>
              <p className="ink-body text-xs mt-2" style={{ fontSize: "12px" }}>
                We weren't "best friends" yet — not officially — but something was already settling
                into place. Like the universe was quietly arranging the furniture for what was
                coming next.
              </p>
              <RevealBox label="the first thing i noticed about you (that i never told you)">
                <p className="ink-body" style={{ fontSize: "13px" }}>
                  you listened. like, actually listened. not the nodding-while-scrolling kind. you'd
                  remember things i said weeks ago and bring them up like they mattered. that's when
                  i thought — okay, this one's real.
                </p>
              </RevealBox>
            </Page>

            {/* ═══════════════════════════════════════════════════════
              CHAPTER 2 — THE BESTIE ERA
              Inseparable besties, VCs, TPs, healthy flirting
              ═══════════════════════════════════════════════════════ */}

            {/* CHAPTER 2 TITLE PAGE */}
            <Page number={6}>
              <div className="chapter-title-page">
                <div className="chapter-label">chapter two</div>
                <div className="chapter-rule" />
                <h1 className="chapter-name">The Bestie Era</h1>
                <div className="chapter-rule" />
                <p className="chapter-sub">
                  2 am video calls, every update shared, healthy flirting disguised as friendship,
                  and a bond no one else understood.
                </p>
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsPalatVideoOpen(true);
                  }}
                  onPointerDownCapture={stopPageFlip}
                  onMouseDownCapture={stopPageFlip}
                  onTouchStartCapture={stopPageFlip}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="ink-hand mt-3 block text-[#4A2E1B] hover:text-[#2c1b10] underline cursor-pointer"
                  style={{ fontSize: "13px" }}
                >
                  proof that you loved me when we were besties 💕
                </p>
              </div>
            </Page>

            {/* CH2 — late night calls, the real bond */}
            <Page number={7}>
              <h2 className="ink-title" style={{ fontSize: "18px" }}>
                we never forced it. it just grew.
              </h2>

              <p className="ink-body" style={{ fontSize: "13px" }}>
                The friendship was never planned. It just kept extending — quietly, naturally — as
                our bond got stronger. No effort, no scheduling, no "let's be closer". It just
                happened.
              </p>
              <p className="ink-body mt-2" style={{ fontSize: "13px" }}>
                Then came the late-night video calls the night before every exam. Endless
                discussions. Doubts, theories, dumb tangents, more doubts. You'd sit and actually
                explain a maths problem to me with your whole heart, virtually, at 2am, like it was
                the most important thing in the world.
              </p>
              <p className="ink-body mt-2" style={{ fontSize: "13px" }}>
                I still remember that one 2am voice note — one, maybe two minutes — where you
                patiently walked me through a sum I was stuck on. That was the exact moment I
                thought:
              </p>
              <p className="ink-hand mt-2 text-[var(--burgundy-deep)]" style={{ fontSize: "15px" }}>
                i chose the best man to be my best friend.
              </p>
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsImageOpen(true);
                }}
                onPointerDownCapture={stopPageFlip}
                onMouseDownCapture={stopPageFlip}
                onTouchStartCapture={stopPageFlip}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="ink-hand mt-3 block text-[#4A2E1B] hover:text-[#2c1b10] underline cursor-pointer"
                style={{ fontSize: "13px" }}
              >
                dattu the super power questions💛
              </p>
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsVcVideoOpen(true);
                }}
                onPointerDownCapture={stopPageFlip}
                onMouseDownCapture={stopPageFlip}
                onTouchStartCapture={stopPageFlip}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="ink-hand mt-1 block text-[#4A2E1B] hover:text-[#2c1b10] underline cursor-pointer"
                style={{ fontSize: "13px" }}
              >
                us on video call 📹
              </p>
            </Page>

            {/* CH2 — every update, every TP, the inseparable era */}
            <Page number={8}>
              <h2 className="ink-title" style={{ fontSize: "18px" }}>
                you were my first call. always.
              </h2>
              <Ornament />
              <p className="ink-body" style={{ fontSize: "13px" }}>
                Good news? You heard it first. Bad day? You heard it first. Random screenshot of a
                meme at 3 am? Obviously you. We were giving each other every tiny update like it was
                breaking news.
              </p>
              <p className="ink-body mt-2" style={{ fontSize: "13px" }}>
                TPs became "our thing." Video calls that started as study sessions and ended four
                hours later with us talking about absolutely nothing — and somehow everything.
              </p>
              <p className="ink-body mt-2" style={{ fontSize: "13px" }}>
                People around us probably thought we were dating. We weren't.
              </p>
              <p className="ink-hand mt-3 text-[var(--burgundy-deep)]" style={{ fontSize: "13px" }}>
                ❤︎ we were best friends who held on a little too tight. and neither of us wanted to
                let go.❤︎
              </p>
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsMahalaxmiOpen(true);
                }}
                onPointerDownCapture={stopPageFlip}
                onMouseDownCapture={stopPageFlip}
                onTouchStartCapture={stopPageFlip}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="ink-hand mt-1 block text-[#4A2E1B] hover:text-[#2c1b10] underline cursor-pointer"
                style={{ fontSize: "12px" }}
              >
                tap to see the proof that people use to thing that we were a thing
              </p>
            </Page>

            {/* CH2 — TML event + tiny crush + healthy flirting */}
            <Page number={9}>
              <h2 className="ink-title" style={{ fontSize: "18px" }}>
                the tml event — okay, you looked good.
              </h2>
              <Ornament />
              <div className="grid gap-3 sm:grid-cols-2">
                <Polaroid caption="us — TML event 📸" rotate={-3} imageSrc="/TML.jpeg" />
                <div>
                  <p className="ink-body" style={{ fontSize: "13px" }}>
                    Our TML event in college. You showed up looking genuinely really nice, and for
                    the first time I caught myself thinking —{" "}
                    <em>oh wow, i think i have a tiny crush on him too.</em>
                  </p>
                  <p className="ink-body mt-2" style={{ fontSize: "13px" }}>
                    The flirting was always there — disguised as sarcasm, wrapped in jokes, hidden
                    inside compliments we pretended were casual. But we both knew. We always knew.
                  </p>
                </div>
              </div>
            </Page>

            {/* CH2 — signature day + the shift */}
            <Page number={10}>
              <h2 className="ink-title" style={{ fontSize: "18px" }}>
                the day i finally caught you
              </h2>
              <Ornament />
              <div className="grid gap-3 sm:grid-cols-2">
                <Polaroid caption="signature day 📸" rotate={2} imageSrc="/signature.jpeg" />
                <div>
                  <p className="ink-body" style={{ fontSize: "13px" }}>
                    Signature day. The last real day of college. And that's the day it clicked for
                    me — the way you were behaving with me was
                    <em> not </em>the way a friend behaves with a friend.
                  </p>
                  <p className="ink-body mt-2" style={{ fontSize: "13px" }}>
                    Little glances. Extra attention. That soft, slightly nervous energy. That was
                    the day I quietly realised: this boy likes me as more than a friend. And
                    honestly? I loved knowing.
                  </p>
                </div>
              </div>
            </Page>

            {/* ═══════════════════════════════════════════════════════
              CHAPTER 3 — AND THEN, ONE DAY — US.
              The relationship — month by month
              ═══════════════════════════════════════════════════════ */}

            {/* CHAPTER 3 VIDEO */}
            <Page number={13}>
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <video
                  controls
                  preload="metadata"
                  className="max-h-full max-w-full object-contain"
                  aria-label="Our story video"
                >
                  <source src="/AI.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-center font-bold text-red-700" style={{ fontSize: "12px" }}>
                ♡︎ If we were together, this would totally be our vibe ♡︎
              </p>
            </Page>

            {/* CHAPTER 3 TITLE PAGE */}
            <Page number={14}>
              <div className="chapter-title-page">
                <div className="chapter-label">chapter three</div>
                <div className="chapter-rule" />
                <h1 className="chapter-name">And Then, One Day — Us.</h1>
                <div className="chapter-rule" />
                <p className="chapter-sub">
                  september 2025 → september 2026. twelve months of choosing each other. every
                  single day.
                </p>
              </div>
            </Page>

            {/* SEPT 2025 — the plot twist */}
            <Page number={15}>
              <MonthHeader month="September" year="2025" tag="the plot twist" />
              <h2 className="ink-title" style={{ fontSize: "18px" }}>
                the label finally changed
              </h2>
              <Ornament />
              <p className="ink-body" style={{ fontSize: "13px" }}>
                We started holding hands early on. It might not have been the literal first time you
                held my hand, but it was the very first time I truly felt it—the first time I
                realized that something was undeniably right. I felt safe. I felt secure. From that
                exact moment, I actually started thinking about us. And then, you told a song
                started playing in your head -{" "}
                <em>
                  <b>I Think They Call This Love.</b>
                </em>
                Suddenly, the label on this whole thing shifted. Five years of friendship quietly
                rearranged themselves into something with a heartbeat and a name. Ours.
              </p>
              <AudioReveal label="play our song 🎵" src="/love_song.mp3" />
              <RevealBox
                className="page-15-reveal"
                label="the exact moment i knew this was different"
              >
                <p className="ink-body" style={{ fontSize: "13px" }}>
                  It wasn't loud. It wasn't cinematic. We never even had a big, dramatic confession
                  about our feelings. We just fit together, as effortlessly and perfectly as two
                  puzzle pieces sliding into place. And in that quiet comfort, I knew my search was
                  finally over.
                </p>
              </RevealBox>
            </Page>

            {/* FIRST NAVRATRI + FIRST NIGHT STAY */}
            <Page number={16}>
              <br></br>
              {/* <MonthHeader month="October" year="2025" tag="our first navratri" /> */}
              <h2 className="ink-title" style={{ fontSize: "18px" }}>
                our first festival together
              </h2>
              <Ornament />
              <p className="ink-body" style={{ fontSize: "13px" }}>
                Our first Navratri together felt so special — full of colour, laughter, and the kind
                of memories I know I will keep forever. And then came our first night stay at home
                together, quiet and comfortable, just being us.
              </p>
              <Polaroid
                caption="our first navratri together"
                rotate={2}
                imageSrc="/navratri.jpeg"
              />
              <p className="ink-body page-16-note" style={{ fontSize: "13px" }}>
                The way you respected my boundaries was such a gentleman thing to do, baby. I am
                truly proud to have a man like you in this world.
              </p>
            </Page>

            {/* NOV 2025 — simplified layout */}
            <Page number={17}>
              <br></br>
              <h2 className="ink-title" style={{ fontSize: "18px" }}>
                marine drive, forever
              </h2>
              <Ornament />

              <p className="ink-body" style={{ fontSize: "12px" }}>
                Ever since I first saw Marine Drive in the movies, I dreamed of going there with my
                "one." Being there with you made that dream a reality, and it was honestly the best
                day of my life. From spending the day at the mall to the magic of Marine Drive , and
                then our night stay together—I just love having you be a part of my every moment.
              </p>

              <Polaroid
                caption="marine drive — my favourite frame"
                rotate={-3}
                imageSrc="/marines.jpeg"
              />

              <p className="ink-body mt-2" style={{ fontSize: "12px" }}>
                I still think about how much I was craving McDonald's, and how you went out of your
                way to find it just to see me smile. You made sure the entire day was exactly what I
                wanted: romantic, completely free of time restrictions, and filled with the best
                food. You gave me the day I had always dreamed of, and I will never, ever forget it.
              </p>
            </Page>

            {/* DEC 2025 */}
            <Page number={18}>
              {/* <MonthHeader month="December" year="2025" tag="birthday month × 2" /> */}
              <h2 className="ink-title" style={{ fontSize: "15px" }}>
                🎉🎂21st &amp; 27th December 2025🎂🎉
              </h2>
              <Ornament />
              <p className="ink-body" style={{ fontSize: "10px" }}>
                I know the first thing you think of when I say "our birthdays" is the tan removal,
                but please let's move past that! 😅 Seriously though, I appreciate you so much for
                traveling from Kharghar to Dombivli at 6 AM on just 4 hours of sleep. You know how
                important it is for me to celebrate on the exact day, and you made it absolutely
                perfect. I know my plans for your birthday fell a bit short, but I promise I will
                make it up to you next time!
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Polaroid caption="my 21st — us" imageSrc="/sakbday.jpeg" rotate={-4}   />
                <Polaroid caption="his 27th — us" imageSrc="/27bday.jpeg" rotate={3} />
              </div>
            </Page>

            {/* BHOOT VIDEO PAGE */}
            <Page number={19}>
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
                <div className="flex w-full items-center justify-center">
                  <BookVideo
                    controls
                    preload="metadata"
                    className="w-[60%] max-w-[500px] rounded-md object-contain shadow-lg"
                    aria-label="Bhoot memory video"
                  >
                    <source src="/bhoot-vid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </BookVideo>
                </div>
                <p className="text-center font-bold text-red-700" style={{ fontSize: "12px" }}>
                  I just wanted to remind you of how happy you looked when we took our first photo
                  booth pictures together!😚🫶
                </p>
              </div>
            </Page>

            {/* JAN 2026 */}
            <Page number={20}>
              <MonthHeader month="January" year="2026" tag="soft new year" />
              <h2 className="ink-title" style={{ fontSize: "15px" }}>
                a year that started with you in it
              </h2>
              <Ornament />
              <p className="ink-body" style={{ fontSize: "12px" }}>
                For the first time, "new year" felt less like a checklist and more like a
                continuation. Same you. Same me. Just… a bigger us. This year started with the most
                beautiful core memory: finally watching Duranadar together. It was our very first
                solo movie date, and after a whole month of planning, seeing how genuinely excited
                you were made the entire experience so incredibly special.
              </p>
              <div className="page-19-video-wrap">
                <BookVideo
                  className="page-19-video"
                  src="/durandar.mp4"
                  controls
                  preload="metadata"
                  playsInline
                >
                  Your browser does not support the video tag.
                </BookVideo>
              </div>
              {/* <Quiz
             question="best new year resolution we actually kept?"
             options={["talk more", "fight less", "eat everything together", "we didn't keep any"]}
           /> */}
            </Page>

            {/* FEB 2026 */}
            <Page number={21}>
              {/* <MonthHeader month="February" year="2026" tag="first valentine 🌹" /> */}

              <h2 className="ink-title" style={{ fontSize: "18px" }}>
                v-day, unlocked💝
              </h2>
              <Ornament />
              <div className="page-20-copy">
                <p className="ink-body" style={{ fontSize: "12px" }}>
                  Yay for our first Valentine’s Day! I know you usually find this whole holiday a
                  little bit cringe and aren't really into these things, but since it was our first
                  one together, I was determined to make it special. And honestly, I think I
                  succeeded! We had such an amazing time celebrating.🥳
                </p>
                <p className="ink-body" style={{ fontSize: "13px" }}>
                  Thank you for putting up with my excitement and letting me be a little cheesy. The
                  best part of the day wasn't just the celebration, but seeing that you are always
                  willing to step out of your comfort zone just to see me smile.🫶🏻
                </p>
              </div>
              <Polaroid
                caption="feb 14, 2026 — finally ours"
                imageSrc="/valentine.jpeg"
                rotate={-2}
              />
            </Page>

            {/* MAR 2026 — KOKAN */}
            <Page number={22}>
              <h2 className="ink-title" style={{ fontSize: "18px" }}>
                the day i knew, for real
              </h2>
              <Ornament />
              <p className="ink-body" style={{ fontSize: "11px" }}>
                After February, things got a little more serious. I know you changed for the better,
                but it was still a massive adjustment for me. I’ll admit, I was sad and caught in a
                loop of overthinking, doubting how we would survive this phase because I wanted so
                badly for us to work. Our meetups dropped to just once a month, and you matured so
                quickly in this relationship. I'm not saying you were wrong or bad for it, but I
                still craved those lovey-dovey wala couple moments. I wanted to love you like we
                were a brand-new couple—with the surprises, the frequent meetups, and the romantic
                dates. Eventually, I accepted the shift. I realized I needed to step back from just
                dreaming and actually focus on building our future together. March to June were
                incredibly hard months for me, and I won't ever forget them. But through all that
                struggle, one thing became crystal clear: no matter our conflicts or differences, I
                just want us to work out. Okay, enough of the serious stuff! That's a wrap, and I
                really hope you loved this digital book of our 365 days together.
              </p>
            </Page>

            {/* LAST RED PAGE */}
            <Page number={29}>
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="chip">the end (not really)</div>
                <h2 className="ink-title mt-4">happy one year, my love.</h2>
                <Ornament />
                <p className="ink-body max-w-sm">
                  thank you for being the plot twist, the friend, the person, the song, the reason.
                  see you on page one of year two.
                </p>
                <div className="ink-hand mt-5 text-xl">— yours, always 💌</div>
              </div>
            </Page>

            {/* FINAL VIDEO PAGE */}
            <Page number={31}>
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
                <div className="flex w-full items-center justify-center">
                  <BookVideo
                    controls
                    preload="metadata"
                    className="w-[72%] max-w-[440px] rounded-md object-contain shadow-lg"
                    aria-label="Final video of us"
                  >
                    <source src="/final-last.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </BookVideo>
                </div>
                <p className="text-center font-bold text-red-700" style={{ fontSize: "14px" }}>
                  This is my fav video of us the lyrics fit in perfectly Ily baby🫶🏻🥹
                </p>
              </div>
            </Page>

            {/* BACK COVER — outer ornate blue & gold (back half of spread) */}
            <Page cover>
              <div
                className="absolute inset-0 cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Close the notebook"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAttemptClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAttemptClose();
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                style={{
                  backgroundImage: `url(${backCoverUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 grid place-items-center"
                style={{ zIndex: 4 }}
              >
                <div className="text-center px-6">
                  <div className="font-display italic text-[var(--gold-soft)] text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                    fin.
                  </div>
                  <div className="mx-auto my-2 h-px w-10 bg-[var(--gold-soft)] opacity-80" />
                  <div className="font-display uppercase tracking-[0.3em] text-[var(--gold-soft)] mt-2 text-[10px] opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                    close gently
                  </div>
                </div>
              </div>
            </Page>
          </HTMLFlipBook>

          {/* Video overlay — centered on book */}
          {isVideoOpen && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setIsVideoOpen(false);
              }}
            >
              <div
                className="relative w-[36%] max-w-md rounded-lg overflow-hidden shadow-2xl border-2 border-[var(--gold)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVideoOpen(false);
                  }}
                  className="absolute top-2 right-2 z-10 bg-black/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-lg hover:bg-black cursor-pointer"
                  aria-label="Close video"
                >
                  &times;
                </button>
                <BookVideo
                  controls
                  autoPlay
                  className="w-full h-auto block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <source src="/Vid-1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </BookVideo>
              </div>
            </div>
          )}

          {/* Image overlay — centered on book */}
          {isImageOpen && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageOpen(false);
              }}
            >
              <div
                className="relative w-[70%] max-w-sm rounded-lg overflow-hidden shadow-2xl border-2 border-[var(--gold)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageOpen(false);
                  }}
                  className="absolute top-2 right-2 z-10 bg-black/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-lg hover:bg-black cursor-pointer"
                  aria-label="Close image"
                >
                  &times;
                </button>
                <img src="/dattu.jpeg" alt="the bestie" className="w-full h-auto block" />
              </div>
            </div>
          )}

          {/* Mahalaxmi image overlay — centered on book */}
          {isMahalaxmiOpen && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setIsMahalaxmiOpen(false);
              }}
            >
              <div
                className="relative max-h-[85vh] w-[70%] max-w-sm rounded-lg overflow-hidden shadow-2xl border-2 border-[var(--gold)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMahalaxmiOpen(false);
                  }}
                  className="absolute top-2 right-2 z-10 bg-black/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-lg hover:bg-black cursor-pointer"
                  aria-label="Close image"
                >
                  &times;
                </button>
                <img
                  src="/mahalaxmi.jpeg"
                  alt="proof that people thought we were a thing"
                  className="block h-auto max-h-[80vh] w-auto max-w-full object-contain"
                />
              </div>
            </div>
          )}

          {/* VC Video overlay — centered on book */}
          {isVcVideoOpen && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setIsVcVideoOpen(false);
              }}
            >
              <div
                className="relative w-[36%] max-w-md rounded-lg overflow-hidden shadow-2xl border-2 border-[var(--gold)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVcVideoOpen(false);
                  }}
                  className="absolute top-2 right-2 z-10 bg-black/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-lg hover:bg-black cursor-pointer"
                  aria-label="Close video"
                >
                  &times;
                </button>
                <BookVideo
                  controls
                  autoPlay
                  className="w-full h-auto block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <source src="/ai-math.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </BookVideo>
              </div>
            </div>
          )}

          {/* Palat Video overlay — centered on book */}
          {isPalatVideoOpen && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setIsPalatVideoOpen(false);
              }}
            >
              <div
                className="relative w-[36%] max-w-md rounded-lg overflow-hidden shadow-2xl border-2 border-[var(--gold)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPalatVideoOpen(false);
                  }}
                  className="absolute top-2 right-2 z-10 bg-black/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-lg hover:bg-black cursor-pointer"
                  aria-label="Close video"
                >
                  &times;
                </button>
                <BookVideo
                  controls
                  autoPlay
                  className="w-full h-auto block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <source src="/palat.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </BookVideo>
              </div>
            </div>
          )}
        </div>
      </div>

      {showEnd && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm px-4 fade-up">
          <div className="w-full max-w-lg rounded-lg border border-[var(--gold)]/50 bg-[var(--burgundy-deep)]/95 p-7 text-center shadow-2xl">
            <div className="font-display uppercase tracking-[0.35em] text-[10px] text-[var(--gold-soft)]/80">
              interval
            </div>
            <div className="gold-shimmer mt-3 font-display font-bold text-2xl sm:text-3xl leading-snug">
              ye toh bas trailer tha,
              <br />
              picture abhi baki hai mere dost 🎬
            </div>
            <div className="mx-auto my-4 h-px w-16 bg-[var(--gold-soft)] opacity-70" />
            <p className="font-display italic text-[var(--cream)]/90 text-lg">
              one year down — many, many more ahead.
            </p>
            <p className="font-hand mt-3 text-[var(--gold-soft)] text-xl">
              see you on page one of year two 💌
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => {
                  setIsBookClosing(false);
                  setShowEnd(false);
                  bookRef.current?.pageFlip?.()?.turnToPage?.(0);
                }}
                className="rounded-md border border-[var(--gold)]/50 px-4 py-2 font-display text-sm text-[var(--gold-soft)] hover:bg-[var(--gold)]/10"
              >
                read again
              </button>
              <button
                onClick={() => {
                  setIsBookClosing(false);
                  setShowEnd(false);
                  onClose();
                }}
                className="rounded-md bg-[var(--gold)] px-5 py-2 font-display text-sm font-semibold text-[var(--burgundy-deep)] hover:brightness-110"
              >
                close the book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
