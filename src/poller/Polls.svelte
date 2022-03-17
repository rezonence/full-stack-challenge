<script lang="ts">
    import type { Poll } from "./Poll";
    import { Loading } from "carbon-components-svelte";
    import { pollsDao } from "./pollsDao";
    import type { PollUpdates } from "./PollUpdates";
    import { results } from "./results";
    import PollChart from "./PollChart.svelte";
    let pollsPromise: Promise<Poll[]>;
    let latestUpdate: PollUpdates;
    
    $: pollsPromise = $pollsDao.listAll();
    $: latestUpdate = $results
</script>

{#await pollsPromise}
    <Loading/>
{:then polls}
    {#each polls as poll}
        <PollChart poll={poll}></PollChart>
    {/each}
{:catch error}
    <p>{error.message}</p>
{/await}