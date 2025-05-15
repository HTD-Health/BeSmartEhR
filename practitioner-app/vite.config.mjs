import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'node:path';
import { defineConfig } from 'vite';

dotenv.config();

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
        ...(process.env.NODE_ENV === 'development' && {
            https: {
                key: fs.readFileSync(path.resolve(__dirname, process.env.SSL_KEY_FILE)),
                cert: fs.readFileSync(path.resolve(__dirname, process.env.SSL_CRT_FILE))
            }
        })
    }
});
