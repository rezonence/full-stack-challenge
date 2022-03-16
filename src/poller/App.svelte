<script lang="ts">
  import "carbon-components-svelte/css/g10.css";
  import { Loading } from "carbon-components-svelte";
  import { applyConfiguration } from "./applyConfiguration";
  import Router from "svelte-navigator/src/Router.svelte";
  import Route from "svelte-navigator/src/Route.svelte";
  import Polls from "./Polls.svelte"
  import Vote from "./Vote.svelte";

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
<Router>
  <Route path="/">
    <Polls></Polls>
  </Route>
  <Route path="vote">
    <Vote></Vote> 
  </Route>
</Router>
{:else}
  <Loading />
{/if}
