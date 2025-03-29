import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
    }),
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, 'src/assets/opensearch.xml'),
          dest: '',
          transform: (content) => {
            const siteDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL
              ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
              : 'http://localhost:5173'; 
            return content.toString().replace(/%origin%/g, siteDomain);
          },
        },
      ],
    }),
  ],
});
