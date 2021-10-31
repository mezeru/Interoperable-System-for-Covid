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

  const handleClick = (ehrId, name, Aadhaar) => {
    navigate(`/patient/${ehrId}?Name=${name}&Aadhaar=${Aadhaar}`);
  };

  const handleDelete = async (id) => {
    const resp = await axios.delete(
      `http://localhost:3000/delete?AdhaarNo=${id}`
    );
    const r = await axios.get(`${baseURL}all`);
    patients = [...r.data];
  };
</script>

<h2 class="font-sans text-6xl font-bold mb-14">Patients Registered</h2>
<div>
  {#each patients as patient}
    <div
      in:fly={{ y: 1200, duration: 600 }}
      class="mb-5 rounded-lg border-2 border-blue-200 bg-gray-50 lg:rounded-r p-4 shadow-md"
    >
      <div class="px-6 py-4 grid grid-cols-5">
        <div class="flex text-2xl font-bold mb-2 items-center text-gray-900">
          {patient.Name}
        </div>
        <div class="flex justify-center items-center">
          <p class="text-gray-700 text-black-400 font-bold text-xl">
            {patient.Gender}
          </p>
        </div>

        <p class="text-gray-700 text-base flex flex-col">
          <span class="font-bold">Aadhaar Number</span><span
            >{patient.AdhaarNo}</span
          >
        </p>
        <p class="text-gray-700 text-base flex flex-col">
          <span class="font-bold">Phone number</span>
          <span>{patient.PhoneNo}</span>
        </p>

        <div class="flex justify-end items-center gap-3">
          <sl-button
            type="success"
            on:click|preventDefault={() =>
              handleClick(patient.ehrId, patient.Name, patient.AdhaarNo)}
          >
            <sl-icon name="hdd-stack-fill" slot="suffix" />View Details
          </sl-button>
          <sl-button
            type="danger"
            on:click|preventDefault={() => handleDelete(patient.AdhaarNo)}
          >
            <sl-icon name="trash" slot="suffix" />
          </sl-button>
        </div>
      </div>
    </div>
  {/each}
</div>
