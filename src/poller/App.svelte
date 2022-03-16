<script lang="ts">
  import "carbon-components-svelte/css/g10.css";
  import { Loading } from "carbon-components-svelte";
  import { applyConfiguration } from "./applyConfiguration";
  import Polls from "./Polls.svelte"


  let initialised = false;
  async function start() {
    try {
      await applyConfiguration();
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
  <Polls></Polls>
{:else}
  <Loading />
{/if}
