import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173, // Default Vite port
//     open: true, // Auto open browser
//   },
//   resolve: {
//     alias: {
//       '@': '/src', // Alias for src directory
//     },
//   },
//   build: {
//     outDir: 'dist', // Output folder for build
//   },
// });
