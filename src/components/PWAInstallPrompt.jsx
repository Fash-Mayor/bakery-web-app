import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";
import { FaDownload, FaTimes } from "react-icons/fa";

/**
 * PWAInstallPrompt
 * - Listens for the `beforeinstallprompt` event to offer an "Install App" button.
 * - Uses `virtual:pwa-register` to detect a new version and prompt the user to refresh.
 */
const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState(null);

  // Detect if the app is already installed (display-mode: standalone)
  useEffect(() => {
    const installed =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsInstalled(installed);
  }, []);

  // Capture the install prompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default browser mini-infobar
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Register service worker and handle updates
  useEffect(() => {
    const { needRefresh: needRefreshCallback, updateSW: updateSWCallback } =
      registerSW({
        onNeedRefresh() {
          setNeedRefresh(true);
          setUpdateSW(() => updateSWCallback);
        },
        onOfflineReady() {
          console.log("App is ready to work offline");
        },
      });
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Update Available Banner */}
      {needRefresh && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-4 max-w-sm w-[90%]">
          <div className="flex-1">
            <p className="font-semibold text-sm">A new version is available!</p>
            <p className="text-xs text-gray-300">
              Refresh to get the latest updates.
            </p>
          </div>
          <button
            onClick={() => updateSW(true)}
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

      {/* Install App Button */}
      {installPrompt && !needRefresh && (
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
            onClick={() => setInstallPrompt(null)}
            className="text-gray-400 hover:text-gray-700 transition"
            aria-label="Dismiss"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;
