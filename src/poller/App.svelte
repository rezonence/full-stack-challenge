<script lang="ts">
  import "carbon-components-svelte/css/g10.css";
  import { Loading } from "carbon-components-svelte";
  import {resolveSiteConfig} from "./resolveSiteConfig";
  import {siteConfig} from "./siteConfig";

  let initialised = false;
  async function start() {
    try {
      const config = await resolveSiteConfig();
      siteConfig.set(config);

    } catch (err) {
      console.error(err);
    } finally {
      initialised = true;
    }
  }

  start();
</script>

{#if initialised}
  Loaded
{:else}
  <Loading />
{/if}
