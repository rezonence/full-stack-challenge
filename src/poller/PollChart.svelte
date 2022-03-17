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
    import type { Poll } from "./Poll";
    export let poll: Poll;
</script>

<Tile>
    <h4>{poll.question}</h4>
</Tile>
<Tile>
    <BarChartSimple
    data={[
        { group: "Qty", value: 65000 },
        { group: "More", value: 29123 },
        { group: "Sold", value: 35213 },
        { group: "Restocking", value: 51213 },
        { group: "Misc", value: 16932 },
    ]}
    options={{
        title: "Simple bar (discrete)",
        height: "400px",
        axes: {
            left: { mapsTo: "value" },
            bottom: { mapsTo: "group", scaleType: "labels" },
        },
    }}
/>
</Tile>

