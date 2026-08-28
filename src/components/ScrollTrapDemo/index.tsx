import React, { useEffect, useRef, useState } from "react";

import styles from "./styles.module.css";

type Example = "internalScroll" | "gestureLock" | "fixed";

const examples: Array<{
  id: Example;
  label: string;
}> = [
  {
    id: "internalScroll",
    label: "Internal scroll",
  },
  {
    id: "gestureLock",
    label: "No scrollbar trap",
  },
  {
    id: "fixed",
    label: "Fixed",
  },
];

export default function ScrollTrapDemo(): React.ReactElement {
  const [activeExample, setActiveExample] = useState<Example>("internalScroll");
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

    const removeGestureTrap = addWheelTrap(gestureTrapRef.current);

    return () => {
      removeGestureTrap?.();
    };
  }, [activeExample]);

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
        <p className={styles.instructions}>
          Hover the mock app and try to scroll the feed.
        </p>

        <MockFeed>
          {activeExample === "internalScroll" ? (
            <div
              className={`${styles.app} ${styles.rejectedApp}`}
              role="region"
              aria-label="Rejected inline app with internal scrolling"
            >
              <div className={styles.appLabel}>Rejected</div>
              <h3>Internal app scroll blocks the feed</h3>
              <p>
                The inline app has its own scrollable content. When the inner
                panel reaches the top or bottom, the feed still does not take
                over.
              </p>
              <div className={styles.innerScroller} tabIndex={0}>
                <div>Round 1: Choose a loadout</div>
                <div>Round 2: Pick a path</div>
                <div>Round 3: Claim a reward</div>
                <div>Round 4: Open the shop</div>
                <div>Round 5: Upgrade an item</div>
                <div>Round 6: Start another run</div>
                <div>Round 7: Check the leaderboard</div>
                <div>Round 8: Invite a friend</div>
              </div>
              <code className={styles.codeLine}>
                overscroll-behavior: contain;
              </code>
            </div>
          ) : null}

          {activeExample === "gestureLock" ? (
            <div
              ref={gestureTrapRef}
              className={`${styles.app} ${styles.rejectedApp}`}
              role="region"
              aria-label="Rejected inline app that traps gestures without internal scrolling"
            >
              <div className={styles.appLabel}>Rejected</div>
              <h3>No scrollbar, still trapped</h3>
              <p>
                A full-surface game, canvas, or map uses gesture-locking CSS. It
                looks fixed, but scroll input cannot escape the inline surface.
              </p>
              <div className={styles.fixedSurface}>Fixed app surface</div>
              <code className={styles.codeLine}>
                touch-action: none; overscroll-behavior: none;
              </code>
            </div>
          ) : null}

          {activeExample === "fixed" ? (
            <div
              className={`${styles.app} ${styles.acceptableApp}`}
              role="region"
              aria-label="Acceptable inline app that allows feed scrolling"
            >
              <div className={styles.appLabel}>Acceptable</div>
              <h3>Inline lets the feed scroll</h3>
              <p>
                The inline view is fixed-height and uses buttons or taps for
                interaction. Vertical scroll gestures remain available to
                Reddit.
              </p>
              <div className={styles.fixedSurface}>
                Fixed preview with no internal scroll
              </div>
              <code className={styles.codeLine}>
                touch-action: pan-y; overscroll-behavior: auto;
              </code>
            </div>
          ) : null}
        </MockFeed>
      </div>
    </section>
  );
}

function MockFeed({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.feed}>
      <div className={styles.feedItem}>
        <span>Feed item before the app</span>
      </div>

      {children}

      <div className={styles.feedItem}>
        <span>Feed item after the app</span>
      </div>
    </div>
  );
}
