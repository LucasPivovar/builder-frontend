import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({plugins:[vue()],server:{host:'127.0.0.1',port:8080,proxy:{'/api':{target:'http://127.0.0.1:3000',changeOrigin:true},'/media':{target:'http://127.0.0.1:3000',changeOrigin:true}}},test:{environment:'jsdom',clearMocks:true},build:{chunkSizeWarningLimit:500,rollupOptions:{output:{manualChunks:{vue:['vue','vue-router']}}}}});
