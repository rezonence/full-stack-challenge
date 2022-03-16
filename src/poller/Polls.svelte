
<script lang="ts">
import type { Poll } from "./Poll";

    import {pollsDao} from "./pollsDao";
    let polls: Poll[];
    pollsDao.subscribe(async dao => {
        polls = await dao.list();
    });
</script>

{#if polls}
    Found {polls.length} polls;
{/if}