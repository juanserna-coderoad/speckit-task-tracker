import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Logic and storage tests use plain data and an injected storage object, so no DOM is needed.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
