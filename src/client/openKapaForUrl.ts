type KapaOpenOptions = {
  mode: "ai";
  query: string;
  submit: false;
};

type KapaCommand = (command: "open", options: KapaOpenOptions) => void;

declare global {
  interface Window {
    Kapa?: KapaCommand | { open: (options: KapaOpenOptions) => void };
  }
}

type KapaLocation = {
  pathname: string;
  search: string;
};

let lastOpenedLocation: string | undefined;

function openKapa(query = ""): void {
  if (!window.Kapa) {
    // Kapa's preinitialization queue handles links opened before its async script loads.
    // https://docs.kapa.ai/integrations/website-widget/javascript-api/preinitialize
    const queuedKapa = function () {
      queuedKapa.c(arguments);
    };
    queuedKapa.q = [] as IArguments[];
    queuedKapa.c = (args: IArguments) => {
      queuedKapa.q.push(args);
    };
    window.Kapa = queuedKapa;
  }

  const options: KapaOpenOptions = { mode: "ai", query, submit: false };
  if ("open" in window.Kapa && typeof window.Kapa.open === "function") {
    window.Kapa.open(options);
  } else if (typeof window.Kapa === "function") {
    window.Kapa("open", options);
  }
}

function openKapaForLocation(location: KapaLocation): void {
  const params = new URLSearchParams(location.search);
  if (params.get("ask") !== "1") {
    lastOpenedLocation = undefined;
    return;
  }

  const key = `${location.pathname}${location.search}`;
  if (lastOpenedLocation === key) {
    return;
  }

  lastOpenedLocation = key;
  openKapa(params.get("question") ?? "");
}

export function onRouteDidUpdate({
  location,
}: {
  location: KapaLocation;
}): void {
  // Wait until Docusaurus finishes rendering before opening the modal.
  openKapaForLocation(location);
}
