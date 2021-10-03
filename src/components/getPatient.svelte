<script>
  import { onMount } from "svelte";
  import axios from "axios";
  let elements;
  let queryLink = "http://localhost:8080/ehrbase/rest/openehr/v1/query/aql";
  import { allCompositions } from "../aql";
  import { element } from "svelte/internal";
  let ehrId = window.location.pathname.split("/")[2];

  onMount(async () => {
    const resp = await allCompositions(ehrId);
    elements = resp[0];
  });
</script>

<div>
  {#each elements as element}
    <h1>{element.get("#0")}</h1>
  {/each}
</div>
