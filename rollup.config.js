import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import svelte from "rollup-plugin-svelte";
// import { sass } from "svelte-preprocess-sass";
import sveltePreprocess from 'svelte-preprocess';
import { scss, globalStyle } from 'svelte-preprocess';
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import config from "sapper/config/rollup.js";
import pkg from "./package.json";
import json from "rollup-plugin-json";
// import builtins from 'rollup-plugin-node-builtins';
// import commonjs from 'rollup-plugin-commonjs';

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;
const preprocess = sveltePreprocess({
  scss: true,
  postcss: true
});

// svelte.preprocess(input, [scss(), globalStyle()])

const onwarn = (warning, onwarn) =>
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning);
const dedupe = importee =>
  importee === "svelte" || importee.startsWith("svelte/");

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      // builtins(),
      json({
        // All JSON files will be parsed by default,
        // but you can also specifically include/exclude files
        // include: 'node_modules/**',
        // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
  
        // for tree-shaking, properties will be declared as
        // variables, using either `var` or `const`
        // preferConst: true, // Default: false
  
        // specify indentation for the generated default export —
        // defaults to '\t'
        // indent: '  ',
  
        // ignores indent and generates the smallest code
        // compact: true, // Default: false
  
        // generate a named export for every property of the JSON object
        // namedExports: true // Default: true
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        preprocess: [
          scss(),
          globalStyle()
        ]
      }),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode)
      }),

      resolve({
        browser: true,
        dedupe
      }),
      commonjs(),

      legacy &&
        babel({
          extensions: [".js", ".mjs", ".html", ".svelte"],
          runtimeHelpers: true,
          exclude: ["node_modules/@babel/**"],
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead"
              }
            ]
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            [
              "@babel/plugin-transform-runtime",
              {
                useESModules: true
              }
            ]
          ]
        }),

      !dev &&
        terser({
          module: true
        })
    ],

    onwarn
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      json({
        // All JSON files will be parsed by default,
        // but you can also specifically include/exclude files
        // include: 'node_modules/**',
        // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
  
        // for tree-shaking, properties will be declared as
        // variables, using either `var` or `const`
        // preferConst: true, // Default: false
  
        // specify indentation for the generated default export —
        // defaults to '\t'
        // indent: '  ',
  
        // ignores indent and generates the smallest code
        // compact: true, // Default: false
  
        // generate a named export for every property of the JSON object
        // namedExports: true // Default: true
      }),
      replace({
        "process.browser": false,
        "process.env.NODE_ENV": JSON.stringify(mode)
      }),
      svelte({
        generate: "ssr",
        dev,
        preprocess: [
          scss(),
          globalStyle()
        ]
      }),
      resolve({
        dedupe
      }),
      commonjs()
    ],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules ||
        Object.keys(process.binding("natives"))
    ),

    onwarn
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode)
      }),
      commonjs(),
      !dev && terser()
    ],

    onwarn
  }
};
