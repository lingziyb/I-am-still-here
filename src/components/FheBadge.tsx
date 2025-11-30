import React from 'react';
import { Lock } from 'lucide-react';

export const FheBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center space-x-2 bg-zama-dark border border-gray-800 rounded-full px-3 py-1 text-xs text-gray-400 select-none">
      <Lock className="w-3 h-3 text-zama-accent" />
      <span>FHE Encrypted • Fully Anonymous</span>
    </div>
  );
};