<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  let temp: { rows: { name: string }[]; columns: Record<string, string>[] } =
    null;

  import { allCompositions } from "../aql";
  import { each } from "svelte/internal";
  let ehrId = window.location.pathname.split("/")[2];

  let table = new Set([
    "Time",
    "Temperature",
    "Pulse_Presence",
    "Pulse_Rate",
    "SpO2",
  ]);

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
      case "SpO2":
        return row.numerator + "%";

      case "Temperature":
      case "Pulse_Rate":
        return row.magnitude + " " + row.units;
    }
    return row.value;
  };
</script>

{#if temp}
  <div class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border">
    <div>
      <p
        class="px-10 py-2 text-white font-bold border rounded text-center {temp
          .rows[0][1].value == 'YES'
          ? 'bg-blue-500 border-blue-1000'
          : 'bg-green-500 border-green-1000'}"
      >
        {temp.rows[0][1].value == "YES" ? "Admitted" : "Not Admitted"}
      </p>
    </div>

    <div class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border">
      <h3 class="text-3xl font-bold">Clinical Background</h3>
      <div class="flex flex-col gap-3 p-5 rounded-lg border justify-around">
        <p class="text-center">
          <span class="font-bold">Symptoms</span>
          <span
            class="px-10 py-2 m-5 text-white font-bold border rounded text-center {temp
              .rows[0][6].value == 'Present'
              ? 'bg-red-500'
              : 'bg-green-500'}">{temp.rows[0][6].value}</span
          >
        </p>
        <div class="flex flex-row gap-3 p-5 justify-evenly">
          <p>
            <span class="font-bold">Screening Purpose</span> :
            <span>{temp.rows[0][7].value}</span>
          </p>
          <p>
            <span class="font-bold">Symptom Detail</span> :
            <span>{temp.rows[0][8].items[0].value.value}</span>
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-3 p-5 rounded-lg border justify-around">
        <p>
          <span class="font-bold">Present Conditions</span> :
          <span>{temp.rows[0][9]}</span>
        </p>
        <p>
          <span class="font-bold">Specific Condition</span> :
          <span>{temp.rows[0][10].items[0].value.value}</span>
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
                  <td>
                    {key.name.split("_").join(" ")}
                  </td>
                  {#each temp.rows as row}
                    <td>
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
      <div class="flex flex-col gap-3 p-5 rounded-lg border">
        <p>
          <span class="font-bold">Travel Detail</span> :
          <span>{temp.rows[0][9]}</span>
        </p>
      </div>
    </div>
  </div>
{/if}
