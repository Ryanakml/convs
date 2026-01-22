/**
 * Prefetch utility for widget authentication
 * Runs in background when embed script loads to make widget instant
 */

const PREFETCH_KEY_PREFIX = "convs_prefetch";
const PREFETCH_TIMEOUT = 5000; // 5 second timeout for prefetch

interface PrefetchData {
  orgId: string;
  sessionId: string;
  timestamp: number;
}

export function getPrefetchKey(organizationId: string): string {
  return `${PREFETCH_KEY_PREFIX}_${organizationId}`;
}

export function markPrefetchComplete(
  organizationId: string,
  sessionId: string,
): void {
  try {
    const data: PrefetchData = {
      orgId: organizationId,
      sessionId: sessionId,
      timestamp: Date.now(),
    };
    localStorage.setItem(getPrefetchKey(organizationId), JSON.stringify(data));
  } catch (error) {
    console.error("Failed to mark prefetch complete:", error);
  }
}

export function isPrefetchValid(organizationId: string): boolean {
  try {
    const stored = localStorage.getItem(getPrefetchKey(organizationId));
    if (!stored) return false;

    const data: PrefetchData = JSON.parse(stored);
    const age = Date.now() - data.timestamp;
    const MAX_AGE = 30 * 60 * 1000; // 30 minutes

    // result in a strict boolean
    return age < MAX_AGE && !!data.sessionId && data.orgId === organizationId;
  } catch {
    return false;
  }
}

export async function prefetchWidgetAuth(
  organizationId: string,
  widgetUrl: string,
): Promise<boolean> {
  // Skip if already prefetched recently
  if (isPrefetchValid(organizationId)) {
    console.log("[Prefetch] Widget auth already cached");
    return true;
  }

  return new Promise((resolve) => {
    // Create hidden iframe to trigger prefetch
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `${widgetUrl}?organizationId=${encodeURIComponent(organizationId)}&prefetch=true`;
    iframe.allow = "microphone; clipboard-read; clipboard-write";

    let timeout: NodeJS.Timeout;
    let messageHandler: ((e: MessageEvent) => void) | null = null;

    const cleanup = () => {
      clearTimeout(timeout);
      if (messageHandler) {
        window.removeEventListener("message", messageHandler);
      }
      document.body.removeChild(iframe);
    };

    // Listen for prefetch completion
    messageHandler = (event: MessageEvent) => {
      if (event.data.type === "prefetch_complete") {
        console.log("[Prefetch] Authentication prefetch complete");
        cleanup();
        resolve(true);
      }
    };

    window.addEventListener("message", messageHandler);

    // Timeout after 5 seconds
    timeout = setTimeout(() => {
      console.warn(
        "[Prefetch] Widget prefetch timed out, but will continue normally",
      );
      cleanup();
      resolve(false);
    }, PREFETCH_TIMEOUT);

    document.body.appendChild(iframe);
  });
}
