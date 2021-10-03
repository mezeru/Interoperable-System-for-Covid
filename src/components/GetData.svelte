<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { each } from "svelte/internal";
  import { fade, fly } from "svelte/transition";
  let patients = [];
  export let baseURL;

  onMount(async () => {
    const resp = await axios.get(`${baseURL}all`);
    patients = [...resp.data];
  });

  const handleClick = () => {};
</script>

<h2 class="font-sans text-6xl font-bold mb-5">Patients Registered</h2>
<div>
  {#each patients as patient}
    <div
      on:click={handleClick}
      in:fly={{ y: 200, duration: 3000 }}
      out:fade
      class="mb-2 rounded-lg border-2 border-blue-200 lg:rounded-r p-4 flex flex-col justify-between leading-normal shadow-lg"
    >
      <div class="px-6 py-4 flex flex-rows justify-between">
        <div class="font-bold text-xl mb-2 align-center">{patient.Name}</div>
        <div>
          <p class="text-gray-700 text-base">
            Aadhaar Number : {patient.AdhaarNo}
          </p>
          <p class="text-gray-700 text-base">
            Phone number : {patient.PhoneNo}
          </p>
        </div>
      </div>
    </div>
  {/each}
</div>
