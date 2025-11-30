
import React from 'react';
import { X, ShieldCheck, Ghost, Network } from 'lucide-react';
import { FHE_EXPLANATION } from '../constants';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0a0a0a] border border-[#222] w-full max-w-md p-6 md:p-10 relative shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 flex-1">
          <div className="flex items-center space-x-3 text-blood-base">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-lg font-bold tracking-widest text-bone">ZAMA FHE PROTOCOL</span>
          </div>
          
          <div className="h-px bg-[#222] w-full"></div>

          <p className="text-gray-400 text-sm leading-7 whitespace-pre-line font-mono">
            {FHE_EXPLANATION}
          </p>
          
          <p className="text-xs text-gray-600 font-mono mt-2 border-l-2 border-blood-dark pl-3">
            SDK Version: 0.3.0-5<br/>
            Network: Sepolia (11155111)<br/>
            Encryption: TFHE
          </p>

          <div className="grid grid-cols-3 gap-2 pt-4">
            <div className="flex flex-col items-center justify-center p-4 bg-[#111] border border-[#222] text-center">
              <Ghost className="w-5 h-5 text-gray-500 mb-2" />
              <span className="text-[10px] text-gray-500 tracking-widest">ANONYMOUS</span>
            </div>
             <div className="flex flex-col items-center justify-center p-4 bg-[#111] border border-[#222] text-center">
              <Network className="w-5 h-5 text-gray-500 mb-2" />
              <span className="text-[10px] text-gray-500 tracking-widest">DECENTRALIZED</span>
            </div>
             <div className="flex flex-col items-center justify-center p-4 bg-[#111] border border-[#222] text-center">
              <ShieldCheck className="w-5 h-5 text-gray-500 mb-2" />
              <span className="text-[10px] text-gray-500 tracking-widest">ENCRYPTED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
