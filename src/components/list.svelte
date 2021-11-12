<script>
  // @ts-nocheck
  import Fuse from "fuse.js";
  import { useNavigate } from "svelte-navigator";
  const navigate = useNavigate();
  import { onMount } from "svelte";
  import { each } from "svelte/internal";
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { mongo } from "../service";

  let patients = [];

  let fuseObj;

  onMount(async () => {
    const resp = await mongo.get("all");
    patients = resp.data;

    const options = {
      includeScore: true,
      useExtendedSearch: true,
      keys: [
        { name: "AdhaarNo", weight: 3 },
        { name: "Name", weight: 2 },
      ],
    };

    fuseObj = new Fuse(patients, options);
  });

  const handleFilter = (value) => {
    if (value) {
      patients = fuseObj.search(value).map((x) => x.item);
      console.log(patients);
    } else {
      patients = fuseObj._docs;
    }
  };

  const handleClick = (Aadhaar, ehrId, name) => {
    navigate(`/patient/${Aadhaar}/${ehrId}/${name}`);
  };

  const handleDelete = async (id) => {
    const resp = await mongo.delete(`/delete?AdhaarNo=${id}`);
    const r = await mongo.get("all");
    patients = r.data;
  };
</script>

<h2 class="font-sans text-6xl font-bold mb-14">Patients Registered</h2>
<div class="flex items-center justify-center">
  <div>
    <label
      class="block text-2xl text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
      for="inline-full-name"
    >
      Search
    </label>
  </div>
  <div>
    <input
      class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-gray-500 focus:border-gray-200 focus:text-gray-100"
      id="inline-full-name"
      type="text"
      placeholder="Entry Search Query"
      on:input={(e) => handleFilter(e.target?.value)}
    />
  </div>
</div>

<div class="px-10">
  {#each patients as patient}
    <div
      in:fly={{ y: 1000, duration: 500, easing: quintOut }}
      class="m-5 rounded-lg border-2 border-gray-200 px-1 bg-gray-800 shadow-xl"
    >
      <div class="px-6 py-4 grid grid-cols-5">
        <div
          class="flex text-3xl font-bold mb-2 justify-center items-center text-gray-50
          "
        >
          {patient.Name}
        </div>
        <div class="flex justify-center items-center">
          <p class="text-gray-300 text-white font-bold text-xl">
            {patient.Gender}
          </p>
        </div>

        <p class="text-gray-300 text-base flex flex-col">
          <span class="font-bold">Aadhaar Number</span><span
            >{patient.AdhaarNo}</span
          >
        </p>
        <p class="text-gray-300 text-base flex flex-col">
          <span class="font-bold">Phone number</span>
          <span>{patient.PhoneNo}</span>
        </p>

        <div class="flex justify-end items-center gap-3">
          <sl-button
            type="success"
            on:click|preventDefault={() =>
              handleClick(patient.AdhaarNo, patient.ehrId, patient.Name)}
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
