<script lang="ts">
  import { ToastNotification } from "carbon-components-svelte";
  export let error: Error;
</script>

<ToastNotification
  title="Error"
  subtitle={error.message}
  caption={new Date().toLocaleString()}
/>
