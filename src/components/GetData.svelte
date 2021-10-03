<script>
  import { useNavigate } from "svelte-navigator";
  const navigate = useNavigate();
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

  const handleClick = (ehrId) => {
    navigate(`/patient/${ehrId}`);
  };
</script>

<h2 class="font-sans text-6xl font-bold mb-14">Patients Registered</h2>
<div>
  {#each patients as patient}
    <div
      in:fly={{ y: 200, duration: 3000 }}
      out:fade
      class="mb-5 rounded-lg border-2 border-blue-200 bg-gray-50 lg:rounded-r p-4 shadow-md"
    >
      <div class="px-6 py-4 grid grid-cols-4">
        <div class="flex font-bold text-3xl mb-2 items-center text-blue-700">
          {patient.Name}
        </div>
        <div class="flex justify-center items-center">
          <p class="text-gray-700 text-black-400 font-bold text-xl">
            {patient.Gender}
          </p>
        </div>
        <div class="flex flex-row gap-10 items-center">
          <p class="text-gray-700 text-base flex flex-col">
            <span class="font-bold">Aadhaar Number</span><span
              >{patient.AdhaarNo}</span
            >
          </p>
          <p class="text-gray-700 text-base flex flex-col">
            <span class="font-bold">Phone number</span>
            <span>{patient.PhoneNo}</span>
          </p>
        </div>

        <div class="flex justify-end">
          <button
            on:click|preventDefault={() => handleClick(patient.ehrId)}
            class="bg-blue-500 hover:bg-blue-700 px-10 py-2 text-white font-bold border border-blue-700 rounded flex items-center"
          >
            View
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>
