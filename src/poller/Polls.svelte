<script lang="ts">
    import type { Poll } from "./Poll";

    import { pollsDao } from "./pollsDao";
    import type { PollUpdates } from "./PollUpdates";
    import { results } from "./results";

    let polls: Poll[];
    let latestUpdate: PollUpdates;
    pollsDao.subscribe(async (dao) => {
        polls = [];
        for await (const items of dao.list()) {
            polls.push(...items);
        }
    });

    results.subscribe((update) => {
        latestUpdate = update;
        console.log(update);
    });
</script>

{#if polls}
    Found {polls.length} polls;
{/if}
