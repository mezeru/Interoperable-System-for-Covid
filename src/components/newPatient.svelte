<script>
  import Details from "./Startform.svelte";
  import Demo from "./newform.svelte";
  export let baseURL;
  let display = 0;
  let ehrId = null;
</script>

{#if display == 1}
  <Details {ehrId} />
{/if}

{#if display === 0}
  <h2 class="font-sans text-6xl font-bold mb-5">Add a new Patient</h2>
  <Demo bind:display bind:ehrId {baseURL} />
{/if}
