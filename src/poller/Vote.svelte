<script lang="ts">
  import { votesDao } from "./votesDao";
  import { pollsDao } from "./pollsDao";
  import { identityId } from "./identityId";
  import {
    TileGroup,
    RadioTile,
    Button,
    Tile,
    Loading,
    ToastNotification,
  } from "carbon-components-svelte";
  export let pollId: string;
  let selected: string;
</script>

{#await $pollsDao.getValue({ id: pollId })}
  <Loading />
{:then poll}
  {#await $votesDao.getValue({ pollId, identityId: $identityId })}
    <Loading />
  {:then previousVote}
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
          $votesDao.put({
            choice: parseInt(selected),
            identityId: $identityId,
            pollId: poll.id,
          })}
        disabled={!selected || !!previousVote}
      >
        Vote
      </Button>
    </Tile>
  {:catch error}
    <ToastNotification
      title="Error"
      subtitle={error.message}
      caption={new Date().toLocaleString()}
    />
  {/await}
{:catch error}
  <ToastNotification
    title="Error"
    subtitle={error.message}
    caption={new Date().toLocaleString()}
  />
{/await}
