
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // Crucial for Top-Level Await
  },
  optimizeDeps: {
    // Prevent Vite from trying to bundle the remote Zama SDK
    exclude: ['@zama-fhe/relayer-sdk', 'fhevmjs']
  } 
});
