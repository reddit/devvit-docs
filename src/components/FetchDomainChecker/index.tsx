import React, { useEffect, useMemo, useState } from "react";
import Admonition from "@theme/Admonition";
import Heading from "@theme/Heading";

import styles from "./styles.module.css";

type CheckStatus = "empty" | "question" | "yes" | "no" | "exception";
type PolicyAnswer = "yes" | "no" | null;
type PolicyAnswers = {
  aiProvider: PolicyAnswer;
  personalOrPrivate: PolicyAnswer;
  publiclyDocumented: PolicyAnswer;
  publiclyAccessible: PolicyAnswer;
  rulesCompliant: PolicyAnswer;
};
type RejectionReason =
  | "invalid"
  | "ai-provider"
  | "personal"
  | "not-public"
  | "policy-conflict";
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
  showPolicyQuestions?: boolean;
  requirements?: string[];
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
  "openrouter.ai",
  "anthropic.com",
  "mistral.ai",
  "cohere.com",
  "x.ai",
  "groq.com",
];

const EMPTY_POLICY_ANSWERS: PolicyAnswers = {
  aiProvider: null,
  personalOrPrivate: null,
  publiclyDocumented: null,
  publiclyAccessible: null,
  rulesCompliant: null,
};

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

function checkDomain(input: string, policyAnswers: PolicyAnswers): CheckResult {
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
      title: "Globally allowed",
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
      title: "Not allowed",
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
      title: "Exception review required",
      description:
        "Limited-scope cloud providers are not approved through the standard public API path. Approval is possible only when the exception requirements are met.",
      normalizedDomain: domain,
      requirements: [
        "Request the most granular hostname possible.",
        "Follow user privacy and data governance requirements.",
        "Demonstrate a capability that @devvit/server does not support.",
        "Use it only for a valid exception use case, such as a relational database.",
        "Provide a detailed justification for the exception.",
      ],
    };
  }

  if (policyAnswers.aiProvider === "yes") {
    return {
      status: "no",
      title: "Not allowed",
      description:
        "OpenAI and Google Gemini are currently the only allowed AI providers. This applies to AI gateways and public AI APIs too.",
      normalizedDomain: domain,
      rejectionReason: "ai-provider",
      showPolicyQuestions: true,
    };
  }

  if (policyAnswers.personalOrPrivate === "yes") {
    return {
      status: "no",
      title: "Normally not eligible",
      description:
        "Personal domains and private services are not approved by default, even if their API is documented. A detailed exception request may be considered when Devvit server capabilities cannot support the use case.",
      normalizedDomain: domain,
      rejectionReason: "personal",
      showPolicyQuestions: true,
    };
  }

  if (
    policyAnswers.publiclyDocumented === "no" ||
    policyAnswers.publiclyAccessible === "no"
  ) {
    return {
      status: "no",
      title: "Does not meet standard requirements",
      description:
        "The standard approval path requires both public documentation and public accessibility. Without both, the request would need an exceptional justification.",
      normalizedDomain: domain,
      rejectionReason: "not-public",
      showPolicyQuestions: true,
    };
  }

  if (policyAnswers.rulesCompliant === "no") {
    return {
      status: "no",
      title: "Not eligible",
      description:
        "Domain requests must support a valid use case and follow the Devvit rules, including applicable AI-provider and account-linking policies.",
      normalizedDomain: domain,
      rejectionReason: "policy-conflict",
      showPolicyQuestions: true,
    };
  }

  if (Object.values(policyAnswers).some((answer) => answer === null)) {
    return {
      status: "question",
      title: "Check the service details",
      description:
        "Answer each question independently. Restricted service types take precedence over public API eligibility.",
      normalizedDomain: domain,
      showPolicyQuestions: true,
    };
  }

  return {
    status: "yes",
    title: "Eligible for review",
    description:
      "This domain appears to meet the baseline requirements, however, approval is not guaranteed and will be determined during app review.",
    normalizedDomain: domain,
    showPolicyQuestions: true,
    requirements: [
      "Link to the public API documentation.",
      "Explain the valid use case and why the domain is needed.",
      "Follow the Devvit rules and applicable account-linking policies.",
      "Document the fetch domain and its purpose in your app README.",
    ],
  };
}

function PolicyQuestion({
  id,
  question,
  detail,
  value,
  onChange,
}: {
  id: string;
  question: string;
  detail: string;
  value: PolicyAnswer;
  onChange: (value: Exclude<PolicyAnswer, null>) => void;
}): React.ReactElement {
  const labelId = `${id}-label`;

  return (
    <div
      className={styles.policyQuestion}
      role="group"
      aria-labelledby={labelId}
    >
      <div id={labelId} className={styles.policyQuestionText}>
        <strong>{question}</strong>
        <small>{detail}</small>
      </div>
      <div className={styles.answerOptions}>
        {(["yes", "no"] as const).map((answer) => (
          <label key={answer} className={styles.answerOption}>
            <input
              type="radio"
              name={id}
              value={answer}
              checked={value === answer}
              onChange={() => onChange(answer)}
            />
            <span>{answer === "yes" ? "Yes" : "No"}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function DomainRecommendationResults({
  recommendation,
  copiedDomain,
  onCopyDomain,
}: {
  recommendation: AlternativeRecommendation;
  copiedDomain: string | null;
  onCopyDomain: (domain: string) => void;
}): React.ReactElement {
  return (
    <div className={styles.alternativeResults} aria-live="polite">
      <strong>{recommendation.label}</strong>
      <p>{recommendation.description}</p>
      <ul className={styles.finderDomainList}>
        {recommendation.domains.map((suggestedDomain) => (
          <li key={suggestedDomain}>
            <code>{suggestedDomain}</code>
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FetchDomainChecker(): React.ReactElement {
  const [mode, setMode] = useState<HelperMode>("check");
  const [domain, setDomain] = useState("");
  const [policyAnswers, setPolicyAnswers] = useState<PolicyAnswers>({
    ...EMPTY_POLICY_ANSWERS,
  });
  const [alternativeUseCase, setAlternativeUseCase] =
    useState<AlternativeUseCase | null>(null);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const result = useMemo(
    () => checkDomain(domain, policyAnswers),
    [domain, policyAnswers],
  );
  const finderRecommendation = alternativeUseCase
    ? ALTERNATIVE_USE_CASES[alternativeUseCase]
    : null;
  const shouldShowFinderLink =
    result.status === "no" &&
    ["ai-provider", "personal", "not-public"].includes(
      result.rejectionReason ?? "",
    );

  useEffect(() => {
    const getModeFromHash = (): HelperMode | null => {
      return ["#find-a-domain", "#find-an-api"].includes(window.location.hash)
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
            initialMode === "find" ? "find-a-domain" : "fetch-domain-checker",
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
    useCase?: AlternativeUseCase | null,
  ) => {
    event.preventDefault();
    setMode(nextMode);
    if (useCase !== undefined) {
      updateAlternativeUseCase(useCase);
    }
    window.history.pushState(
      null,
      "",
      nextMode === "find" ? "#find-a-domain" : "#fetch-domain-checker",
    );
  };

  const updateAlternativeUseCase = (value: AlternativeUseCase | null) => {
    setAlternativeUseCase(value);
    setCopiedDomain(null);
  };

  const updateDomain = (value: string) => {
    setDomain(value);
    setPolicyAnswers({ ...EMPTY_POLICY_ANSWERS });
    setAlternativeUseCase(null);
    setCopiedDomain(null);
  };

  const updatePolicyAnswer = (
    key: keyof PolicyAnswers,
    value: Exclude<PolicyAnswer, null>,
  ) => {
    setPolicyAnswers((currentAnswers) => {
      const nextAnswers = { ...currentAnswers, [key]: value };

      if (key === "aiProvider") {
        nextAnswers.personalOrPrivate = null;
        nextAnswers.publiclyDocumented = null;
        nextAnswers.publiclyAccessible = null;
        nextAnswers.rulesCompliant = null;
      } else if (key === "personalOrPrivate") {
        nextAnswers.publiclyDocumented = null;
        nextAnswers.publiclyAccessible = null;
        nextAnswers.rulesCompliant = null;
      } else if (key === "publiclyDocumented") {
        nextAnswers.publiclyAccessible = null;
        nextAnswers.rulesCompliant = null;
      } else if (key === "publiclyAccessible") {
        nextAnswers.rulesCompliant = null;
      }

      return nextAnswers;
    });
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
        mode === "check" ? "fetch-domain-checker" : "find-a-domain"
      }
    >
      <div className={styles.header}>
        <div hidden={mode !== "check"}>
          <Heading as="h2" id="fetch-domain-checker" className={styles.title}>
            Check a Fetch Domain
          </Heading>
          <p className={styles.description}>
            Get a policy check before adding a hostname to your app.
          </p>
        </div>
        <div hidden={mode !== "find"}>
          <Heading as="h2" id="find-a-domain" className={styles.title}>
            Find a Domain
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
          Check a Domain
        </a>
        <a
          className={mode === "find" ? styles.activeModeTab : styles.modeTab}
          href="#find-a-domain"
          aria-current={mode === "find" ? "location" : undefined}
          onClick={(event) => selectMode(event, "find")}
        >
          Find a Domain
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

          {result.showPolicyQuestions ? (
            <div
              className={styles.policyQuestions}
              aria-labelledby="fetch-domain-policy-questions"
            >
              <div>
                <strong
                  id="fetch-domain-policy-questions"
                  className={styles.label}
                >
                  Tell us about the service
                </strong>
                <p className={styles.policyHint}>
                  Answer in order. Restricted service types take precedence.
                </p>
              </div>
              <PolicyQuestion
                id="fetch-domain-ai-provider"
                question="Does it provide AI models, inference, or AI routing?"
                detail="Public AI APIs and gateways still count."
                value={policyAnswers.aiProvider}
                onChange={(value) => updatePolicyAnswer("aiProvider", value)}
              />
              {policyAnswers.aiProvider === "no" ? (
                <PolicyQuestion
                  id="fetch-domain-personal"
                  question="Is this a personal domain or private service you control?"
                  detail="Includes personal servers and non-public APIs."
                  value={policyAnswers.personalOrPrivate}
                  onChange={(value) =>
                    updatePolicyAnswer("personalOrPrivate", value)
                  }
                />
              ) : null}
              {policyAnswers.aiProvider === "no" &&
              policyAnswers.personalOrPrivate === "no" ? (
                <PolicyQuestion
                  id="fetch-domain-public-documentation"
                  question="Is the API documentation publicly available?"
                  detail="Reviewers must be able to verify how the API works."
                  value={policyAnswers.publiclyDocumented}
                  onChange={(value) =>
                    updatePolicyAnswer("publiclyDocumented", value)
                  }
                />
              ) : null}
              {policyAnswers.publiclyDocumented === "yes" ? (
                <PolicyQuestion
                  id="fetch-domain-public-access"
                  question="Can the public obtain access to the API?"
                  detail="Authentication is okay when access is not limited to private or internal users."
                  value={policyAnswers.publiclyAccessible}
                  onChange={(value) =>
                    updatePolicyAnswer("publiclyAccessible", value)
                  }
                />
              ) : null}
              {policyAnswers.publiclyAccessible === "yes" ? (
                <PolicyQuestion
                  id="fetch-domain-rules-compliance"
                  question="Does the intended use follow the Devvit rules and applicable policies?"
                  detail="This includes AI-provider and account-linking restrictions."
                  value={policyAnswers.rulesCompliant}
                  onChange={(value) =>
                    updatePolicyAnswer("rulesCompliant", value)
                  }
                />
              ) : null}
            </div>
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
            {result.requirements ? (
              <div className={styles.resultRequirements}>
                <strong>Requirements</strong>
                <ul>
                  {result.requirements.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {shouldShowFinderLink ? (
            <p className={styles.finderLinkPrompt}>
              Need another option?{" "}
              <a
                href="#find-a-domain"
                onClick={(event) =>
                  selectMode(
                    event,
                    "find",
                    result.rejectionReason === "ai-provider" ? "ai" : null,
                  )
                }
              >
                {result.rejectionReason === "ai-provider"
                  ? "View allowed AI domains"
                  : "Find a globally allowed domain"}
              </a>
              .
            </p>
          ) : null}
        </div>

        <div
          id="find-domain-panel"
          className={styles.modePanel}
          hidden={mode !== "find"}
        >
          <label
            className={styles.alternativePicker}
            htmlFor="find-domain-use-case"
          >
            <span className={styles.label}>What does your app need?</span>
            <select
              id="find-domain-use-case"
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
            <DomainRecommendationResults
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

        <Admonition type="note">
          This helper provides policy guidance, not approval. Domain requests
          are reviewed when you playtest or upload your app.
        </Admonition>
      </div>
    </section>
  );
}

function AlternativeDisclaimer(): React.ReactElement {
  return (
    <p className={styles.alternativeNote}>
      These are potential alternatives, not guaranteed replacements. Confirm
      that the service supports your requirements, authentication method, and
      permitted usage.{" "}
      <a href="#global-fetch-allowlist">View the full allowlist</a>.
    </p>
  );
}
