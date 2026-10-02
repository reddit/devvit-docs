import React, { useEffect, useMemo, useState } from "react";
import Heading from "@theme/Heading";

import styles from "./styles.module.css";

type CheckStatus = "empty" | "question" | "yes" | "no" | "exception";
type DomainKind = "public-api" | "ai-provider" | "personal";
type RejectionReason = "invalid" | "ai-provider" | "personal";
type HelperMode = "check" | "find";
type AlternativeUseCase =
  | "ai"
  | "weather"
  | "sports"
  | "finance"
  | "news"
  | "messaging"
  | "reference"
  | "language"
  | "media";

type CheckResult = {
  status: CheckStatus;
  title: string;
  description: string;
  normalizedDomain?: string;
  rejectionReason?: RejectionReason;
};

type AlternativeRecommendation = {
  label: string;
  description: string;
  domains: string[];
};

const GLOBAL_ALLOWLIST = new Set([
  "api.openai.com",
  "generativelanguage.googleapis.com",
  "example.com",
  "site.api.espn.com",
  "cdn.espn.com",
  "discord.com",
  "api.polygon.io",
  "api.massive.com",
  "polygon.io",
  "slack.com",
  "lichess.org",
  "api.telegram.org",
  "commentanalyzer.googleapis.com",
  "language.googleapis.com",
  "statsapi.mlb.com",
  "api.scryfall.com",
  "api.nasa.gov",
  "api.sportradar.us",
  "api.sportradar.com",
  "random.org",
  "youtube.googleapis.com",
  "api.weather.gov",
  "wikipedia.org",
  "finance.yahoo.com",
  "api.twitter.com",
  "api.petfinder.com",
  "fonts.googleapis.com",
  "nytimes.com",
  "npr.org",
  "propublica.org",
  "pbs.org",
  "i.giphy.com",
  "chessboardjs.com",
]);

const LIMITED_SCOPE_CLOUD_PROVIDERS = [
  "supabase.com",
  "firebase.com",
  "spacetimedb.com",
  "s3.amazonaws.com",
  "storage.googleapis.com",
];

const NON_APPROVED_AI_PROVIDER_DOMAINS = [
  "anthropic.com",
  "mistral.ai",
  "cohere.com",
  "x.ai",
  "groq.com",
];

const DOMAIN_KINDS: Array<{
  value: DomainKind;
  label: string;
  detail: string;
}> = [
  {
    value: "public-api",
    label: "Public API",
    detail: "Publicly documented and publicly accessible",
  },
  {
    value: "ai-provider",
    label: "AI provider",
    detail: "Models, inference, or other AI services",
  },
  {
    value: "personal",
    label: "Personal or private",
    detail: "Your own server or a non-public API",
  },
];

const ALTERNATIVE_USE_CASES: Record<
  AlternativeUseCase,
  AlternativeRecommendation
> = {
  ai: {
    label: "Generative AI",
    description: "OpenAI and Google Gemini are the approved AI providers.",
    domains: ["api.openai.com", "generativelanguage.googleapis.com"],
  },
  weather: {
    label: "Weather",
    description:
      "The US National Weather Service provides a public weather API.",
    domains: ["api.weather.gov"],
  },
  sports: {
    label: "Sports",
    description:
      "These allowed providers cover general and league-specific sports data.",
    domains: [
      "site.api.espn.com",
      "statsapi.mlb.com",
      "api.sportradar.us",
      "api.sportradar.com",
    ],
  },
  finance: {
    label: "Finance and markets",
    description: "These allowed providers offer financial and market data.",
    domains: [
      "api.polygon.io",
      "api.massive.com",
      "polygon.io",
      "finance.yahoo.com",
    ],
  },
  news: {
    label: "News and public-interest data",
    description:
      "These allowed publishers provide news or public-interest reporting.",
    domains: ["nytimes.com", "npr.org", "propublica.org", "pbs.org"],
  },
  messaging: {
    label: "Messaging and notifications",
    description:
      "These allowed services can support messaging and notification workflows.",
    domains: ["discord.com", "slack.com", "api.telegram.org"],
  },
  reference: {
    label: "Reference and public data",
    description:
      "These allowed APIs provide reference, science, and other public data.",
    domains: [
      "wikipedia.org",
      "api.nasa.gov",
      "api.scryfall.com",
      "api.petfinder.com",
      "random.org",
    ],
  },
  language: {
    label: "Language and content analysis",
    description:
      "These allowed Google APIs support language and content analysis.",
    domains: ["commentanalyzer.googleapis.com", "language.googleapis.com"],
  },
  media: {
    label: "Media and assets",
    description:
      "These allowed services provide media, video, fonts, or UI assets.",
    domains: [
      "youtube.googleapis.com",
      "i.giphy.com",
      "fonts.googleapis.com",
      "chessboardjs.com",
    ],
  },
};

const ALTERNATIVE_USE_CASE_OPTIONS = Object.entries(
  ALTERNATIVE_USE_CASES,
) as Array<
  [AlternativeUseCase, (typeof ALTERNATIVE_USE_CASES)[AlternativeUseCase]]
>;

function isSameDomainOrSubdomain(domain: string, baseDomain: string): boolean {
  return domain === baseDomain || domain.endsWith(`.${baseDomain}`);
}

function normalizeDomain(input: string): {
  domain: string;
  formatError?: string;
} {
  const value = input.trim().toLowerCase();

  if (!value) {
    return { domain: "" };
  }

  if (value.includes("*")) {
    return {
      domain: value,
      formatError: "Wildcards are not allowed. Enter the exact hostname.",
    };
  }

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    return {
      domain: value,
      formatError: "Remove the protocol and enter only the hostname.",
    };
  }

  try {
    const url = new URL(`https://${value}`);
    const domain = url.hostname.replace(/\.$/, "");

    if (url.username || url.password || url.port) {
      return {
        domain,
        formatError:
          "Credentials and ports are not allowed. Enter only the hostname.",
      };
    }

    if (url.pathname !== "/" || url.search || url.hash || value.includes("/")) {
      return {
        domain,
        formatError: "Paths, query strings, and fragments are not allowed.",
      };
    }

    return { domain };
  } catch {
    return {
      domain: value,
      formatError: "Enter a valid hostname, such as api.example.com.",
    };
  }
}

function isValidHostname(domain: string): boolean {
  if (!domain || domain.length > 253 || !domain.includes(".")) {
    return false;
  }

  return domain.split(".").every((label) => {
    return (
      label.length > 0 &&
      label.length <= 63 &&
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
    );
  });
}

function checkDomain(
  input: string,
  domainKind: DomainKind | null,
): CheckResult {
  const { domain, formatError } = normalizeDomain(input);

  if (!domain) {
    return {
      status: "empty",
      title: "Enter a domain",
      description: "Use the exact hostname you plan to add to devvit.json.",
    };
  }

  if (formatError || !isValidHostname(domain)) {
    return {
      status: "no",
      title: "No",
      description:
        formatError ??
        "Domain entries must be exact hostnames, such as api.example.com.",
      normalizedDomain: domain,
      rejectionReason: "invalid",
    };
  }

  if (GLOBAL_ALLOWLIST.has(domain)) {
    return {
      status: "yes",
      title: "Yes",
      description:
        "This hostname is on the global fetch allowlist. Add the exact hostname to your app's HTTP permissions.",
      normalizedDomain: domain,
    };
  }

  if (
    NON_APPROVED_AI_PROVIDER_DOMAINS.some((baseDomain) =>
      isSameDomainOrSubdomain(domain, baseDomain),
    )
  ) {
    return {
      status: "no",
      title: "No",
      description:
        "OpenAI and Google Gemini are currently the only allowed AI providers.",
      normalizedDomain: domain,
      rejectionReason: "ai-provider",
    };
  }

  if (
    LIMITED_SCOPE_CLOUD_PROVIDERS.some((baseDomain) =>
      isSameDomainOrSubdomain(domain, baseDomain),
    )
  ) {
    return {
      status: "exception",
      title: "Request exception",
      description:
        "This limited-scope cloud provider may be approved with justification. Request the most granular hostname possible and explain which Devvit server capability does not meet your needs.",
      normalizedDomain: domain,
    };
  }

  if (domainKind === "public-api") {
    return {
      status: "yes",
      title: "Yes",
      description:
        "Publicly documented and publicly accessible APIs are eligible for approval. Include the API documentation and your use case with the request.",
      normalizedDomain: domain,
    };
  }

  if (domainKind === "ai-provider") {
    return {
      status: "no",
      title: "No",
      description:
        "OpenAI and Google Gemini are currently the only allowed AI providers.",
      normalizedDomain: domain,
      rejectionReason: "ai-provider",
    };
  }

  if (domainKind === "personal") {
    return {
      status: "no",
      title: "No",
      description:
        "Personal domains and non-public APIs are not approved by default. A detailed exception request may be considered when Devvit server capabilities cannot support the use case.",
      normalizedDomain: domain,
      rejectionReason: "personal",
    };
  }

  return {
    status: "question",
    title: "One more detail",
    description:
      "Select the option that describes how this domain will be used.",
    normalizedDomain: domain,
  };
}

function SuggestedDomainResults({
  recommendation,
  copiedDomain,
  onCopyDomain,
}: {
  recommendation: AlternativeRecommendation;
  copiedDomain?: string | null;
  onCopyDomain?: (domain: string) => void;
}): React.ReactElement {
  return (
    <div className={styles.alternativeResults} aria-live="polite">
      <strong>{recommendation.label}</strong>
      <p>{recommendation.description}</p>
      <ul
        className={
          onCopyDomain ? styles.finderDomainList : styles.suggestedDomains
        }
      >
        {recommendation.domains.map((suggestedDomain) => (
          <li key={suggestedDomain}>
            <code>{suggestedDomain}</code>
            {onCopyDomain ? (
              <button
                type="button"
                className={styles.copyDomainButton}
                onClick={() => onCopyDomain(suggestedDomain)}
                aria-label={
                  copiedDomain === suggestedDomain
                    ? `${suggestedDomain} copied`
                    : `Copy ${suggestedDomain}`
                }
              >
                {copiedDomain === suggestedDomain ? "Copied" : "Copy"}
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FetchDomainChecker(): React.ReactElement {
  const [mode, setMode] = useState<HelperMode>("check");
  const [domain, setDomain] = useState("");
  const [domainKind, setDomainKind] = useState<DomainKind | null>(null);
  const [alternativeUseCase, setAlternativeUseCase] =
    useState<AlternativeUseCase | null>(null);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const result = useMemo(
    () => checkDomain(domain, domainKind),
    [domain, domainKind],
  );
  const shouldAskDomainKind =
    result.status === "question" || domainKind !== null;
  const suggestedUseCase =
    result.rejectionReason === "ai-provider" ? "ai" : alternativeUseCase;
  const suggestedAlternatives = suggestedUseCase
    ? ALTERNATIVE_USE_CASES[suggestedUseCase]
    : null;
  const finderRecommendation = alternativeUseCase
    ? ALTERNATIVE_USE_CASES[alternativeUseCase]
    : null;
  const shouldShowAlternatives =
    result.status === "no" && result.rejectionReason !== "invalid";

  useEffect(() => {
    const getModeFromHash = (): HelperMode | null => {
      return window.location.hash === "#find-an-api"
        ? "find"
        : window.location.hash === "#fetch-domain-checker"
          ? "check"
          : null;
    };

    const syncModeToHash = () => {
      const nextMode = getModeFromHash();

      if (nextMode) {
        setMode(nextMode);
      }
    };

    const initialMode = getModeFromHash();
    if (initialMode) {
      setMode(initialMode);
      window.requestAnimationFrame(() => {
        document
          .getElementById(
            initialMode === "find" ? "find-an-api" : "fetch-domain-checker",
          )
          ?.scrollIntoView({ block: "start" });
      });
    }

    window.addEventListener("hashchange", syncModeToHash);
    window.addEventListener("popstate", syncModeToHash);
    return () => {
      window.removeEventListener("hashchange", syncModeToHash);
      window.removeEventListener("popstate", syncModeToHash);
    };
  }, []);

  const selectMode = (
    event: React.MouseEvent<HTMLAnchorElement>,
    nextMode: HelperMode,
  ) => {
    event.preventDefault();
    setMode(nextMode);
    window.history.pushState(
      null,
      "",
      nextMode === "find" ? "#find-an-api" : "#fetch-domain-checker",
    );
  };

  const updateAlternativeUseCase = (value: AlternativeUseCase | null) => {
    setAlternativeUseCase(value);
    setCopiedDomain(null);
  };

  const updateDomain = (value: string) => {
    setDomain(value);
    setDomainKind(null);
    setAlternativeUseCase(null);
    setCopiedDomain(null);
  };

  const updateDomainKind = (value: DomainKind) => {
    setDomainKind(value);
    setAlternativeUseCase(null);
    setCopiedDomain(null);
  };

  const copyDomain = async (suggestedDomain: string) => {
    try {
      await window.navigator.clipboard.writeText(suggestedDomain);
      setCopiedDomain(suggestedDomain);
    } catch {
      setCopiedDomain(null);
    }
  };

  return (
    <section
      className={styles.checker}
      aria-labelledby={
        mode === "check" ? "fetch-domain-checker" : "find-an-api"
      }
    >
      <div className={styles.header}>
        <div hidden={mode !== "check"}>
          <Heading as="h2" id="fetch-domain-checker" className={styles.title}>
            Check a fetch domain
          </Heading>
          <p className={styles.description}>
            Get a policy check before adding a hostname to your app.
          </p>
        </div>
        <div hidden={mode !== "find"}>
          <Heading as="h2" id="find-an-api" className={styles.title}>
            Find an API
          </Heading>
          <p className={styles.description}>
            Start with a use case and explore relevant globally allowed domains.
          </p>
        </div>
      </div>

      <nav className={styles.modeTabs} aria-label="Domain helper mode">
        <a
          className={mode === "check" ? styles.activeModeTab : styles.modeTab}
          href="#fetch-domain-checker"
          aria-current={mode === "check" ? "location" : undefined}
          onClick={(event) => selectMode(event, "check")}
        >
          Check a domain
        </a>
        <a
          className={mode === "find" ? styles.activeModeTab : styles.modeTab}
          href="#find-an-api"
          aria-current={mode === "find" ? "location" : undefined}
          onClick={(event) => selectMode(event, "find")}
        >
          Find an API
        </a>
      </nav>

      <div className={styles.body}>
        <div
          id="check-domain-panel"
          className={styles.modePanel}
          hidden={mode !== "check"}
        >
          <div className={styles.formRow}>
            <label className={styles.label} htmlFor="fetch-domain-input">
              Exact hostname
            </label>
            <input
              id="fetch-domain-input"
              className={styles.input}
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="api.example.com"
              value={domain}
              onChange={(event) => updateDomain(event.target.value)}
              aria-describedby="fetch-domain-hint"
            />
            <span id="fetch-domain-hint" className={styles.hint}>
              No protocol, path, port, or wildcard.
            </span>
          </div>

          {shouldAskDomainKind &&
          result.status !== "no" &&
          result.status !== "exception" ? (
            <fieldset className={styles.kindFieldset}>
              <legend className={styles.label}>
                What kind of domain is it?
              </legend>
              <div className={styles.kindOptions}>
                {DOMAIN_KINDS.map((option) => (
                  <label key={option.value} className={styles.kindOption}>
                    <input
                      type="radio"
                      name="fetch-domain-kind"
                      value={option.value}
                      checked={domainKind === option.value}
                      onChange={() => updateDomainKind(option.value)}
                    />
                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.detail}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div
            className={styles.result}
            data-status={result.status}
            aria-live="polite"
          >
            <div className={styles.resultHeading}>
              <span className={styles.statusMark} aria-hidden="true" />
              <strong className={styles.resultTitle}>{result.title}</strong>
            </div>
            {result.normalizedDomain ? (
              <code className={styles.domain}>{result.normalizedDomain}</code>
            ) : null}
            <p className={styles.resultDescription}>{result.description}</p>
          </div>

          {shouldShowAlternatives ? (
            <aside
              className={styles.alternatives}
              aria-labelledby="fetch-domain-alternatives"
            >
              <h3
                id="fetch-domain-alternatives"
                className={styles.alternativesTitle}
              >
                Suggested alternatives
              </h3>
              {result.rejectionReason === "personal" ? (
                <label className={styles.alternativePicker}>
                  <span className={styles.label}>
                    What are you trying to do?
                  </span>
                  <select
                    className={styles.select}
                    value={alternativeUseCase ?? ""}
                    onChange={(event) =>
                      updateAlternativeUseCase(
                        (event.target.value ||
                          null) as AlternativeUseCase | null,
                      )
                    }
                  >
                    <option value="">Select a use case</option>
                    {ALTERNATIVE_USE_CASE_OPTIONS.map(([value, option]) => (
                      <option key={value} value={value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {suggestedAlternatives ? (
                <SuggestedDomainResults
                  recommendation={suggestedAlternatives}
                />
              ) : (
                <p className={styles.alternativePrompt}>
                  Choose a use case to see relevant globally allowed domains.
                </p>
              )}

              <AlternativeDisclaimer />
            </aside>
          ) : null}
        </div>

        <div
          id="find-api-panel"
          className={styles.modePanel}
          hidden={mode !== "find"}
        >
          <label
            className={styles.alternativePicker}
            htmlFor="find-api-use-case"
          >
            <span className={styles.label}>What does your app need?</span>
            <select
              id="find-api-use-case"
              className={styles.select}
              value={alternativeUseCase ?? ""}
              onChange={(event) =>
                updateAlternativeUseCase(
                  (event.target.value || null) as AlternativeUseCase | null,
                )
              }
            >
              <option value="">Select a use case</option>
              {ALTERNATIVE_USE_CASE_OPTIONS.map(([value, option]) => (
                <option key={value} value={value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {finderRecommendation ? (
            <SuggestedDomainResults
              recommendation={finderRecommendation}
              copiedDomain={copiedDomain}
              onCopyDomain={copyDomain}
            />
          ) : (
            <p className={styles.finderPrompt}>
              Choose the closest use case to see relevant globally allowed
              domains.
            </p>
          )}

          <AlternativeDisclaimer />
        </div>

        <p className={styles.disclaimer}>
          This helper provides policy guidance, not approval. Domain requests
          are reviewed when you playtest or upload your app.
        </p>
      </div>
    </section>
  );
}

function AlternativeDisclaimer(): React.ReactElement {
  return (
    <p className={styles.alternativeNote}>
      These are potential alternatives, not guaranteed replacements. Confirm
      that the API supports your requirements, authentication method, and
      permitted usage.{" "}
      <a href="#global-fetch-allowlist">View the full allowlist</a>.
    </p>
  );
}
