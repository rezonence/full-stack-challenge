import esbuildSvelte from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import htmlPlugin from '@chialab/esbuild-plugin-html'
import { clean } from 'esbuild-plugin-clean'
import { optimizeImports } from 'carbon-preprocess-svelte'

export const buildConfig = {
  entryPoints: ['./src/poller/index.html'],
  bundle: true,
  outdir: './dist',
  banner: {
    js: 'window.global = window;'
  },
  metafile: true,
  // minify: true,
  sourcemap: true,
  sourcesContent: true,
  plugins: [
    htmlPlugin({
      scriptsTarget: 'es2020'
    }),
    esbuildSvelte({
      preprocess: [sveltePreprocess({
        typescript: {
          tsconfigFile: './src/poller/tsconfig.json'
        }
      }), optimizeImports()]
    }),
    clean({})
  ]
}
