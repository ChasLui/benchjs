import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import { copy } from "fs-extra";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "tailwindcss";
import { defineConfig, PluginOption } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isStorybook = process.argv.some((arg) => arg.includes("storybook"));

const bundleMonacoEditor = () => {
  return {
    name: "monaco-plugin",
    async buildStart() {
      const srcPath = resolve(__dirname, "node_modules/monaco-editor");
      const destPath = resolve(__dirname, "public/monaco-editor");
      if (!existsSync(destPath)) {
        await copy(srcPath, destPath, {
          dereference: true,
          overwrite: true,
        });
        console.log("[vite] bundled monaco-editor");
      }
    },
  } satisfies PluginOption;
};

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    //
    !isStorybook && reactRouter(),
    tsconfigPaths(),
    bundleMonacoEditor(),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ],
});
