import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import htmlPlugin from '@chialab/esbuild-plugin-html';
import { clean } from 'esbuild-plugin-clean';
import { optimizeImports } from "carbon-preprocess-svelte";
import yargs from "yargs";
import {resolve} from "path";
import {existsSync, readFileSync, writeFileSync} from "fs";
import fetch from "node-fetch";

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
            minify: true,
            sourcemap: true,
            sourcesContent: true,
            plugins: [
                htmlPlugin({
                    scriptsTarget: 'es2020'
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

        const options = yargs(process.argv.slice(2)).option("dev", {type: "boolean"}).parse();
        
        if (options.dev) {
            const stackOutputFile = resolve("./stack/stack.json");
            if (!existsSync(stackOutputFile)) {
                throw new Error("The backend needs to be deployed before starting the demo, please run \"yarn deploy\"");
            }
            const configFileName = "config.json";
            const configPath = resolve(outputDir, configFileName);
            if (!existsSync(configPath)) {
                const stackFileString = readFileSync(stackOutputFile).toString();
                const stackConfig = JSON.parse(stackFileString);
                const firstStackName = Object.keys(stackConfig).shift();
                const pollStackConfig = stackConfig[firstStackName];
                const websiteUrl = pollStackConfig.websiteUrl;
                const response = await fetch(`${websiteUrl}/${configFileName}`);
                const config = await response.json();
                writeFileSync(configPath, JSON.stringify(config));
            }
        }
}

build().catch(err => {
    console.error(err);
    process.exit(1)
});
