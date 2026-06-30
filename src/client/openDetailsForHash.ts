type HashLocation = {
  hash: string;
};

type RouteUpdateArgs = {
  location: HashLocation;
};

const headingSelector = "h1, h2, h3, h4, h5, h6";
const faqLinkButtonClass = "faq-answer-link";
const openRetryDurationMs = 5000;
const openRetryIntervalMs = 150;

function getHashId(location: HashLocation): string | null {
  if (!location.hash) {
    return null;
  }

  const hashWithoutPrefix = location.hash.slice(1);
  const hashBeforeTextFragment = hashWithoutPrefix.split(":~:")[0];

  if (!hashBeforeTextFragment) {
    return null;
  }

  try {
    return decodeURIComponent(hashBeforeTextFragment);
  } catch {
    return hashBeforeTextFragment;
  }
}

function getTargetElement(id: string): HTMLElement | null {
  return (
    document.getElementById(id) ??
    (document.getElementsByName(id)[0] as HTMLElement | undefined) ??
    null
  );
}

function expandDetails(details: HTMLDetailsElement): void {
  if (details.open && details.dataset.collapsed !== "true") {
    return;
  }

  const summary = details.querySelector(":scope > summary");

  if (summary instanceof HTMLElement) {
    summary.click();
    return;
  }

  details.open = true;
}

function openAncestorDetails(element: HTMLElement): HTMLDetailsElement | null {
  const details = element.closest("details");

  if (details instanceof HTMLDetailsElement) {
    expandDetails(details);
    return details;
  }

  return null;
}

function openFollowingDetails(element: HTMLElement): HTMLDetailsElement | null {
  let sibling = element.nextElementSibling;

  while (sibling) {
    if (sibling instanceof HTMLDetailsElement) {
      expandDetails(sibling);
      return sibling;
    }

    if (sibling.matches(headingSelector)) {
      return null;
    }

    sibling = sibling.nextElementSibling;
  }

  return null;
}

function getDetailsLinkId(details: HTMLDetailsElement): string | null {
  const previousElement = details.previousElementSibling;

  if (previousElement instanceof HTMLElement && previousElement.id) {
    return previousElement.id;
  }

  return null;
}

function getLinkForId(id: string): string {
  const url = new URL(window.location.href);
  url.hash = id;
  return url.toString();
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back to the legacy copy path below.
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

function addFaqAnswerLinks(): void {
  const faqDetails = document.querySelectorAll<HTMLDetailsElement>(
    ".faq-page details"
  );

  faqDetails.forEach((details) => {
    if (details.querySelector(`:scope > .${faqLinkButtonClass}`)) {
      return;
    }

    const id = getDetailsLinkId(details);

    if (!id) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = faqLinkButtonClass;
    button.textContent = "Copy link";
    button.setAttribute("aria-label", "Copy link to this answer");
    button.title = "Copy link to this answer";

    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const link = getLinkForId(id);
      await copyText(link);
      button.dataset.copied = "true";
      button.setAttribute("aria-label", "Copied link to this answer");

      window.setTimeout(() => {
        delete button.dataset.copied;
        button.setAttribute("aria-label", "Copy link to this answer");
      }, 1500);
    });

    details.appendChild(button);
  });
}

function openDetailsForCurrentHash(
  location: HashLocation = window.location,
  shouldScroll = false
): HTMLDetailsElement | null {
  const id = getHashId(location);

  if (!id) {
    return null;
  }

  const target = getTargetElement(id);

  if (!target) {
    return null;
  }

  const openedDetails =
    openAncestorDetails(target) ?? openFollowingDetails(target);

  if (openedDetails && shouldScroll) {
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: "start" });
    });
  }

  return openedDetails;
}

function ensureOpenDetailsForHash(location: HashLocation = window.location): void {
  const startedAt = Date.now();
  openDetailsForCurrentHash(location, true);

  const intervalId = window.setInterval(() => {
    const details = openDetailsForCurrentHash(location);

    if (
      (details?.open && details.dataset.collapsed !== "true") ||
      Date.now() - startedAt > openRetryDurationMs
    ) {
      window.clearInterval(intervalId);
    }
  }, openRetryIntervalMs);
}

function initFaqDeepLinks(location: HashLocation = window.location): void {
  addFaqAnswerLinks();
  ensureOpenDetailsForHash(location);
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initFaqDeepLinks(), {
      once: true,
    });
  } else {
    initFaqDeepLinks();
  }

  window.addEventListener("load", () => initFaqDeepLinks(), { once: true });
  window.addEventListener("hashchange", () => initFaqDeepLinks());
}

export function onRouteDidUpdate({ location }: RouteUpdateArgs): void {
  initFaqDeepLinks(location);
}
