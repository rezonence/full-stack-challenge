<script lang="ts">
    import {
        TileGroup,
        RadioTile,
        Button,
        Tile,
        Loading,
    } from "carbon-components-svelte";
    import "carbon-components/css/carbon-components.min.css";
    import QrCode from "svelte-qrcode";
    import { countsDao } from "./countsDao";
    import { ProgressBar } from "carbon-components-svelte";
    import { results } from "./results";
    import type { Poll } from "./Poll";
    import { AppRoute } from "./AppRoute";
    import { createCountStack } from "./createCountStack";
    import type { CountStack } from "./CountStack";
    import type { PollUpdates } from "./PollUpdates";
    import { TooltipDefinition } from "carbon-components-svelte";
    export let poll: Poll;

    let countStack: CountStack;
    let countsPromise: Promise<void>;
    let max: number;

    function onUpdates(updates: PollUpdates) {
        if (updates && poll.id === updates.pollId) {
            const choices = Object.keys(updates.counts);
            const items = choices.map((choice) => ({
                choice: parseInt(choice),
                count: updates.counts[choice] as number,
                pollId: poll.id,
            }));
            countStack.add(items);
        }
    }

    $: countStack = createCountStack(poll);
    $: countsPromise = $countsDao
        .findForPollId(poll.id)
        .then((counts) => countStack.add(counts));
    $: max = Math.max(1, ...$countStack.map((c) => c.count))
    $: ($results || []).forEach(onUpdates);
</script>

{#await countsPromise}
    <Loading />
{:then}
    <Tile>
        <h4>{poll.question}</h4>
    </Tile>

    {#each $countStack as answerCount}
        <Tile>
            <ProgressBar
                {max}
                value={answerCount.count}
                labelText={answerCount.answer}
                helperText={answerCount.count + ""}
            />
        </Tile>
    {/each}
    <Tile>
        <TooltipDefinition tooltipText="Scan this QR code with a mobile device to vote">
            <div class="container">
                <a href="{location.origin}/{AppRoute.Vote}/{poll.id}" target="_blank">
                    <QrCode value="{location.origin}/{AppRoute.Vote}/{poll.id}" />
                </a>
            </div>
        </TooltipDefinition>

    </Tile>
{/await}
