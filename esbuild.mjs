import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import alias from "esbuild-plugin-alias";
import htmlPlugin from '@chialab/esbuild-plugin-html';
import { clean } from 'esbuild-plugin-clean';
import { resolve as resolvePath } from "path";
import { optimizeImports } from "carbon-preprocess-svelte";

async function build() {
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
                htmlPlugin({}),
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
