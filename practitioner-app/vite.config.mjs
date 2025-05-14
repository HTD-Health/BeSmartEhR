import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    build: {
        outDir: 'dist'
    },
    server: {
        port: 3010,
        ...(import.meta.env.NODE_ENV === 'development' && {
            https: {
                key: fs.readFileSync(path.resolve(__dirname, './localhost-key.pem')),
                cert: fs.readFileSync(path.resolve(__dirname, './localhost.pem'))
            }
        })
    }
});
