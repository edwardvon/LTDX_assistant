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
        description: "LTDX网课助手",
        author: "cmsang",
        version: "2024-12-09",
        namespace: 'https://greasyfork.org/zh-CN/scripts/483291-campus-v2',
        match: [
          '*://*campus.chinaunicom.cn/curriculum.html*', 
          '*://*campus.chinaunicom.cn/*',
          '*://party.chinaunicom.cn/*ltxfStudyCenterDetailPage.html*',
        ],
        updateURL: "https://raw.githubusercontent.com/edwardvon/LTDX_assistant/master/dist/campus_v2.meta.js",
        downloadURL: "https://raw.githubusercontent.com/edwardvon/LTDX_assistant/master/dist/campus_v2.user.js"
      },
      build: {
        externalGlobals: {
          react: cdn.elemecdn('React', 'umd/react.production.min.js'),
          'react-dom': cdn.elemecdn(
            'ReactDOM',
            'umd/react-dom.production.min.js',
          ),
        },
      },
    }),
  ],
});
