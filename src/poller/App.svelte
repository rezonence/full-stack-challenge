<script lang="ts">
  import "carbon-components-svelte/css/g10.css";
  import { Loading } from "carbon-components-svelte";
  import { authenticate } from "./authenticate";

  let initialised = false;
  async function start() {
    try {
      const creds = await authenticate();
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
