import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server :{
    //port :3000,
    // get rid of cors error
    proxy:{
      "/api":{
        target: "https://threads-clone-nu-nine.vercel.app/",
        changeOrigin: true,
        secure: false,
      }

    }
  }
})
