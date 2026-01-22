import { EMBED_CONFIG } from "./config";
import { CHAT_ICON, CLOSE_ICON } from "./icons";
import { prefetchWidgetAuth } from "./prefetch";

(function () {
  let iframe: HTMLIFrameElement | null = null;
  let container: HTMLDivElement | null = null;
  let button: HTMLButtonElement | null = null;
  let shadowRoot: ShadowRoot | null = null;
  let badge: HTMLDivElement | null = null; // [BARU]
  let isOpen = false;

  let organizationId: string | null = null;
  let position: "bottom-right" | "bottom-left" = EMBED_CONFIG.DEFAULT_POSITION;

  const currentScript = document.currentScript as HTMLScriptElement;
  if (currentScript) {
    organizationId = currentScript.getAttribute("data-organization-id");
    position =
      (currentScript.getAttribute("data-position") as any) ||
      EMBED_CONFIG.DEFAULT_POSITION;
  }

  if (!organizationId) {
    console.error("Convs Widget: data-organization-id is required");
    return;
  }

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", render);
    } else {
      render();
    }
  }

  function render() {
    if (organizationId) {
      prefetchWidgetAuth(organizationId, EMBED_CONFIG.WIDGET_URL).catch(
        () => {},
      );
    }

    const host = document.createElement("div");
    host.id = "convs-widget-host";
    // Styling Host harus se-agresif mungkin agar tidak terpengaruh CSS website lain
    host.style.setProperty("position", "fixed", "important");
    host.style.setProperty("bottom", "0", "important");
    host.style.setProperty(
      position === "bottom-right" ? "right" : "left",
      "0",
      "important",
    );
    host.style.setProperty("width", "0", "important");
    host.style.setProperty("height", "0", "important");
    host.style.setProperty("z-index", "2147483647", "important");
    host.style.setProperty("pointer-events", "none", "important");
    document.body.appendChild(host);

    shadowRoot = host.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      :host { all: initial; }
      .convs-btn {
        position: absolute !important;
        bottom: 20px !important;
        ${position === "bottom-right" ? "right: 20px !important;" : "left: 20px !important;"}
        width: 60px !important;
        height: 60px !important;
        border-radius: 50% !important;
        background: #3b82f6 !important;
        box-shadow: 0 4px 24px rgba(59, 130, 246, 0.35) !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: none !important;
        padding: 0 !important;
        pointer-events: auto !important;
        transition: transform 0.2s ease !important;
        z-index: 999999 !important;
        color: white !important;
      }
      .convs-btn:hover { transform: scale(1.05) !important; }

      /* [BARU] Badge Notification */
      .convs-badge {
        position: absolute !important;
        top: -2px !important;
        right: -2px !important;
        width: 14px !important;
        height: 14px !important;
        background: #ef4444 !important;
        border: 2px solid white !important;
        border-radius: 50% !important;
        display: none; /* Default sembunyi */
      }
      
      .convs-container {
        position: absolute !important;
        bottom: 90px !important;
        ${position === "bottom-right" ? "right: 20px !important;" : "left: 20px !important;"}
        width: 400px !important;
        height: 600px !important;
        max-width: calc(100vw - 40px) !important;
        max-height: calc(100vh - 110px) !important;
        background: white !important;
        border-radius: 16px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
        overflow: hidden !important;
        display: none !important;
        opacity: 0 !important;
        transform: translateY(20px) !important;
        transition: all 0.3s ease !important;
        pointer-events: auto !important;
        z-index: 999998 !important;
      }
      
      .convs-container.open {
        display: block !important;
        opacity: 1 !important;
        transform: translateY(0) !important;
      }

      .convs-iframe {
        width: 100% !important;
        height: 100% !important;
        border: none !important;
      }

      .convs-popup {
        position: absolute !important;
        bottom: 90px !important;
        ${position === "bottom-right" ? "right: 20px !important;" : "left: 20px !important;"}
        background: white !important;
        padding: 12px 16px !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        font-family: sans-serif !important;
        font-size: 14px !important;
        color: #333 !important;
        border-left: 4px solid #3b82f6 !important;
        pointer-events: auto !important;
        animation: slideUp 0.3s ease !important;
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    shadowRoot.appendChild(style);

    button = document.createElement("button");
    button.className = "convs-btn";
    button.innerHTML = CHAT_ICON;
    button.onclick = toggleWidget;

    // [BARU] Buat Badge
    badge = document.createElement("div");
    badge.className = "convs-badge";
    button.appendChild(badge);

    shadowRoot.appendChild(button);

    container = document.createElement("div");
    container.className = "convs-container";

    iframe = document.createElement("iframe");
    iframe.className = "convs-iframe";
    iframe.src = buildWidgetUrl();
    iframe.allow = "microphone; clipboard-read; clipboard-write";

    container.appendChild(iframe);
    shadowRoot.appendChild(container);

    window.addEventListener("message", handleMessage);

    // Auto show greeting after 3s
    setTimeout(showGreetingPopup, 3000);
  }

  function toggleWidget() {
    isOpen ? hide() : show();
  }

  function show() {
    if (container && button && badge) {
      isOpen = true;
      container.classList.add("open");
      button.innerHTML = CLOSE_ICON;
      badge.style.display = "none"; // Sembunyiin badge pas dibuka
      hideGreetingPopup();
    }
  }

  function hide() {
    if (container && button && badge) {
      isOpen = false;
      container.classList.remove("open");
      button.innerHTML = CHAT_ICON;
      button.appendChild(badge); // Re-attach badge
    }
  }

  function showGreetingPopup() {
    if (isOpen || !shadowRoot) return;
    const greetings = [
      "Halo! Ada yang bisa saya bantu?",
      "Saya siap membantu! 🎉",
    ];
    const text = greetings[Math.floor(Math.random() * greetings.length)];

    const popup = document.createElement("div");
    popup.id = "convs-greeting-popup";
    popup.className = "convs-popup";
    popup.textContent = text;

    shadowRoot.appendChild(popup);
    setTimeout(hideGreetingPopup, 5000);
  }

  function hideGreetingPopup() {
    shadowRoot?.getElementById("convs-greeting-popup")?.remove();
  }

  function buildWidgetUrl(): string {
    const params = new URLSearchParams({ organizationId: organizationId! });
    return `${EMBED_CONFIG.WIDGET_URL}?${params.toString()}`;
  }

  function handleMessage(event: MessageEvent) {
    if (event.origin !== new URL(EMBED_CONFIG.WIDGET_URL).origin) return;

    const { type, payload } = event.data;

    if (type === "close") hide();

    // [BARU] Handle Notifikasi
    if (type === "show_notification" && !isOpen && badge) {
      badge.style.display = "block";
    }

    // [BARU] Handle Resize otomatis dari iframe
    if (type === "resize" && payload?.height && container) {
      container.style.height = `${payload.height}px`;
    }
  }

  init();
})();
