import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    // Relative asset paths, so the built dist/ folder can be served from any
    // path on any host without rebuilding — drop it wherever it should live.
    base: './'
});
