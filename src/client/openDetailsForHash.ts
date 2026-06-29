type HashLocation = {
  hash: string;
};

type RouteUpdateArgs = {
  location: HashLocation;
};

const headingSelector = "h1, h2, h3, h4, h5, h6";

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

if (typeof window !== "undefined") {
  window.addEventListener("hashchange", () => scheduleOpenDetails());
}

export function onRouteDidUpdate({ location }: RouteUpdateArgs): void {
  scheduleOpenDetails(location);
}
