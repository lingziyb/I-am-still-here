
import React from 'react';
import { AppState } from '../types';
import { Loader2, Fingerprint, Radio, AlertCircle } from 'lucide-react';

interface SignalButtonProps {
  appState: AppState;
  onSignal: () => void;
}

export const SignalButton: React.FC<SignalButtonProps> = ({ appState, onSignal }) => {

  const getButtonContent = () => {
    switch (appState) {
      case AppState.IDLE:
      case AppState.READY:
        return (
          <div className="flex flex-col items-center">
            <Fingerprint className="w-8 h-8 mb-2 opacity-80" />
            <span className="tracking-[0.2em] font-bold">I STILL HERE</span>
          </div>
        );
      case AppState.CONNECTING:
        return (
          <div className="flex flex-col items-center animate-pulse">
            <Radio className="w-6 h-6 mb-2" />
            <span className="text-sm tracking-widest">SIGNING...</span>
          </div>
        );
      case AppState.SIGNING_KEYS:
        return (
          <div className="flex flex-col items-center animate-pulse">
            <Lock className="w-6 h-6 mb-2" />
            <span className="text-sm tracking-widest">SIGNING...</span>
          </div>
        );
      case AppState.ENCRYPTING:
        return (
          <div className="flex flex-col items-center">
            <Loader2 className="w-6 h-6 mb-2 animate-spin" />
            <span className="text-sm tracking-widest">ENCRYPTING...</span>
          </div>
        );
      case AppState.SUBMITTING:
        return (
          <div className="flex flex-col items-center">
            <Loader2 className="w-6 h-6 mb-2 animate-spin" />
            <span className="text-sm tracking-widest">ENCRYPTING...</span>
          </div>
        );
      case AppState.CONFIRMED:
        return (
          <div className="flex flex-col items-center">
            <span className="text-base tracking-widest text-gray-500 uppercase">Still alive</span>
            <span className="text-xs text-gray-600 mt-1">Next check-in at UTC</span>
          </div>
        );
      case AppState.ERROR:
        return (
          <div className="flex flex-col items-center text-red-500">
            <AlertCircle className="w-6 h-6 mb-2" />
            <span className="text-sm tracking-widest">FAILED</span>
            <span className="text-[10px] mt-1">Click to Retry</span>
          </div>
        );
      default:
        return <span>RETRY</span>;
    }
  };

  const isDisabled = appState !== AppState.READY && appState !== AppState.IDLE && appState !== AppState.ERROR;
  const isConfirmed = appState === AppState.CONFIRMED;

  return (
    <div className="flex flex-col items-center space-y-6">
      <button
        onClick={onSignal}
        disabled={isDisabled || isConfirmed}
        className={`
          relative overflow-hidden
          w-48 h-48 rounded-full
          flex items-center justify-center
          transition-all duration-700 ease-out
          border-2
          ${isConfirmed
            ? 'bg-[#111] border-[#222] text-[#444] cursor-not-allowed grayscale'
            : isDisabled
              ? 'bg-[#1a0505] border-blood-dark text-blood-bright cursor-wait scale-95'
              : appState === AppState.ERROR
                ? 'bg-[#1a0000] border-red-800 text-red-500 hover:border-red-500'
                : 'bg-void border-blood-base text-bone hover:bg-blood-base hover:text-white hover:border-blood-bright hover:shadow-[0_0_50px_rgba(220,38,38,0.4)] scale-100'
          }
        `}
      >
        {/* Inner glow for active state */}
        {!isConfirmed && !isDisabled && appState !== AppState.ERROR && (
          <div className="absolute inset-0 bg-radial-gradient from-blood-dark/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
        )}

        <div className="relative z-10">
          {getButtonContent()}
        </div>
      </button>

      {appState !== AppState.CONFIRMED && (
        <p className="text-xs text-gray-700 tracking-widest">
          [ CLICK · PROVE YOU LIVE ]
        </p>
      )}
    </div>
  );
};
