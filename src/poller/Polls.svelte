<script lang="ts">
    import type { Poll } from "./Poll";
    import { Loading } from "carbon-components-svelte";
    import { pollsDao } from "./pollsDao";
    import PollChart from "./PollChart.svelte";
    let pollsPromise: Promise<Poll[]>;  
    $: pollsPromise = $pollsDao.listAll();
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