<script lang="ts">
  import { identityId } from "./identityId";
  import type { Vote } from "./Vote";
  import { votesDao } from "./votesDao";
  import { pollsDao } from "./pollsDao";
  import type { Poll } from "./Poll";
  import {
    TileGroup,
    RadioTile,
    Button,
    Tile,
    Loading,
  } from "carbon-components-svelte";
  import type { VoteDao } from "./VoteDao";
  export let pollId: string;
  let selected: string;

  let votePromise: Promise<Vote>;
  let pollPromise: Promise<Poll>;
  $: votePromise = $votesDao.getValue({
    pollId,
    identityId: $identityId,
  });
  $: pollPromise = $pollsDao.getValue({
    id: pollId,
  });

  async function vote(dao: VoteDao, vote: Vote) {
    await dao.put(vote);
  }
</script>

{#await pollPromise}
  <Loading />
{:then poll}
  <Tile>
    <h4>{poll.question}</h4>
  </Tile>
  <Tile>
    <TileGroup bind:selected>
      {#each poll.answers as answer, index}
        <RadioTile value={index + ""}>{answer}</RadioTile>
      {/each}
    </TileGroup>
  </Tile>
  <Tile>
    <Button
      on:click={() =>
        vote($votesDao, {
          choice: parseInt(selected),
          identityId: $identityId,
          pollId: poll.id,
        })}
      disabled={!selected}
    >
      Vote
    </Button>
  </Tile>

  {#await votePromise}
    <Loading />
  {:then vote}
    {#if vote}
      <p>{vote.choice}</p>
    {:else}
      <p>Please vote</p>
    {/if}
  {:catch error}
    <p>{error.message}</p>
  {/await}
{:catch error}
  <p>{error.message}</p>
{/await}
