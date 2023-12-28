import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: 'src/main.jsx',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        version:"0.1",
        namespace: 'npm/vite-plugin-monkey',
        match: ['*://m.campus.chinaunicom.cn/curriculum.html*'],
        updateURL: "https://raw.githubusercontent.com/edwardvon/LTDX_assistant/master/dist/campus_v2.user.js",
        downloadURL: "https://raw.githubusercontent.com/edwardvon/LTDX_assistant/master/dist/campus_v2.user.js"
      },
      build: {
        externalGlobals: {
          react: cdn.bootcdn('React', 'umd/react.production.min.js'),
          'react-dom': cdn.bootcdn(
            'ReactDOM',
            'umd/react-dom.production.min.js',
          ),
        },
      },
    }),
  ],
});
