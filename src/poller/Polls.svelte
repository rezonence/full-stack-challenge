<script lang="ts">
    import type { Poll } from "./Poll";

    import { pollsDao } from "./pollsDao";
    import type { PollUpdates } from "./PollUpdates";
    import { pollUpdates } from "./pollUpdates";

    let polls: Poll[];
    let latestUpdate: PollUpdates;
    pollsDao.subscribe(async (dao) => {
        polls = await dao.list();
    });

    pollUpdates.subscribe((update) => {
        latestUpdate = update;
        console.log(update);
    });
</script>

{#if polls}
    Found {polls.length} polls;
{/if}
