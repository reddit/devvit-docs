import React, { useEffect, useRef, useState } from "react";

import styles from "./styles.module.css";

type Example = "internalScroll" | "gestureLock" | "fixed";

const mobileExamples: Record<
  Example,
  {
    code: string;
    details: string;
    outcome: string;
    title: string;
  }
> = {
  fixed: {
    code: "touch-action: pan-y;",
    details: "Swipe the green surface. The page should keep moving.",
    outcome: "Acceptable: vertical swipes stay with the feed.",
    title: "Feed stays scrollable",
  },
  gestureLock: {
    code: "touch-action: none;",
    details: "Swipe the orange surface. It captures the gesture.",
    outcome: "Rejected: no scrollbar, but still trapped.",
    title: "No scrollbar can still trap swipes",
  },
  internalScroll: {
    code: "overflow-y: auto;",
    details: "Swipe the mini list. It scrolls inside the post.",
    outcome: "Rejected: nested scrolling competes with the feed.",
    title: "Internal scrolling competes with the feed",
  },
};

const examples: Array<{
  id: Example;
  label: string;
}> = [
  {
    id: "internalScroll",
    label: "Internal scroll trap",
  },
  {
    id: "gestureLock",
    label: "No scrollbar trap",
  },
  {
    id: "fixed",
    label: "Feed stays scrollable",
  },
];

export default function ScrollTrapDemo(): React.ReactElement {
  const [activeExample, setActiveExample] = useState<Example>("internalScroll");
  const isTouchDemo = useTouchDemo();
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const gestureTrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const addWheelTrap = (element: HTMLDivElement | null) => {
      if (!element) {
        return undefined;
      }

      const onWheel = (event: WheelEvent) => {
        event.preventDefault();
      };

      element.addEventListener("wheel", onWheel, { passive: false });
      return () => element.removeEventListener("wheel", onWheel);
    };

    const removeGestureTrap = isTouchDemo
      ? undefined
      : addWheelTrap(gestureTrapRef.current);

    return () => {
      removeGestureTrap?.();
    };
  }, [activeExample, isTouchDemo]);

  return (
    <section className={styles.wrapper} aria-label="Scroll trap examples">
      <div className={styles.tabs} role="tablist" aria-label="Example type">
        {examples.map((example) => (
          <button
            aria-controls={`scroll-trap-panel-${example.id}`}
            aria-selected={activeExample === example.id}
            className={
              activeExample === example.id ? styles.activeTab : styles.tab
            }
            id={`scroll-trap-tab-${example.id}`}
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            role="tab"
            type="button"
          >
            {example.label}
          </button>
        ))}
      </div>

      <div
        className={styles.panel}
        id={`scroll-trap-panel-${activeExample}`}
        role="tabpanel"
        aria-labelledby={`scroll-trap-tab-${activeExample}`}
      >
        {isTouchDemo ? (
          <MobileExample activeExample={activeExample} />
        ) : (
          <div className={styles.feedViewport}>
            <div className={styles.feedCanvas}>
              <PlainMockPost
                label="Mock app"
                title="Community Check-in"
                votes="18"
                comments="4"
              />
              <MockPost>
                {activeExample === "internalScroll" ? (
                  <InternalScrollApp scrollerRef={internalScrollRef} />
                ) : null}

                {activeExample === "gestureLock" ? (
                  <GestureLockApp ref={gestureTrapRef} />
                ) : null}

                {activeExample === "fixed" ? <FixedApp /> : null}
              </MockPost>
              <PlainMockPost
                label="Mock app"
                title="Weekly Scoreboard"
                votes="31"
                comments="9"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function useTouchDemo(): boolean {
  const [isTouchDemo, setIsTouchDemo] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");

    const syncInputMode = () => setIsTouchDemo(mediaQuery.matches);
    syncInputMode();

    mediaQuery.addEventListener("change", syncInputMode);
    return () => mediaQuery.removeEventListener("change", syncInputMode);
  }, []);

  return isTouchDemo;
}

function MobileExample({ activeExample }: { activeExample: Example }) {
  const example = mobileExamples[activeExample];
  const isAccepted = activeExample === "fixed";
  const gestureTrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeExample !== "gestureLock") {
      return undefined;
    }

    const element = gestureTrapRef.current;
    if (!element) {
      return undefined;
    }

    const stopScroll = (event: TouchEvent | WheelEvent) => {
      event.preventDefault();
    };

    element.addEventListener("touchmove", stopScroll, { passive: false });
    element.addEventListener("wheel", stopScroll, { passive: false });

    return () => {
      element.removeEventListener("touchmove", stopScroll);
      element.removeEventListener("wheel", stopScroll);
    };
  }, [activeExample]);

  return (
    <article className={`${styles.post} ${styles.mobilePost}`}>
      <PostMeta name="sample-scroll-trap-app" time="11 hr. ago" avatar="S" />
      <h3 className={styles.postTitle}>Daily Game #116</h3>
      <span className={styles.flair}>Daily Game</span>

      <div
        className={`${styles.mobileAppSurface} ${
          isAccepted
            ? styles.mobileAcceptedSurface
            : styles.mobileRejectedSurface
        }`}
      >
        <AppToolbar status={isAccepted ? "Acceptable" : "Rejected"} />
        <div className={styles.mobileExampleHeader}>
          <h4>{example.title}</h4>
        </div>
        <p>{example.details}</p>
        <strong>{example.outcome}</strong>
        <div className={styles.mobileSwipeDemo}>
          {activeExample === "internalScroll" ? (
            <div className={styles.mobileNestedScroller}>
              <span>Swipe this nested list</span>
              <button type="button">Share score</button>
              <button type="button">View leaderboard</button>
              <button type="button">Claim streak bonus</button>
              <button type="button">Play again tomorrow</button>
            </div>
          ) : null}

          {activeExample === "gestureLock" ? (
            <div className={styles.mobileGestureSurface} ref={gestureTrapRef}>
              Swipe this fixed surface
            </div>
          ) : null}

          {activeExample === "fixed" ? (
            <div className={styles.mobilePassThroughSurface}>
              Swipe here; the page should keep moving
            </div>
          ) : null}
        </div>
        <code>{example.code}</code>
      </div>

      <PostFooter votes="42" comments="18" />
    </article>
  );
}

function PlainMockPost({
  comments,
  label,
  title,
  votes,
}: {
  comments: string;
  label: string;
  title: string;
  votes: string;
}) {
  return (
    <article className={`${styles.post} ${styles.plainPost}`}>
      <PostMeta name="sample-app" time="8 hr. ago" avatar="W" />
      <h3 className={styles.postTitle}>{title}</h3>
      <span className={styles.flair}>Community App</span>
      <div className={styles.plainAppSurface}>
        <div className={styles.plainAppHeader}>
          <strong>{label}</strong>
          <span>Preview</span>
        </div>
        <div className={styles.plainAppGrid}>
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <PostFooter votes={votes} comments={comments} />
    </article>
  );
}

function MockPost({ children }: { children: React.ReactNode }) {
  return (
    <article className={styles.post}>
      <PostMeta name="sample-scroll-trap-app" time="11 hr. ago" avatar="S" />
      <h3 className={styles.postTitle}>Daily Game #116</h3>
      <span className={styles.flair}>Daily Game</span>
      {children}
      <PostFooter votes="42" comments="18" />
    </article>
  );
}

function PostMeta({
  avatar,
  name,
  time,
}: {
  avatar: string;
  name: string;
  time: string;
}) {
  return (
    <div className={styles.postMeta}>
      <span className={styles.avatar}>{avatar}</span>
      <strong>{name}</strong>
      <span className={styles.appBadge}>App</span>
      <span>{time}</span>
      <span className={styles.moreButton}>...</span>
    </div>
  );
}

function PostFooter({ comments, votes }: { comments: string; votes: string }) {
  return (
    <div className={styles.postFooter}>
      <span className={styles.privacyLink}>
        <span className={`${styles.icon} ${styles.infoIcon}`} />
        Privacy
      </span>
      <div className={styles.footerActions}>
        <span className={styles.votePill}>
          <span className={`${styles.icon} ${styles.upvoteIcon}`} />
          {votes}
          <span className={`${styles.icon} ${styles.downvoteIcon}`} />
        </span>
        <span className={styles.actionPill}>
          <span className={`${styles.icon} ${styles.commentIcon}`} />
          {comments}
        </span>
        <span className={styles.actionPill}>
          <span className={`${styles.icon} ${styles.refreshIcon}`} />
        </span>
        <span className={styles.actionPill}>
          <span className={`${styles.icon} ${styles.shareIcon}`} />
          Share
        </span>
      </div>
    </div>
  );
}

function InternalScrollApp({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      className={`${styles.appSurface} ${styles.rejectedSurface}`}
      role="region"
      aria-label="Rejected inline app with internal scrolling"
    >
      <AppToolbar status="Rejected" />
      <div className={styles.appBody}>
        <div className={styles.centerPanel}>
          <h4>Internal app scroll blocks the feed</h4>
          <p>
            Try it: hover over this nested list and scroll. The app captures the
            scroll instead of letting the feed keep moving.
          </p>
          <div
            className={styles.innerScroller}
            onMouseEnter={() => scrollerRef.current?.focus()}
            ref={scrollerRef}
            tabIndex={0}
          >
            <div>
              <strong>Daily run complete</strong>
              <span>Score 186 points and keep a 4 day streak.</span>
            </div>
            <button type="button">Share score</button>
            <button type="button">Comment on the post</button>
            <button type="button">Join subreddit</button>
            <button type="button">View leaderboard</button>
            <button type="button">Claim streak bonus</button>
            <button type="button">Invite a friend</button>
            <button type="button">Play again tomorrow</button>
          </div>
          <code>overscroll-behavior: contain;</code>
        </div>
      </div>
    </div>
  );
}

const GestureLockApp = React.forwardRef<HTMLDivElement>(
  function GestureLockApp(_props, ref) {
    return (
      <div
        className={`${styles.appSurface} ${styles.rejectedSurface}`}
        ref={ref}
        role="region"
        aria-label="Rejected inline app that traps gestures without internal scrolling"
      >
        <AppToolbar status="Rejected" />
        <div className={styles.appBody}>
          <div className={styles.centerPanel}>
            <h4>No scrollbar, still trapped</h4>
            <p>
              Try it: hover over this fixed surface and scroll. No scrollbar
              appears, but the app still blocks the feed.
            </p>
            <div
              className={`${styles.previewBoard} ${styles.gestureTrapBoard}`}
            >
              <div className={styles.previewCard}>
                Fixed canvas or game area
              </div>
            </div>
            <code>touch-action: none; overscroll-behavior: none;</code>
          </div>
        </div>
      </div>
    );
  },
);

function FixedApp() {
  return (
    <div
      className={`${styles.appSurface} ${styles.acceptableSurface}`}
      role="region"
      aria-label="Acceptable inline app that allows feed scrolling"
    >
      <AppToolbar status="Acceptable" />
      <div className={styles.appBody}>
        <div className={styles.centerPanel}>
          <h4>Inline lets the feed scroll</h4>
          <p>
            Try it: hover over this preview and scroll. The app leaves vertical
            scrolling with the feed.
          </p>
          <div className={styles.previewBoard}>
            <div className={styles.previewCard}>
              Fixed preview with no scroll
            </div>
          </div>
          <code>touch-action: pan-y; overscroll-behavior: auto;</code>
        </div>
      </div>
    </div>
  );
}

function AppToolbar({ status }: { status: "Rejected" | "Acceptable" }) {
  return (
    <div className={styles.appToolbar}>
      <div>
        <span className={styles.iconButton}>r/</span>
        <span className={styles.iconButton}>?</span>
      </div>
      <span
        className={
          status === "Rejected" ? styles.rejectedPill : styles.acceptablePill
        }
      >
        {status}
      </span>
    </div>
  );
}
