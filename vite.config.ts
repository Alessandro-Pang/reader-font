/*
 * @Author: zi.yang
 * @Date: 2024-12-05 09:23:18
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-12-06 21:40:20
 * @Description: 
 * @FilePath: /reader-font/vite.config.ts
 */
import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig((conf) => {
  const isProd = conf.mode === 'production';
  return {
    plugins: [vue()],
    base: isProd ? '/reader-font/' : '/',
  };
});