<script lang="ts">
  import { Vitals, compositionsList, Lab } from "../aql";
  import { each, text } from "svelte/internal";
  import { useNavigate, Link } from "svelte-navigator";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import LineChart from "./LineChart.svelte";
  import { mongo, openehr } from "../service";

  let temp: { rows: { name: string }[]; columns: Record<string, string>[] } =
    null;
  let listComp = [];
  let listLabs = [];
  const navigate = useNavigate();
  export let ehrId;
  export let id;
  let fullName = "";
  let time = [];

  let table = new Set([
    "Time",
    "Temperature",
    "Pulse_Presence",
    "Pulse_Rate",
    "SpO2",
  ]);

  const makeSp = (temp) => {
    return temp.rows?.map((x) => x[5]?.numerator);
  };

  const makeTem = (temp) => {
    return temp.rows.map((x) => x[2]?.magnitude);
  };

  const makePr = (temp) => {
    return temp.rows?.map((x) => x[4]?.magnitude);
  };

  const labelsMap = {
    Temperature: 2,
  };

  const handleLabels = (name, row) => {
    let pos = labelsMap[name];
    let labels = [];
    row.forEach((col) => {
      if (col[pos] != null) {
        labels.push(col[0]);
      }
    });
    return labels;
  };

  onMount(async () => {
    const r = mongo.get(`/`);
    let list;
    temp = await Vitals(ehrId);
    time = temp.rows?.map((x) => x[0].value);
    list = await compositionsList(ehrId);
    listComp = list.rows;
    list = await Lab(ehrId);
    listLabs = list.rows;

    const res = await mongo.get(`search?AdhaarNo=${id}`);
    fullName = res.data.Name;

    try {
      await openehr.get(`/ehr/${ehrId}`, {
        headers: {
          Accept: "application/json",
        },
      });
      console.log("EHR exists");
    } catch (e) {
      if (e.response.status === 404) {
        console.log("EHR Does not exist, creating");
        const r = await openehr.put(
          `/ehr/${ehrId}`,
          {
            _type: "EHR_STATUS",
            archetype_node_id: "openEHR-EHR-EHR_STATUS.generic.v1",
            name: {
              value: "ehr status",
            },
            subject: {
              external_ref: {
                id: {
                  _type: "GENERIC_ID",
                  value: ehrId,
                  scheme: ehrId,
                },
                namespace: "EHR",
                type: "PERSON",
              },
            },
            is_modifiable: "true",
            is_queryable: "true",
          },
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        console.log("Created EHR");
      }
    }
  });

  const handleName = (row, key) => {
    if (!row) {
      return "-";
    }

    switch (key) {
      case "Time":
        let time;
        if (row.value) {
          time = new Date(row.value);
        } else {
          time = new Date(row);
        }

        return (
          time.getDay().toString() +
          "/" +
          time.getMonth().toString() +
          "/" +
          time.getFullYear().toString() +
          "<br/>" +
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

<div in:fly={{ y: 200, duration: 500 }} class="bg-white rounded-lg shadow-lg">
  <div
    class="flex flex-row gap-3 p-5 shadow-lg rounded-t-lg border bg-gray-700 justify-between"
  >
    <div>
      <p class="text-2xl text-white">{id}</p>
      <p class="font-bold text-4xl text-white">{fullName}</p>
    </div>
    <div class="flex justify-center items-center">
      <sl-button
        type="primary"
        on:click|preventDefault={() => {
          navigate(`/postdata/${ehrId}/None`);
        }}
        outline
      >
        <sl-icon name="plus-square-fill" slot="prefix" />Add Data
      </sl-button>
    </div>
  </div>

  <div class="flex flex-col gap-3 p-5 shadow-lg rounded-b-lg border">
    {#if temp?.rows.length >= 1}
      <div>
        <p
          class="px-10 py-2 text-white font-bold border rounded text-center text-3xl my-3 {temp
            .rows[0][1]?.value == 'YES'
            ? 'bg-yellow-500 border-yellow-1000'
            : 'bg-green-500 border-green-1000'}"
        >
          {temp.rows[0][1]?.value == "YES" ? "Admitted" : "Not Admitted"}
        </p>
      </div>
      <sl-tab-group>
        <sl-tab slot="nav" panel="vital">Vital Signs</sl-tab>
        <sl-tab slot="nav" panel="clinical">Clinical Data</sl-tab>
        <sl-tab slot="nav" panel="travel">Travel History</sl-tab>
        <sl-tab slot="nav" panel="lab">Laboratory Tests</sl-tab>
        <sl-tab slot="nav" panel="Compositions">Compositions Posted</sl-tab>

        <sl-tab-panel name="clinical">
          <h3 class="text-3xl font-bold">Clinical Background</h3>
          <div class="grid grid-cols-2 gap-3 p-5">
            <div
              class="flex flex-col gap-3 p-5 rounded-lg border justify-around"
            >
              <p class="text-center">
                <span class="font-bold">Symptoms</span>
                <span
                  class="px-10 py-2 m-5 text-white font-bold border rounded text-center {temp
                    .rows[0][6] != null
                    ? 'bg-red-500'
                    : 'bg-green-500'}"
                  >{temp.rows[0][6] != null
                    ? temp.rows[0][6].value
                    : "N/A"}</span
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
        </sl-tab-panel>

        <sl-tab-panel name="vital">
          <div class="flex flex-col gap-3 p-5">
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
                              ? "font-bold text-center pb-5"
                              : "text-center"}
                          >
                            {@html handleName(row[i], key.name)}
                          </td>
                        {/each}
                      </tr>
                    {/if}
                  {/each}
                </tbody>
              </table>
            </div>
            <h3 class="text-4xl font-bold mt-5">Patient Monitoring</h3>
            <div
              class="flex flex-row justify-evenly gap-5 border shadow-lg p-5 rounded-lg items-center"
            >
              <div class="w-1/3">
                <p class="my-2 text-2xl text-center font-semibold">
                  Body Temperature
                </p>
                <div>
                  <LineChart
                    label="Temperature"
                    labels={time}
                    data={makeTem(temp)}
                    min="30"
                    max="45"
                    color="rgb(255, 0, 102)"
                  />
                </div>
              </div>
              <div class="w-1/3">
                <p class="my-2 text-2xl text-center font-semibold">SpO2</p>
                <div class="flex">
                  <LineChart
                    label="SpO2"
                    labels={time}
                    data={makeSp(temp)}
                    min="0"
                    max="100"
                    color="rgb(204, 102, 255)"
                  />
                </div>
              </div>
              <div class="w-1/3">
                <p class="my-2 text-2xl text-center font-semibold">
                  Pulse Rate
                </p>
                <div class="flex">
                  <LineChart
                    label="Pulse Rate"
                    labels={time}
                    data={makePr(temp)}
                    min="50"
                    max="180"
                    color="rgb(51, 204, 51)"
                  />
                </div>
              </div>
            </div>
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="travel">
          <div class="flex flex-col gap-3 p-5">
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
        </sl-tab-panel>

        <sl-tab-panel name="lab">
          <div class="flex flex-col gap-3 p-5">
            {#if listLabs[0]?.[1]}
              <h3 class="font-bold text-4xl mb-5 text-center">
                Laboratory Tests
              </h3>
              {#each listLabs as test}
                {#if test[1]}
                  <div
                    class="p-5 rounded-lg grid grid-rows-2 shadow-inner bg-gray-800"
                  >
                    <div class="grid grid-cols-2 justify-evenly">
                      <p
                        class="flex flex-col text-center font-bold text-3xl mb-5 text-white"
                      >
                        {test[1].value}
                        <span class="font-normal text-base m-2 text-white"
                          >{@html handleName(test[2], "Time")}</span
                        >
                      </p>
                      <div class="flex items-center justify-center">
                        <p
                          class="{test[3]?.value == 'Positive'
                            ? 'bg-red-500'
                            : test[3]?.value == 'Negative'
                            ? 'bg-green-500'
                            : 'bg-yellow-500'} px-5 py-3 text-3xl rounded-lg text-white"
                        >
                          {test[3]?.value}
                        </p>
                      </div>
                    </div>
                    <div class="flex justify-evenly">
                      <p
                        class="appearance-none w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 text-lg"
                      >
                        {test[4] != null ? test[4].value : "No Comments"}
                      </p>
                    </div>
                  </div>
                  <br />
                {/if}
              {/each}
            {:else}
              <p class="font-bold text-3xl text-center p-5">
                No Laboratory Tests for this Patient
              </p>
            {/if}
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="Compositions">
          <div class="flex flex-col gap-3 p-5">
            {#each listComp as comp}
              {#if comp[1]}
                <div
                  class="grid grid-cols-2 p-5 rounded-lg shadow-inner bg-gray-800 text-gray-200 items-center"
                >
                  <div class="text-center">
                    {@html handleName(comp[0], "Time")}
                  </div>
                  <Link
                    class="text-center hover:text-white text-xl"
                    to={`/postdata/${ehrId}/${comp[1].substring(0, 36)}`}
                  >
                    Edit Composition
                  </Link>
                </div>
                <br />
              {/if}
            {/each}
          </div>
        </sl-tab-panel>
      </sl-tab-group>
    {:else}
      <p
        class="text-6xl subpixel-antialiased text-center p-5 text-red-500 font-bold"
      >
        No Data
      </p>
    {/if}
  </div>
</div>
