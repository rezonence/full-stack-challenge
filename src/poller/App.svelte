<script lang="ts">
  import "carbon-components-svelte/css/g10.css";
  import { Loading } from "carbon-components-svelte";
  import { applyConfiguration } from "./applyConfiguration";
  import Router from "svelte-navigator/src/Router.svelte";
  import Route from "svelte-navigator/src/Route.svelte";
  import Polls from "./Polls.svelte";
  import Poll from "./Poll.svelte";
  import Vote from "./Vote.svelte";
  import { AppRoute } from "./AppRoute";
  import { RouteParam } from "./RouteParam";

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
    <Route path="{AppRoute.Poll}/:{RouteParam.Id}" let:params>
      <Poll pollId="{params[RouteParam.Id]}"/>
    </Route>
    <Route path="{AppRoute.Vote}/:{RouteParam.Id}" let:params>
      <Vote pollId="{params[RouteParam.Id]}"/>
    </Route>
    <Route path="/">
      <Polls />
    </Route>
  </Router>
{:else}
  <Loading />
{/if}
