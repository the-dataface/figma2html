import path from "path";
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import svg from "rollup-plugin-svg";
import typescript from "@rollup/plugin-typescript";
import sveltePreprocess from "svelte-preprocess";
import htmlBundle from "rollup-plugin-html-bundle";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import childProcess from "child_process";

const production = !process.env.ROLLUP_WATCH;
const projectDir = path.resolve(__dirname);

export default [
  {
    input: "app.js",
    output: {
      format: "iife",
      name: "ui",
      file: "build/bundle.js",
    },
    plugins: [
      svelte({
        dev: !production,
        preprocess: sveltePreprocess({
          sourceMap: !production,
        }),
        compilerOptions: {
          dev: !production,
        },
      }),
      resolve({
        browser: true,
        dedupe: (importee) =>
          importee === "svelte" || importee.startsWith("svelte/"),
        extensions: [".svelte", ".mjs", ".js", ".json", ".node"],
      }),
      typescript(),
      commonjs(),
      svg(),
      postcss({
        extensions: [".css"],
        plugins: [cssnano()],
      }),
      htmlBundle({
        template: "src/index.html",
        target: "build/index.html",
        inline: true,
      }),
      !production && serve(),
      !production && livereload("build"),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/main.ts",
    output: {
      file: "build/main.js",
      format: "cjs",
      name: "main",
    },
    plugins: [typescript(), commonjs(), production && terser()],
  },
];

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        childProcess.spawn("npm", ["run", "start", "--", "--dev"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        });
      }
    },
  };
}
