/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";
import dotenv from "dotenv";
import express from './express-plugin' 

// Load environment variables
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), express('src/server')],
  test: {
    environment: "happy-dom",
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@api": path.resolve(__dirname, "./src/api"),
    },
  },
  define: {
    'process.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY),
  },
});
