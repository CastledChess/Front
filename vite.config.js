import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
export default defineConfig({
    plugins: [
        react(),
        svgLoader(),
        {
            name: 'configure-response-headers',
            configureServer: function (server) {
                server.middlewares.use(function (_req, res, next) {
                    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
                    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
                    next();
                });
            },
            configurePreviewServer: function (server) {
                server.middlewares.use(function (_req, res, next) {
                    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
                    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
                    next();
                });
            },
        },
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
