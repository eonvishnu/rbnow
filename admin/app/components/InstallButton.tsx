"use client";

import React, { useEffect, useState } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // 1. Check if the device is mobile (Android/iPhone/iPad)
    const isMobile = /android|iphone|ipad|ipod/i.test(window.navigator.userAgent.toLowerCase());

    // If it's NOT mobile, stop here. (Hides button on Desktop)
    if (!isMobile) return;

    const handler = (e: any) => {
      e.preventDefault(); 
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <button 
      onClick={handleInstallClick}
      className="fixed bottom-20 right-4 z-50 bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg animate-bounce"
    >
      ⬇ Install App
    </button>
  );
}