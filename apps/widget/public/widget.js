(function () {
  "use strict";

  // 1. KONFIGURASI & ASSETS
  const CONFIG = {
    WIDGET_URL: "http://localhost:3001",
    DEFAULT_POSITION: "bottom-right",
    PREFETCH_TIMEOUT: 5000,
  };

  const ICONS = {
    CHAT: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    CLOSE: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  };

  // 2. STATE & VARIABLE
  let organizationId = null;
  let position = CONFIG.DEFAULT_POSITION;
  let isOpen = false;
  let host, shadow, button, container, iframe, badge;

  // 3. UTILS (Prefetch & Auth)
  async function prefetchAuth(orgId) {
    return new Promise((resolve) => {
      const pfIframe = document.createElement("iframe");
      pfIframe.style.display = "none";
      pfIframe.src = `${CONFIG.WIDGET_URL}?organizationId=${orgId}&prefetch=true`;

      const timeout = setTimeout(() => {
        cleanup();
        resolve(false);
      }, CONFIG.PREFETCH_TIMEOUT);

      const handlePrefetch = (e) => {
        if (e.data.type === "prefetch_complete") {
          cleanup();
          resolve(true);
        }
      };

      const cleanup = () => {
        clearTimeout(timeout);
        window.removeEventListener("message", handlePrefetch);
        if (pfIframe.parentNode) document.body.removeChild(pfIframe);
      };

      window.addEventListener("message", handlePrefetch);
      document.body.appendChild(pfIframe);
    });
  }

  // 4. CORE FUNCTIONS
  function init() {
    const script =
      document.currentScript ||
      document.querySelector('script[src*="widget.js"]');
    if (script) {
      organizationId = script.getAttribute("data-organization-id");
      position =
        script.getAttribute("data-position") || CONFIG.DEFAULT_POSITION;
    }

    if (!organizationId)
      return console.error("Convs: Missing data-organization-id");

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", render);
    } else {
      render();
    }
  }

  function render() {
    prefetchAuth(organizationId).catch(() => {});

    // Create Host
    host = document.createElement("div");
    host.id = "convs-widget-root";
    Object.assign(host.style, {
      position: "fixed",
      bottom: "0",
      [position === "bottom-right" ? "right" : "left"]: "0",
      width: "0",
      height: "0",
      zIndex: "2147483647",
    });
    document.body.appendChild(host);

    shadow = host.attachShadow({ mode: "open" });

    // Inject CSS
    const style = document.createElement("style");
    style.textContent = `
      :host { all: initial; font-family: sans-serif; }
      .convs-btn {
        position: fixed !important;
        bottom: 20px !important;
        ${position === "bottom-right" ? "right: 20px !important;" : "left: 20px !important;"}
        width: 60px !important; height: 60px !important;
        border-radius: 50% !important;
        background: #3b82f6 !important;
        box-shadow: 0 4px 24px rgba(59, 130, 246, 0.35) !important;
        cursor: pointer !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
        border: none !important; color: white !important;
        transition: transform 0.2s ease !important;
        z-index: 9999 !important;
      }
      .convs-btn:hover { transform: scale(1.05) !important; }
      
      .convs-badge {
        position: absolute !important; top: -2px !important; right: -2px !important;
        width: 14px !important; height: 14px !important;
        background: #ef4444 !important; border: 2px solid white !important;
        border-radius: 50% !important; display: none;
      }

      .convs-container {
        position: fixed !important;
        bottom: 90px !important;
        ${position === "bottom-right" ? "right: 20px !important;" : "left: 20px !important;"}
        width: 400px !important; height: 600px !important;
        max-width: calc(100vw - 40px) !important;
        max-height: calc(100vh - 110px) !important;
        background: white !important; border-radius: 16px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
        overflow: hidden !important;
        display: none; opacity: 0;
        transform: translateY(20px) !important;
        transition: opacity 0.3s, transform 0.3s !important;
        z-index: 9998 !important;
      }
      .convs-container.open { display: block; opacity: 1; transform: translateY(0) !important; }

      .convs-popup {
        position: fixed !important;
        bottom: 90px !important;
        ${position === "bottom-right" ? "right: 20px !important;" : "left: 20px !important;"}
        background: white !important; padding: 12px 16px !important;
        border-radius: 12px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        font-size: 14px !important; color: #333 !important;
        border-left: 4px solid #3b82f6 !important;
        animation: slideUp 0.3s ease !important;
        z-index: 9997 !important;
      }
      @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    `;
    shadow.appendChild(style);

    // Button & Badge
    button = document.createElement("button");
    button.className = "convs-btn";
    button.innerHTML = ICONS.CHAT;
    button.onclick = toggle;

    badge = document.createElement("div");
    badge.className = "convs-badge";
    button.appendChild(badge);
    shadow.appendChild(button);

    // Container & Iframe
    container = document.createElement("div");
    container.className = "convs-container";
    iframe = document.createElement("iframe");
    iframe.style.cssText = "width:100%;height:100%;border:none;";
    iframe.src = `${CONFIG.WIDGET_URL}?organizationId=${organizationId}`;
    iframe.allow = "microphone; clipboard-read; clipboard-write";

    container.appendChild(iframe);
    shadow.appendChild(container);

    // Initial Delay Actions
    setTimeout(showGreeting, 3000);
    window.addEventListener("message", handleMessage);
  }

  function toggle() {
    isOpen ? hide() : show();
  }

  function show() {
    isOpen = true;
    container.classList.add("open");
    button.innerHTML = ICONS.CLOSE;
    hideGreeting();
    badge.style.display = "none";
  }

  function hide() {
    isOpen = false;
    container.classList.remove("open");
    button.innerHTML = ICONS.CHAT;
    button.appendChild(badge); // Re-attach badge icon
  }

  function showGreeting() {
    if (isOpen || shadow.getElementById("convs-greet")) return;
    const texts = [
      "Halo! Ada yang bisa saya bantu?",
      "Butuh bantuan? 💬",
      "Saya siap membantu! 🎉",
    ];
    const greet = document.createElement("div");
    greet.id = "convs-greet";
    greet.className = "convs-popup";
    greet.textContent = texts[Math.floor(Math.random() * texts.length)];
    shadow.appendChild(greet);
    setTimeout(hideGreeting, 6000);
  }

  function hideGreeting() {
    shadow.getElementById("convs-greet")?.remove();
  }

  function handleMessage(e) {
    if (e.origin !== new URL(CONFIG.WIDGET_URL).origin) return;
    const { type, payload } = e.data;
    if (type === "close") hide();
    if (type === "show_notification" && !isOpen) badge.style.display = "block";
    if (type === "resize" && payload.height)
      container.style.height = `${payload.height}px`;
  }

  init();
})();
