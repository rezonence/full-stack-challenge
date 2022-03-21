<script lang="ts">
  import "carbon-components-svelte/css/g10.css";
  import { Loading } from "carbon-components-svelte";
  import { applyConfiguration } from "./applyConfiguration";
  import Router from "svelte-navigator/src/Router.svelte";
  import Route from "svelte-navigator/src/Route.svelte";
  import Polls from "./Polls.svelte";
  import Vote from "./Vote.svelte";
  import { AppRoute } from "./AppRoute";
  import { RouteParam } from "./RouteParam";
  import ErrorToast from "./ErrorToast.svelte";
  const setupPromise = applyConfiguration()
</script>
{#await setupPromise}
  <Loading />
{:then result}
  <Router>
    <Route path="/">
      <Polls />
    </Route>
    <Route path="{AppRoute.Vote}/:{RouteParam.Id}" let:params>
      <Vote pollId={params[RouteParam.Id]} />
    </Route>
  </Router>
{:catch error}
  <ErrorToast {error} />
{/await}
