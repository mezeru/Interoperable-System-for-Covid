<script lang="ts">
  import { onMount } from "svelte";
  import { Assessment } from "../aql";
  let assessment = [];
  export let ehrId;
  export let id;
  export let name;
  onMount(async () => {
    let list = await Assessment(ehrId);
    assessment = list.rows;
    console.log(assessment);
  });
</script>

<div>
  <div
    class="flex flex-col p-5 shadow-lg rounded-t-lg border bg-gray-700 justify-between"
  >
    <p class="text-2xl text-white">{id}</p>
    <p class="font-bold text-4xl text-white">{name}</p>
  </div>
  <sl-tab-group>
    <sl-tab slot="nav" panel="general">Risk</sl-tab>
    <sl-tab slot="nav" panel="custom">Custom</sl-tab>
    <sl-tab slot="nav" panel="advanced">Advanced</sl-tab>
    <sl-tab slot="nav" panel="disabled" disabled>Disabled</sl-tab>

    <sl-tab-panel name="general" />

    <sl-tab-panel name="custom">This is the custom tab panel.</sl-tab-panel>
    <sl-tab-panel name="advanced">This is the advanced tab panel.</sl-tab-panel>
    <sl-tab-panel name="disabled">This is a disabled tab panel.</sl-tab-panel>
  </sl-tab-group>
</div>
