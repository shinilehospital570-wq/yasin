import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string; mini?: boolean }> = ({ 
  className = '', 
  mini = false 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone PWA mode, don't show prompt
  if (isInstalled) {
    return null;
  }

  // Android / Chromium / Desktop flow
  if (isInstallable) {
    if (mini) {
      return (
        <button
          onClick={install}
          title="Ku shubo Taleefankaaga (Install App)"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition active:scale-95 ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>App-ka Dejiso</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-2 rounded-xl bg-orange-600 px-3.5 py-2 text-xs md:text-sm font-semibold text-white shadow-md hover:bg-orange-700 transition active:scale-95 ${className}`}
      >
        <Smartphone className="w-4 h-4" />
        <span>Ku Shubo App-ka</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-orange-400" />
          <span>App-ka iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-900 relative">
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900">Ku shubo Fuad E-Commerce (iPhone/iPad)</h3>
              <p className="mt-2 text-sm text-slate-600">
                Si aad app-ka ugu darto shaashadda taleefankaaga:
              </p>

              <ol className="mt-3 space-y-2 text-xs md:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Guji calaamadda <strong>Share</strong> (Wadaag) ee hoose ama sare ee Safari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Hoos u deg oo taabo <strong>Add to Home Screen</strong> (Ku dar Shaashadda).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Taabo <strong>Add</strong> ee geeska sare.</span>
                </li>
              </ol>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Waan Fahmay
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback banner prompt when browser hasn't fired beforeinstallprompt yet
  return (
    <button
      onClick={() => {
        alert('App-ka Fuad E-Commerce waxaa toos looga shuban karaa browser-ka Android ama Chrome adigoo riixaya calaamadda Saddexda Dhibcood (Menu) -> "Install app" ama "Add to Home screen".');
      }}
      className={`inline-flex items-center gap-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white px-2.5 py-1.5 text-xs font-medium border border-slate-700 transition ${className}`}
      title="Ku shubo Taleefankaaga"
    >
      <Smartphone className="w-3.5 h-3.5 text-orange-400" />
      <span>Ku Shubo App-ka</span>
    </button>
  );
};
