import esbuild from 'esbuild'
import { buildConfig } from './buildConfig.mjs'

/**
 * Responsible for building the client-side app.
 */
await esbuild.build(buildConfig).catch(err => {
  console.error(err)
  process.exit(1)
})
