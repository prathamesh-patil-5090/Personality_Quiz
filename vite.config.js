import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aggressive minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        toplevel: true,
        safari10: true
      },
      format: {
        comments: false
      }
    },
    // Asset obfuscation with hashed filenames
    rollupOptions: {
      output: {
        // Remove identifying patterns from chunk names
        chunkFileNames: () => {
          return `assets/[hash].js`;
        },
        entryFileNames: `assets/[hash].js`,
        assetFileNames: (assetInfo) => {
          // Obfuscate asset names
          const extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/img/[hash].[ext]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[hash].[ext]`;
          }
          return `assets/[hash].[ext]`;
        },
        // Obfuscate manual chunks
        manualChunks: (id) => {
          // Don't create obvious vendor chunks
          if (id.includes('node_modules')) {
            // Create random chunk names instead of 'vendor'
            return 'lib';
          }
        }
      }
    },
    // Additional obfuscation
    cssCodeSplit: true,
    sourcemap: false,
    // Reduce bundle analysis capabilities
    reportCompressedSize: false
  },
  // Remove Vite branding from dev tools
  define: {
    __DEV__: false,
    __PROD__: true
  }
})
