<script lang="ts">
  import { identityId } from "./identityId";
  import { Loading } from "carbon-components-svelte";
  import type { Vote } from "./Vote";
  import { votesDao } from "./votesDao";
  import { pollsDao } from "./pollsDao";
  import type { Poll } from "./Poll";
  import { TileGroup, RadioTile } from "carbon-components-svelte";
  export let pollId: string;
  let votePromise: Promise<Vote>;
  let pollPromise: Promise<Poll>;
  $: votePromise = $votesDao.getValue({
    pollId,
    identityId: $identityId,
  });
  $: pollPromise = $pollsDao.getValue({
    id: pollId,
  });
</script>

My vote for {pollId}

{#await pollPromise}
  <Loading />
{:then poll}
    <TileGroup legend="{poll.question}">
        {#each poll.answers as answer, index}
            <RadioTile value={index + ""}>{answer}</RadioTile>
        {/each}
    </TileGroup>
  <!-- {#await votePromise}
    <Loading />
  {:then vote}
    {#if vote}
      <p>{vote.choice}</p>
    {:else}
      <p>Please vote</p>
    {/if}
  {:catch error}
    <p>{error.message}</p>
  {/await} -->
{:catch error}
  <p>{error.message}</p>
{/await}