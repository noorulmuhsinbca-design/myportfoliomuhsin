import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin.html'),
            },
        },
    },
    server: {
        port: 8080,
        proxy: {
            // Clean URLs: /admin will now serve the login page
            '^/admin$': {
                target: 'http://localhost:8080',
                rewrite: () => '/login.html',
            },
        },
    },
});
