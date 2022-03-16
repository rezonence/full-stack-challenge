<script lang="ts">
    import type { Poll } from "./Poll";

    import { pollsDao } from "./pollsDao";
    import type { PollUpdates } from "./PollUpdates";
    import { results } from "./results";

    let polls: Poll[];
    let latestUpdate: PollUpdates;
    pollsDao.subscribe(async (dao) => {
        const allPolls = [];
        for await (const items of dao.list()) {
            allPolls.push(...items);
        }
        polls = allPolls;
    });

    results.subscribe((update) => {
        latestUpdate = update;
        console.log(update);
    });
</script>

{#if polls}
    {#each polls as poll}
        Question: {poll.question}
    {/each}
{/if}
