import { createServer, request } from 'http'
import makeRequest from 'request'
import esbuild from 'esbuild'
import { buildConfig } from './buildConfig.mjs'
import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'

async function resolveConfigUrl () {
  const stackOutputFile = resolve('./stack/stack.json')
  if (!existsSync(stackOutputFile)) {
    throw new Error('The backend needs to be deployed before starting the demo, please run "yarn deploy"')
  }
  const stackFileString = readFileSync(stackOutputFile).toString()
  const stackConfig = JSON.parse(stackFileString)
  const firstStackName = Object.keys(stackConfig).shift()
  const pollStackConfig = stackConfig[firstStackName]
  return pollStackConfig.configUrl
}

/**
 * Adapted from https://gist.github.com/martinrue/2896becdb8a5ed81761e11ff2ea5898e
 */
async function serve (servedir, listen) {
  const configUrl = new URL(await resolveConfigUrl())

  // Start esbuild's local web server. Random port will be chosen by esbuild.
  const { host, port } = await esbuild.serve({ servedir }, buildConfig)

  // Create a second (proxy) server that will forward requests to esbuild.
  const proxy = createServer((req, res) => {
    if (req.url === configUrl.pathname) {
      // Forward requests for the config object to the deployed website
      req.pipe(makeRequest(configUrl.toString())).pipe(res)
    } else {
      // forwardRequest forwards an http request through to esbuid.
      const forwardRequest = (path) => {
        const options = {
          hostname: host,
          port,
          path,
          method: req.method,
          headers: req.headers
        }

        const proxyReq = request(options, (proxyRes) => {
          if (proxyRes.statusCode === 404) {
            // If esbuild 404s the request, assume it's a route needing to
            // be handled by the JS bundle, so forward a second attempt to `/`.
            return forwardRequest('/')
          }

          // Otherwise esbuild handled it like a champ, so proxy the response back.
          res.writeHead(proxyRes.statusCode, proxyRes.headers)
          proxyRes.pipe(res, { end: true })
        })

        req.pipe(proxyReq, { end: true })
      }

      // When we're called pass the request right through to esbuild.
      forwardRequest(req.url)
    }
  })

  // Start our proxy server at the specified `listen` port.
  proxy.listen(listen)
  console.log('Started app on port:', listen)
  const localAddress = `http://localhost:${listen}`
  console.log('Browse to', localAddress, 'or the associated URL exposed by your cloud IDE')
}

// Serves all content from ./dist on :8080.
// If esbuild 404s the request, the request is attempted again
// from `/` assuming that it's an SPA route needing to be handled by the root bundle.
serve(buildConfig.outdir, 8080)
