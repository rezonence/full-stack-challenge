<script lang="ts">
    import { useParams } from "svelte-navigator";
    import { RouteParam } from "./RouteParam";
    const params = useParams();
</script>

Poll {$params[RouteParam.Id]}
