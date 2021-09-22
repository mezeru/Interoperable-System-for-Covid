<script>
  import Details from "./Startform.svelte";
  import Demo from "./newform.svelte";
  let display = 0;
  let ehrId = 0;
</script>

{#if display == 1}
  <h2 class="font-sans text-6xl font-bold">Enter Details</h2>
  <Details {ehrId} />
{/if}

{#if display === 0}
  <h2 class="font-sans text-6xl font-bold mb-5">Add a new Patient</h2>
  <Demo bind:display bind:ehrId />
{/if}
