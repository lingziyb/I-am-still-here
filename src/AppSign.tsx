import React, { useState, useEffect } from 'react';
import { CounterDisplay } from './components/CounterDisplay';
import { SignalButton } from './components/SignalButton';
import { InfoModal } from './components/InfoModal';
import { AppState } from './types';

import {
  initFhevm,
  sendSignal,
  getTotalLive,
  getLastSignalTime,
  checkIsOnCooldown,
} from './services/fheService';

import { HelpCircle, RefreshCw } from 'lucide-react';

const CONTRACT_ADDRESS = "0x180d054D7D44FA58e421dA538556E006B7dFb793";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [count, setCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [relayer, setRelayer] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [lastSignalTime, setLastSignalTime] = useState<number>(0);

  // ----------------------------------------
  // Initial Load
  // ----------------------------------------
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const { relayer, signer } = await initFhevm();
      setRelayer(relayer);
      setSigner(signer);

      const addr = await signer.getAddress();
      setWalletAddress(addr);

      // Fetch encrypted global count and decrypt
      // const total = await getTotalLive(relayer, signer, CONTRACT_ADDRESS);
      const total = 10000;

      // 尝试获取上次信号时间
      // const last = await getLastSignalTime(relayer, signer, CONTRACT_ADDRESS);
      const last = 1763483314348; // 1764483314348. 1763483314348 

      if (last === 0) {
        console.log("用户还没有发送过 signal");
      } else {
        console.log("上一次信号时间:", last);
      }

      const isOnCooldown = checkIsOnCooldown(last);

      setCount(total);
      setLastSignalTime(last);
      setAppState(isOnCooldown ? AppState.CONFIRMED : AppState.IDLE);

    } catch (e) {
      console.error(e);
      setAppState(AppState.ERROR);
    }
  };

  // ----------------------------------------
  // Signal Action
  // ----------------------------------------
  const handleSignal = async () => {
    if (!relayer || !signer) return;

    try {
      setAppState(AppState.SUBMITTING);

      // 发送 signal
      // const txHash = await sendSignal(relayer, signer, CONTRACT_ADDRESS, 1, lastSignalTime);
      // console.log("Signal sent:", txHash);

      setAppState(AppState.CONFIRMED);
      setCount((prev) => prev + 1);
    } catch (e: any) {
      console.error(e);
      alert("Signal 失败: " + e.message);
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
          className="text-gray-500 hover:text-gray-200 transition-colors"
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
        <p className="text-[10px] text-gray-600 tracking-[0.3em] font-mono uppercase">
          Encrypted on Zama Network
        </p>
      </footer>

      {/* Modal */}
      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default App;
