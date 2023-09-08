import dns from 'dns'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// Ensure, that vite prints "localhost" instead of 127.0.0.1
// See https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    build: {
      commonjsOptions: {
        include: [/scrivito/, /node_modules/],
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          _scrivito_extensions: resolve(__dirname, '_scrivito_extensions.html'),
        },
      },
    },
    define: {
      'import.meta.env.SCRIVITO_TENANT': JSON.stringify(env.SCRIVITO_TENANT),
      'import.meta.env.ENABLE_NEOLETTER_FORM_BUILDER_SUBSCRIPTION_FEATURE':
        JSON.stringify(env.ENABLE_NEOLETTER_FORM_BUILDER_SUBSCRIPTION_FEATURE),
    },
    plugins: [react()],
    preview: {
      port: 8080,
      strictPort: true,
    },
    server: {
      port: 8080,
      strictPort: true,
      proxy: {
        '/ams': API_PROXY,
        '/beta/ams': API_PROXY,
        '/dashboard': API_PROXY,
        '/iam': API_PROXY,
        '/xds': {
          secure: false,
          changeOrigin: true,
          target:
            'https://3ey77fak3zwfxs3wah6zav3axi0sbsik.lambda-url.eu-central-1.on.aws/',
        },
      },
    },
    optimizeDeps: {
      include: ['scrivito'],
    },
  }
})

const API_PROXY = {
  secure: false,
  changeOrigin: true,
  target: 'https://api.justrelate.com/',
  onProxyReq(request) {
    request.setHeader('X-JR-API-Location', `http://localhost:${8080}`)
    request.setHeader(
      'X-JR-Treat-Localhost-Like',
      'https://console.justrelate.com',
    )
  },
}
