import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Monitor, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card' | 'inline';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  // If already running as an installed standalone PWA, display standalone indicator
  if (isInstalled) {
    if (variant === 'header') {
      return (
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/80">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>App Installed</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Show device-specific install guide modal
      setShowGuideModal(true);
    }
  };

  // Render for header
  if (variant === 'header') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          title="Install Amnetek OS on your device (Phone, Tablet, or PC)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-600/70 hover:border-emerald-500 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Install App</span>
        </button>

        {showGuideModal && (
          <InstallGuideModal
            isIOS={isIOS}
            isAndroid={isAndroid}
            onClose={() => setShowGuideModal(false)}
          />
        )}
      </>
    );
  }

  // Render for prominent card / banner
  return (
    <>
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/40 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-emerald-950/30">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Install Amnetek OS on Your Device</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 font-medium">
                PWA Standalone
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Install to your home screen or desktop dock for instant offline access, zero browser URL bar, real-time satellite telemetry, and full sports AI processing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-950/40 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Install on This Device</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showGuideModal && (
        <InstallGuideModal
          isIOS={isIOS}
          isAndroid={isAndroid}
          onClose={() => setShowGuideModal(false)}
        />
      )}
    </>
  );
};

interface InstallGuideModalProps {
  isIOS: boolean;
  isAndroid: boolean;
  onClose: () => void;
}

const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isIOS, isAndroid, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Install Amnetek OS</h3>
              <p className="text-[11px] text-slate-400">Device Installation Instructions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIOS ? (
          /* iOS Safari Guide */
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-semibold text-emerald-400 block font-mono text-[11px]">
                Apple iOS Safari (iPhone / iPad):
              </span>
              <ol className="space-y-2.5 list-decimal list-inside text-slate-300">
                <li className="leading-relaxed">
                  Tap the <strong className="text-white inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-slate-800"><Share className="w-3 h-3 text-cyan-400 inline" /> Share</strong> button in Safari's bottom toolbar.
                </li>
                <li className="leading-relaxed">
                  Scroll down the share sheet and select <strong className="text-white inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-slate-800"><PlusSquare className="w-3 h-3 text-emerald-400 inline" /> Add to Home Screen</strong>.
                </li>
                <li className="leading-relaxed">
                  Tap <strong className="text-emerald-400">Add</strong> in the top right corner.
                </li>
              </ol>
            </div>
            <p className="text-[11px] text-slate-400">
              Amnetek OS will appear on your iOS home screen as a native application with custom icon and full offline support.
            </p>
          </div>
        ) : isAndroid ? (
          /* Android Chrome / Samsung Internet Guide */
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-semibold text-emerald-400 block font-mono text-[11px]">
                Android (Chrome / Browser):
              </span>
              <ol className="space-y-2.5 list-decimal list-inside text-slate-300">
                <li className="leading-relaxed">
                  Tap the browser <strong className="text-white">three dots menu (⋮)</strong> in the top right corner.
                </li>
                <li className="leading-relaxed">
                  Select <strong className="text-emerald-400">Install app</strong> or <strong className="text-emerald-400">Add to Home screen</strong>.
                </li>
                <li className="leading-relaxed">
                  Confirm by tapping <strong className="text-white">Install</strong>.
                </li>
              </ol>
            </div>
          </div>
        ) : (
          /* Desktop Chrome / Edge Guide */
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-semibold text-emerald-400 block font-mono text-[11px]">
                Desktop (Chrome, Edge, Brave, Opera):
              </span>
              <ol className="space-y-2.5 list-decimal list-inside text-slate-300">
                <li className="leading-relaxed">
                  Look for the <strong className="text-emerald-400 inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-slate-800"><Monitor className="w-3 h-3 text-emerald-400 inline" /> Install Icon</strong> in your browser's address bar (right side).
                </li>
                <li className="leading-relaxed">
                  Or click your browser's <strong className="text-white">Settings menu (⋮)</strong> &gt; <strong className="text-emerald-400">Install Amnetek OS...</strong>
                </li>
                <li className="leading-relaxed">
                  Click <strong className="text-white">Install</strong> to create a desktop and dock shortcut.
                </li>
              </ol>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
