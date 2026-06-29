type HashLocation = {
  hash: string;
};

type RouteUpdateArgs = {
  location: HashLocation;
};

const headingSelector = "h1, h2, h3, h4, h5, h6";
const faqLinkButtonClass = "faq-answer-link";

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

function openAncestorDetails(element: HTMLElement): HTMLDetailsElement | null {
  const details = element.closest("details");

  if (details instanceof HTMLDetailsElement) {
    details.open = true;
    return details;
  }

  return null;
}

function openFollowingDetails(element: HTMLElement): HTMLDetailsElement | null {
  let sibling = element.nextElementSibling;

  while (sibling) {
    if (sibling instanceof HTMLDetailsElement) {
      sibling.open = true;
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
    const summary = details.querySelector(":scope > summary");

    if (
      !(summary instanceof HTMLElement) ||
      summary.querySelector(`.${faqLinkButtonClass}`)
    ) {
      return;
    }

    const id = getDetailsLinkId(details);

    if (!id) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = faqLinkButtonClass;
    button.textContent = "#";
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

    summary.appendChild(button);
  });
}

function openDetailsForCurrentHash(location: HashLocation = window.location): void {
  const id = getHashId(location);

  if (!id) {
    return;
  }

  const target = getTargetElement(id);

  if (!target) {
    return;
  }

  const openedDetails =
    openAncestorDetails(target) ?? openFollowingDetails(target);

  if (openedDetails) {
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: "start" });
    });
  }
}

function scheduleOpenDetails(location: HashLocation = window.location): void {
  openDetailsForCurrentHash(location);
  window.setTimeout(() => openDetailsForCurrentHash(location), 100);
}

function initFaqDeepLinks(location: HashLocation = window.location): void {
  addFaqAnswerLinks();
  scheduleOpenDetails(location);
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
