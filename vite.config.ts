import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type ProxyOptions } from 'vite'

// DockerHub's API does not send CORS headers, so the browser can't call it
// directly. Requests to /dockerhub/* are forwarded to https://hub.docker.com/*.
const dockerHubProxy: Record<string, ProxyOptions> = {
  '/dockerhub': {
    target: 'https://hub.docker.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/dockerhub/, ''),
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: dockerHubProxy,
  },
  preview: {
    proxy: dockerHubProxy,
  },
})
