<script lang="ts">
    import {
        TileGroup,
        RadioTile,
        Button,
        Tile,
        Loading,
    } from "carbon-components-svelte";
    import { BarChartSimple } from "@carbon/charts-svelte";
    import "@carbon/charts/styles.min.css";
    import "carbon-components/css/carbon-components.min.css";
    import {countsDao} from "./countsDao";
    import {results} from "./results";
    import type { Poll } from "./Poll";
    import type { CountItem } from "./CountItem";
    export let poll: Poll;

    let countsPromise: Promise<CountItem[]>;
    $: countsPromise = $countsDao.findForPollId(poll.id);
    function toChartData(countItems: CountItem[]): {group: string, value: number}[] {
        return poll.answers.map((answer, index) => ({ value: countItems.find(c => c.choice === index)?.count, group: answer}));
    }
    
</script>
{#await countsPromise}
    <Loading></Loading> 
{:then countItems}
<Tile>
    <h4>{poll.question}</h4>
</Tile>
<Tile>
    <BarChartSimple
    data={toChartData(countItems)}
    options={{
        // title: "Simple bar (discrete)",
        height: "400px",
        axes: {
            left: { mapsTo: "value" },
            bottom: { mapsTo: "group", scaleType: "labels" },
        },
    }}
/>
</Tile>
{/await}


