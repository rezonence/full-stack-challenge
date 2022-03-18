<script lang="ts">
  import { votesDao } from "./votesDao";
  import { pollsDao } from "./pollsDao";
  import {
    TileGroup,
    RadioTile,
    Button,
    Tile,
    Loading,
  } from "carbon-components-svelte";
  import type { Vote } from "./Vote";
  import ErrorToast from "./ErrorToast.svelte";
import type { VoteDao } from "./VoteDao";

  export let pollId: string;
  let selected: string;
  let submittedVote: Promise<Vote | undefined>;
  
  async function loadVote(dao: VoteDao, id: string): Promise<Vote | undefined> {
    const vote = await dao.getForPoll(id)
    selected = vote ? `${vote.choice}` : selected
    return vote;
  }
</script>

{#await $pollsDao.getValue({ id: pollId })}
  <Loading />
{:then poll}
  {#await loadVote($votesDao, pollId)}
    <Loading />
  {:then previousVote}
    <Tile>
      <h4>{poll.question}</h4>
    </Tile>
    <Tile>
      <TileGroup bind:selected>
        {#each poll.answers as answer, index}
          <RadioTile
            value={index + ""}
            disabled={!!previousVote || !!submittedVote}>{answer}</RadioTile
          >
        {/each}
      </TileGroup>
    </Tile>
    <Tile>
      <Button
        on:click={() =>
          (submittedVote = $votesDao.vote({
            choice: parseInt(selected),
            pollId: poll.id,
          }))}
        disabled={!selected || !!previousVote || !!submittedVote}
      >
        Vote
      </Button>
    </Tile>
  {:catch error}
    <ErrorToast {error} />
  {/await}
{:catch error}
  <ErrorToast {error} />
{/await}
