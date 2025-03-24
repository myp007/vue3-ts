/*
 * @Author: m
 * @Date: 2025-03-17 14:45:03
 * @LastEditTime: 2025-03-24 18:32:34
 * @Description:
 * @FilePath: \yuerbao\vite.config.js
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { VantResolver } from '@vant/auto-import-resolver';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { VueMcp } from'vite-plugin-vue-mcp'
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [VantResolver()],
        }),
        Components({
            resolvers: [VantResolver()],
        }),
        VueMcp({
              // 可选配置项
              host: 'localhost',
              port:4000,
              printUrls: true
            })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        port: 4000,
        open: true,
        cors: true,
        host: '0.0.0.0'
    },
});
