import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/commas-ai-copilot/',
  plugins: [react(), tailwindcss()],
});
