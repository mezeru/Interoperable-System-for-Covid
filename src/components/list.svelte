<script>
  // @ts-nocheck
  import Fuse from "fuse.js";
  import OptKit from 'optkit';
  import { useNavigate } from "svelte-navigator";
  const navigate = useNavigate();
  import { onMount } from "svelte";
  import { each } from "svelte/internal";
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { mongo } from "../service";
  import loading1 from "../../assets/loading1.svg";

  let patients = [];
  let loading = true;
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
    loading = false;
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
    navigate(`/patient/${ehrId}`);
  };

  const handleDelete = async (id) => {
    let confirmed = await confirm("Confirm Delete Patient ?","Delete");
    
    if (confirmed){
      loading = true;
      patients = [];
    const resp = await mongo.delete(`/delete?AdhaarNo=${id}`);
    const r = await mongo.get("all");
    patients = r.data;
    }
    
    
    loading = false;
  };
</script>

<OptKit/>
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
  {#if loading}
    <div class="flex items-center justify-center">
      <img width="300px" src={loading1} alt="loading" />
    </div>
  {:else if patients.length > 0}
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
            <p class="text-center">
              {patient.Name}
            </p>
          </div>
          <div class="flex justify-center items-center">
            <p class="text-gray-300 font-bold text-xl">
              {patient.Gender}
            </p>
          </div>

          <p
            class="text-gray-300 text-base flex flex-col items-center justify-center"
          >
            <span class="font-bold">Aadhaar Number</span><span
              >{patient.AdhaarNo}</span
            >
          </p>
          <p
            class="text-gray-300 text-base flex flex-col items-center justify-center"
          >
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
  {:else}
    <div>
      <p
        class="text-6xl subpixel-antialiased text-center p-5 text-red-500 font-bold"
      >
        No Data
      </p>
    </div>
  {/if}
</div>
