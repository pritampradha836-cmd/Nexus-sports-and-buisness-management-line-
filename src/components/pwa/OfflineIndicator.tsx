import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, Radio } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-xl border border-amber-500/50 backdrop-blur-md animate-bounce">
      <WifiOff className="w-4 h-4 text-amber-100" />
      <span>Offline Mode — Amnetek local cached data & telemetry are active.</span>
      <Radio className="w-3.5 h-3.5 text-amber-200 animate-pulse ml-1" />
    </div>
  );
};
