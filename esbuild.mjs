import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import alias from "esbuild-plugin-alias";
import htmlPlugin from '@chialab/esbuild-plugin-html';
import { clean } from 'esbuild-plugin-clean';
import { resolve } from 'import-meta-resolve'
import { resolve as resolvePath } from "path";
import { optimizeImports } from "carbon-preprocess-svelte";

async function resolveEntrypoint(libName) {
    const url = await resolve(libName, import.meta.url);
    return url.replace("file://", "");
}

async function resolveEntryPoints(libNames) {
    const entries = await Promise.all(libNames.map(async libName => [libName, await resolveEntrypoint(libName)]));
    return entries.reduce((alias, entry) => ({
        ...alias,
        [entry[0]]: entry[1]
    }), {});
}

async function build() {
    const aliasConfig = await resolveEntryPoints(['@aws-sdk/util-utf8-browser', 'svelte', 'svelte/internal', 'svelte/store', 'svelte/transition']);
    const outputDir = "./dist";
    await esbuild
        .build({
            entryPoints: ["./src/poller/index.html"],
            bundle: true,
            outdir: outputDir,
            banner: {
                js: "window.global = window;"
            },
            metafile: true,
            // minify: true,
            sourcemap: true,
            sourcesContent: true,
            plugins: [
                htmlPlugin({
                    // scriptsTarget: 'es6',
                    // modulesTarget: 'es2020',
                }),

                // esbuild seems to have difficulties resolving some indirect dependencies (perhaps due to the way PNPM works)
                alias({
                    ...aliasConfig,
                    'url': resolvePath('node_modules/url/url.js'),
                    'querystring': resolvePath('node_modules/querystring/index.js'),
                    'punycode': resolvePath('node_modules/punycode/punycode.js')
                }),
                esbuildSvelte({
                    preprocess: [sveltePreprocess({
                        typescript: {
                            tsconfigFile: "./src/poller/tsconfig.json"
                        }
                    }), optimizeImports()],
                }),
                clean({})
            ],
        });

}

build().catch(err => {
    console.error(err);
    process.exit(1)
});
