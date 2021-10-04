<script lang="ts">
  import "@shoelace-style/shoelace/dist/components/format-date/format-date";
  import "@shoelace-style/shoelace/dist/components/skeleton/skeleton";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import axios from "axios";
  let temp: { rows: { name: string }[]; columns: Record<string, string>[] } =
    null;
  import { allCompositions } from "../aql";
  import { each, text } from "svelte/internal";
  import { useNavigate } from "svelte-navigator";
  const navigate = useNavigate();
  let ehrId = window.location.pathname.split("/")[2];
  let searchParams = new URLSearchParams(window.location.search);

  let table = new Set([
    "Time",
    "Temperature",
    "Pulse_Presence",
    "Pulse_Rate",
    "SpO2",
  ]);

  let demo = {
    Name: "Yash",
    Aadhaar: 10890980,
  };

  onMount(async () => {
    console.log(ehrId);
    const resp = await allCompositions(ehrId);
    console.log(resp);
    temp = resp;
  });

  const handleName = (row, key) => {
    if (!row) {
      return "-";
    }

    switch (key) {
      case "Time":
        let time = new Date(row.value);
        return (
          time.getDay().toString() +
          "/" +
          time.getMonth().toString() +
          "/" +
          time.getFullYear().toString() +
          "\n" +
          time.getHours().toString() +
          ":" +
          time.getMinutes().toString()
        );

      case "SpO2":
        return row.numerator + "%";

      case "Temperature":
      case "Pulse_Rate":
        return row.magnitude + " " + row.units;
    }
    return row.value;
  };
</script>

<div in:fly={{ y: 200, duration: 1000 }} out:fade>
  <div
    class="flex flex-col gap-3 p-5 shadow-lg rounded-t-lg border bg-gray-700"
  >
    <p class="font-bold text-4xl text-white">{searchParams.get("Name")}</p>
    <p class="text-2xl text-white">{searchParams.get("Aadhaar")}</p>
    <br />
    <button
      on:click|preventDefault={() => {
        navigate(`/post-data/${ehrId}`);
      }}
      class="bg-green-500 hover:bg-green-700 text-white text-2xl font-bold py-1 px-2   border border-green-700 rounded"
    >
      Post Data
    </button>
  </div>

  {#if temp}
    <div class="flex flex-col gap-3 p-5 shadow-lg rounded-b-lg border">
      {#if temp.rows.length != 0}
        <div>
          <p
            class="px-10 py-2 text-white font-bold border rounded text-center text-3xl my-3 {temp
              .rows[0][1].value == 'YES'
              ? 'bg-blue-500 border-blue-1000'
              : 'bg-green-500 border-green-1000'}"
          >
            {temp.rows[0][1].value == "YES" ? "Admitted" : "Not Admitted"}
          </p>
        </div>
        <h3 class="text-3xl font-bold">Clinical Background</h3>
        <div class="grid grid-cols-2 gap-3 p-5 shadow-lg rounded-lg border">
          <div class="flex flex-col gap-3 p-5 rounded-lg border justify-around">
            <p class="text-center">
              <span class="font-bold">Symptoms</span>
              <span
                class="px-10 py-2 m-5 text-white font-bold border rounded text-center {temp
                  .rows[0][6] != null
                  ? 'bg-red-500'
                  : 'bg-green-500'}"
                >{temp.rows[0][6] != null ? temp.rows[0][6].value : "N/A"}</span
              >
            </p>
            <div class="flex flex-row gap-3 p-5 justify-evenly">
              <p>
                <span class="font-bold">Screening Purpose</span> :
                <span
                  >{temp.rows[0][7] != null
                    ? temp.rows[0][7].value
                    : "N/A"}</span
                >
              </p>
              <p>
                <span class="font-bold">Symptom Detail</span> :
                <span
                  >{temp.rows[0][8] != null
                    ? temp.rows[0][8].items[0].value.value
                    : "N/A"}</span
                >
              </p>
            </div>
          </div>
          <div
            class="flex flex-row gap-3 p-5 rounded-lg border justify-around items-center"
          >
            <p>
              <span class="font-bold">Present Conditions</span> :
              <span
                >{temp.rows[0][9]?.value != null
                  ? temp.rows[0][9].value
                  : "N/A"}</span
              >
            </p>
            <p>
              <span class="font-bold">Specific Condition</span> :
              <span
                >{temp.rows[0][10] != null
                  ? temp.rows[0][10].items[0].value.value
                  : "N/A"}</span
              >
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border">
          <h3 class="text-3xl font-bold">Vital Signs</h3>
          <div class="flex flex-col gap-3 p-5 rounded-lg border">
            <table>
              <tbody>
                {#each temp.columns as key, i}
                  {#if table.has(key.name)}
                    <tr>
                      <td class="font-bold">
                        {key.name.split("_").join(" ")}
                      </td>
                      {#each temp.rows as row}
                        <td
                          class={key.name == "Time"
                            ? "font-bold text-center"
                            : "text-center"}
                        >
                          {handleName(row[i], key.name)}
                        </td>
                      {/each}
                    </tr>
                  {/if}
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border">
          <h3 class="font-bold text-3xl">Recent Travelling</h3>
          <div class="grid grid-cols-2 gap-3 p-5 rounded-lg border">
            <p class="text-center">
              <span class="font-bold">Travelled Recently ? </span> :
              <span
                class="px-10 py-2 m-5 text-white font-bold border rounded text-center {temp
                  .rows[0][11] != 'Yes'
                  ? 'bg-red-500'
                  : 'bg-green-500'}"
              >
                {temp.rows[0][11] != null ? temp.rows[0][11].value : "N/A"}
              </span>
            </p>

            <p class="text-center">
              <span class="font-bold">Where ?</span> :
              <span
                class="px-10 py-2 m-5 text-white font-bold border rounded text-center {temp
                  .rows[0][12] != null
                  ? 'bg-yellow-500'
                  : 'bg-green-500'}"
                >{temp.rows[0][12] != null
                  ? temp.rows[0][12].value
                  : "N/A"}</span
              >
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border">
          <h3 class="font-bold text-3xl">Laboratory Tests</h3>
          {#each temp.rows as test}
            {#if test[13]}
              <div class="p-5 shadow-lg rounded-lg border">
                <p class="flex flex-col text-center font-bold text-3xl mb-5">
                  {test[13].value}
                  <span class="font-normal text-base m-2"
                    >{handleName(test[14], "Time")}</span
                  >
                </p>
                <p />
                <div class="grid grid-cols-2 justify-evenly">
                  <p class="text-center text-xl">
                    <span
                      class="px-10 py-2 m-5 text-white font-bold border rounded text-center {test[14]
                        ?.value == 'Present'
                        ? 'bg-red-500'
                        : 'bg-green-500'}"
                    >
                      {test[14]?.value}
                    </span>
                  </p>
                  <p class="text-center">
                    {handleName(test[14], "Time")}
                  </p>
                </div>
              </div>
            {/if}
          {/each}
        </div>
      {:else}
        <p
          class="font-bold text-3xl text-center rounded-lg border shadow-lg p-5"
        >
          No Data Posted for this Patient
        </p>
      {/if}
    </div>
  {/if}
</div>
