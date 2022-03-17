<script lang="ts">
    import { identityId } from "./identityId";
    import { Loading } from "carbon-components-svelte";
    import type { Vote } from "./Vote";
    import { votesDao } from "./votesDao";
    export let pollId: string;
    export let votePromise: Promise<Vote>;
    $: votePromise = $votesDao.getValue({
        pollId,
        identityId: $identityId,
    });
</script>

My vote for {pollId}

{#await votePromise}
    <Loading />
{:then vote}
    <p>{vote.choice}</p>
{:catch error}
    <p>{error.message}</p>
{/await}
