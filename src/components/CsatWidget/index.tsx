import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import React, { useEffect, useMemo, useState } from 'react';

import styles from './styles.module.css';

const CSAT_STORAGE_PREFIX = 'devvit_docs_csat_submitted:';

declare global {
  interface Window {
    sendV2Event?: (event: unknown) => void;
  }
}

function getStorageKey(pathname: string): string {
  return `${CSAT_STORAGE_PREFIX}${pathname}`;
}

function getReferrerInfo(): { url?: string; domain?: string } {
  if (!document.referrer) {
    return {};
  }

  try {
    const referrerUrl = new URL(document.referrer);
    return {
      url: document.referrer,
      domain: referrerUrl.host,
    };
  } catch {
    return {
      url: document.referrer,
    };
  }
}

type ScoreOption = {
  label: string;
  value: number;
  emoji: string;
  reaction: 'positive' | 'negative';
};

const SCORE_OPTIONS: ScoreOption[] = [
  {
    label: 'Thumbs down',
    value: 1,
    emoji: '👎',
    reaction: 'negative',
  },
  {
    label: 'Thumbs up',
    value: 5,
    emoji: '👍',
    reaction: 'positive',
  },
];

const NEGATIVE_REASON_OPTIONS = [
  'The page is unclear',
  'Important details are missing',
  'The instructions did not work',
];

export default function CsatWidget(): React.ReactElement | null {
  const { pathname } = useLocation();
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const storageKey = useMemo(() => getStorageKey(pathname), [pathname]);
  const shouldShowForPath = useMemo(() => {
    const normalizedPath = pathname.replace(/\/+$/, '') || '/';
    return normalizedPath !== '/' && normalizedPath !== '/docs';
  }, [pathname]);

  const sendEvent = (action: string, details: Record<string, unknown>) => {
    if (typeof window === 'undefined' || typeof window.sendV2Event !== 'function') {
      return;
    }

    window.sendV2Event({
      source: 'docs_csat_widget',
      action,
      noun: 'csat',
      action_info: {
        page_type: 'dev_portal_docs',
        page_path: pathname,
        ...details,
      },
      request: {
        base_url: window.location.href,
      },
      referrer: getReferrerInfo(),
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!shouldShowForPath) {
      setSelectedScore(null);
      setFeedback('');
      setSelectedReasons([]);
      setIsSubmitted(false);
      setIsVisible(false);
      return;
    }

    const hasSubmitted = window.sessionStorage.getItem(storageKey) === '1';
    setSelectedScore(null);
    setFeedback('');
    setSelectedReasons([]);
    setIsSubmitted(false);
    setIsVisible(!hasSubmitted);

    if (!hasSubmitted) {
      sendEvent('view', { widget: 'docs_csat' });
    }
  }, [storageKey, shouldShowForPath]);

  const dismiss = () => {
    sendEvent('dismiss', { widget: 'docs_csat' });
    setIsVisible(false);
  };

  const submit = (score: number, extraDetails: Record<string, unknown> = {}) => {
    if (typeof window === 'undefined') {
      return;
    }

    sendEvent('submit', {
      widget: 'docs_csat',
      score,
      ...extraDetails,
    });

    window.sessionStorage.setItem(storageKey, '1');
    setIsSubmitted(true);
    window.setTimeout(() => {
      setIsVisible(false);
    }, 1200);
  };

  const onScoreSelect = (option: ScoreOption) => {
    const score = option.value;
    setSelectedScore(score);
    if (option.reaction === 'positive') {
      setSelectedReasons([]);
      setFeedback('');
    }

    sendEvent('select_score', {
      widget: 'docs_csat',
      score,
      reaction: option.reaction,
    });

    if (option.reaction === 'positive') {
      submit(score, {
        reaction: option.reaction,
        feedback: '',
        reasons: [],
      });
    }
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons((current) =>
      current.includes(reason) ? current.filter((item) => item !== reason) : [...current, reason]
    );
  };

  const submitNegativeFeedback = () => {
    if (selectedScore !== 1) {
      return;
    }

    const trimmedFeedback = feedback.trim();
    submit(selectedScore, {
      reaction: 'negative',
      feedback: trimmedFeedback,
      reasons: selectedReasons,
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p className={styles.title}>How helpful was this page?</p>
        <button
          className={styles.closeButton}
          type="button"
          aria-label="Close feedback widget"
          onClick={dismiss}
        >
          &times;
        </button>
      </div>
      <div className={styles.scoreRow}>
        {SCORE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            className={clsx(styles.scoreButton, {
              [styles.scoreButtonSelected]: selectedScore === option.value,
            })}
            onClick={() => onScoreSelect(option)}
          >
            <span className={styles.scoreEmoji} aria-hidden>
              {option.emoji}
            </span>
          </button>
        ))}
      </div>
      {selectedScore === 1 && !isSubmitted && (
        <div className={styles.feedback}>
          <p className={styles.feedbackTitle}>Additional feedback (optional)</p>
          <textarea
            className={styles.textarea}
            placeholder="Optional: what should we improve?"
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
          />
          <div className={styles.reasonList}>
            {NEGATIVE_REASON_OPTIONS.map((reason) => (
              <label key={reason} className={styles.reasonItem}>
                <input
                  type="checkbox"
                  checked={selectedReasons.includes(reason)}
                  onChange={() => toggleReason(reason)}
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
          <button className={styles.submitButton} type="button" onClick={submitNegativeFeedback}>
            Send feedback
          </button>
        </div>
      )}
      {isSubmitted && <div className={styles.thanks}>Thanks for the feedback!</div>}
    </div>
  );
}
