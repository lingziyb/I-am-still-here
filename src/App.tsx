import React, { useState, useEffect } from 'react';
import { CounterDisplay } from './components/CounterDisplay';
import { SignalButton } from './components/SignalButton';
import { InfoModal } from './components/InfoModal';
import { AppState } from './types';

import {
  sendSignal,
  getLastSignalTime,
  checkIsOnCooldown,
  initFhevmNoSign,
  getTotalLiveNoSign,
  getLocalSignalTime,
  connectWallet,
  setLocalSignalTime,
} from './services/fheService';

import { HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [count, setCount] = useState<number>(60870);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relayer, setRelayer] = useState<any>(null);
  const [lastSignalTime, setLastSignalTime] = useState<number>(0);

  // ----------------------------------------
  // Initial Load
  // ----------------------------------------
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const { relayer } = await initFhevmNoSign();
      setRelayer(relayer);

      const last = getLocalSignalTime();  // get signTime
      const isOnCooldown = checkIsOnCooldown();

      setLastSignalTime(last);
      setAppState(last && isOnCooldown ? AppState.CONFIRMED : AppState.IDLE);

      // Fetch encrypted global count and decrypt
      const total = await getTotalLiveNoSign(relayer); // get count 
      setCount(total);
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------
  // Signal Action
  // ----------------------------------------
  const handleSignal = async () => {
    if (!relayer) return;

    try {
      setAppState(AppState.CONNECTING);
      const signer = await connectWallet(); // wallet sign   

      setAppState(AppState.SUBMITTING);
      const txHash = await sendSignal(relayer, 1, signer, lastSignalTime); // send signal

      console.log("Signal successful:", txHash);
      setAppState(AppState.CONFIRMED);
      setCount((prev) => prev + 1);

      try {
        const last = await getLastSignalTime(relayer, signer); // get signalTime

        setLastSignalTime(last);
        setLocalSignalTime(last);
      } catch (e: any) {
        console.error("getSignalTime fail:  " + e.message);
      }
    } catch (e: any) {
      console.error("sendSignal fail:  " + e.message);
      setAppState(AppState.ERROR);
    }

  };

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className="min-h-screen w-full flex flex-col relative bg-void font-sans overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-blood-dark/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Info Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-gray-700 hover:text-gray-400 transition-colors"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">

        {/* Counter */}
        <div className="mb-16 md:mb-24">
          <CounterDisplay
            count={count}
            loading={
              appState !== AppState.IDLE &&
              appState !== AppState.CONFIRMED &&
              appState !== AppState.ERROR
            }
          />
        </div>

        {/* Button */}
        <SignalButton appState={appState} onSignal={handleSignal} />

      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center">
        <p className="text-[10px] text-gray-700 tracking-[0.3em] font-mono uppercase">
          Encrypted on Zama Network
        </p>
      </footer>

      {/* Modal */}
      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default App;
