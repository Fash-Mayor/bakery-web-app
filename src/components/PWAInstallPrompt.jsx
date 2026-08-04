import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";
import { FaDownload, FaTimes } from "react-icons/fa";

/**
 * ------------------------------------------------------------------
 * Module-scope PWA setup
 * ------------------------------------------------------------------
 * The `beforeinstallprompt` event fires VERY early during page load —
 * often before React mounts and runs its effects. If we attach the
 * listener inside a `useEffect`, the event is already gone by the time
 * the listener exists. That is exactly why the Install button appeared
 * in local dev (fast reload) but disappears on the slower deployed site.
 *
 * Fix: attach the listeners (and register the service worker) at module
 * scope so they are ready before the first paint. React state is then
 * updated via custom events.
 * ------------------------------------------------------------------
 */

let deferredPrompt = null; // captured beforeinstallprompt event
let updateServiceWorker = null; // fn that force-updates the SW and reloads
let refreshPending = false; // new SW found before React mounted

// Register the service worker as early as possible.
// `registerType: 'prompt'` -> we show the update banner ourselves.
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    const sw = registerSW({
      immediate: true,
      onNeedRefresh() {
        refreshPending = true;
        window.dispatchEvent(new CustomEvent("pwa-need-refresh"));
      },
      onOfflineReady() {
        console.log("The Bakery is ready to work offline");
      },
      onRegisterError(error) {
        console.warn("Service worker registration failed:", error);
      },
    });
    updateServiceWorker = () => sw.updateSW(true);
  } catch (error) {
    console.warn("PWA setup failed:", error);
  }
}

// Capture the Chrome/Android install prompt at module scope (never missed).
const handleBeforeInstallPrompt = (e) => {
  e.preventDefault(); // suppress the default browser mini-infobar
  deferredPrompt = e;
  window.dispatchEvent(new CustomEvent("pwa-install-prompt"));
};

const handleAppInstalled = () => {
  deferredPrompt = null;
  window.dispatchEvent(new CustomEvent("pwa-installed"));
};

window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
window.addEventListener("appinstalled", handleAppInstalled);

/** Detect iOS Safari (incl. iPadOS 13+ which reports itself as macOS). */
const isIOS = () => {
  const ua = navigator.userAgent;
  const iPhone = /iPhone|iPod/.test(ua);
  const iPad =
    /iPad/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return iPhone || iPad;
};

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(deferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(refreshPending);
  const [isIOSUser, setIsIOSUser] = useState(false);
  const [iosHintDismissed, setIosHintDismissed] = useState(() => {
    try {
      return localStorage.getItem("bakery-ios-hint-dismissed") === "1";
    } catch {
      return false;
    }
  });

  // Detect installed mode + iOS on mount.
  useEffect(() => {
    const installed =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsInstalled(installed);
    setIsIOSUser(isIOS() && !installed);
  }, []);

  // React to module-scope events after mount.
  useEffect(() => {
    const onPromptReady = () => setInstallPrompt(deferredPrompt);
    const onInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    const onNeedRefresh = () => setNeedRefresh(true);

    window.addEventListener("pwa-install-prompt", onPromptReady);
    window.addEventListener("pwa-installed", onInstalled);
    window.addEventListener("pwa-need-refresh", onNeedRefresh);

    return () => {
      window.removeEventListener("pwa-install-prompt", onPromptReady);
      window.removeEventListener("pwa-installed", onInstalled);
      window.removeEventListener("pwa-need-refresh", onNeedRefresh);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    try {
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
    } catch {
      // user dismissed / prompt cancelled — ignore
    }
    deferredPrompt = null;
    setInstallPrompt(null);
  };

  const handleRefresh = () => {
    setNeedRefresh(false);
    if (updateServiceWorker) {
      updateServiceWorker();
    } else {
      window.location.reload();
    }
  };

  const dismissIOSHint = () => {
    setIosHintDismissed(true);
    try {
      localStorage.setItem("bakery-ios-hint-dismissed", "1");
    } catch {
      // ignore
    }
  };

  if (isInstalled) return null;

  const showInstall = installPrompt && !needRefresh;

  return (
    <>
      {/* ---- Update available banner ---- */}
      {needRefresh && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-4 max-w-sm w-[90%]">
          <div className="flex-1">
            <p className="font-semibold text-sm">A new version is available!</p>
            <p className="text-xs text-gray-300">
              Refresh to get the latest updates.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Refresh
          </button>
          <button
            onClick={() => setNeedRefresh(false)}
            className="text-gray-400 hover:text-white transition"
            aria-label="Dismiss"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* ---- Install App button (Chrome / Android) ---- */}
      {showInstall && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-gray-900 px-4 py-3 rounded-lg shadow-2xl border border-gray-200 flex items-center gap-4 max-w-sm w-[90%]">
          <div className="flex-1">
            <p className="font-semibold text-sm">Install The Bakery</p>
            <p className="text-xs text-gray-500">
              Add to your home screen for quick access.
            </p>
          </div>
          <button
            onClick={handleInstallClick}
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <FaDownload />
            Install
          </button>
          <button
            onClick={() => {
              deferredPrompt = null;
              setInstallPrompt(null);
            }}
            className="text-gray-400 hover:text-gray-700 transition"
            aria-label="Dismiss"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* ---- iOS Safari: manual "Add to Home Screen" fallback ----
          iOS Safari does NOT fire `beforeinstallprompt`, so we show
          the user how to install manually. */}
      {isIOSUser && !showInstall && !needRefresh && !iosHintDismissed && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-gray-900 px-4 py-3 rounded-lg shadow-2xl border border-gray-200 max-w-sm w-[90%]">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-semibold text-sm">Install The Bakery</p>
              <p className="text-xs text-gray-500 mt-1">
                Tap the{" "}
                <span className="inline-block bg-gray-100 rounded px-1 py-0.5 font-semibold">
                  Share
                </span>{" "}
                icon in Safari, then choose{" "}
                <span className="font-semibold">Add to Home Screen</span>.
              </p>
            </div>
            <button
              onClick={dismissIOSHint}
              className="text-gray-400 hover:text-gray-700 transition"
              aria-label="Dismiss"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;
