<script lang="ts">
  import { Vitals, compositionsList, Lab, Clinical, Travel } from "../aql";
  import { useNavigate, Link } from "svelte-navigator";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import LineChart from "./LineChart.svelte";
  import { mongo, openehr } from "../service";

  let temp: { rows: { name: string }[]; columns: Record<string, string>[] } =
    null;
  let listComp = [];
  let listLabs = [];
  let clinical = [];
  let travel = [];
  const navigate = useNavigate();
  export let ehrId;
  export let id;
  export let name;
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

  // const labelsMap = {
  //   Temperature: 2,
  // };

  // const handleLabels = (name, row) => {
  //   let pos = labelsMap[name];
  //   let labels = [];
  //   row.forEach((col) => {
  //     if (col[pos] != null) {
  //       labels.push(col[0]);
  //     }
  //   });
  //   return labels;
  // };

  onMount(async () => {
    let list;
    temp = await Vitals(ehrId);
    time = temp.rows?.map((x) => x[0].value);

    list = await compositionsList(ehrId);
    listComp = list.rows;

    list = await Lab(ehrId);
    listLabs = list.rows;

    list = await Clinical(ehrId);
    clinical = list.rows;

    list = await Travel(ehrId);
    travel = list.rows;

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
        return `<sl-format-date
                  day="numeric"
                  month="long"
                  hour="numeric"
                  minute="numeric"
                  hour-format="12"
                  date=${row.value}
                />`;

      case "SpO2":
        return row.numerator + " %";

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
    <div class="grid grid-cols-1 justify-center items-center">
      <p class="text-2xl text-white">{id}</p>
      <p class="font-bold text-4xl text-white">{name}</p>
    </div>
    <div class="flex justify-center items-center">
      <p
        in:fade={{ duration: 2500 }}
        class="px-10 py-2 text-white font-bold rounded text-center uppercase text-3xl {temp
          ?.rows[0]?.[1]?.value == 'YES'
          ? 'bg-yellow-500'
          : 'bg-green-500'}"
      >
        {temp?.rows[0]?.[1]?.value == "YES" ? "Admitted" : "Not Admitted"}
      </p>
    </div>
    <div class="grid grid-cols-1 gap-5 justify-center items-center">
      <sl-button
        type="primary"
        on:click|preventDefault={() => {
          navigate(`/postdata/${ehrId}/None`);
        }}
      >
        <sl-icon name="plus-square-fill" slot="prefix" />Add Data
      </sl-button>
      <sl-button
        type="success"
        on:click|preventDefault={() => {
          navigate(`/assessment/${id}/${ehrId}/${name}`);
        }}
      >
        <sl-icon name="archive-fill" slot="prefix" />Assessment
      </sl-button>
    </div>
  </div>

  <div
    class="flex flex-col gap-3 p-5 shadow-lg rounded-b-lg border"
    in:fly={{
      duration: 2500,
    }}
  >
    {#if temp?.rows.length >= 1}
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
                  class="px-10 py-2 m-5 text-white font-bold border rounded text-center {clinical[0] !=
                  null
                    ? 'bg-red-500'
                    : 'bg-green-500'}"
                  >{clinical[0] ? clinical[0][1]?.value : "N/A"}</span
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
            <h3 class="font-bold text-3xl">Travel History</h3>
            <div class="flex flex-col p-5">
              {#each travel as comp}
                {#if comp[1]}
                  <div
                    class="grid grid-cols-2 gap-3 p-5 rounded-lg border shadow-lg"
                  >
                    <p class="text-center">
                      <span class="font-bold">Travelled Recently ? </span> :
                      <span
                        class="px-10 py-2 m-5 text-white font-bold border rounded text-center bg-red-500"
                      >
                        {comp[1].value}
                      </span>
                    </p>

                    <p class="text-center">
                      <span class="font-bold">Where ?</span> :
                      <span
                        class="px-10 py-2 m-5 text-white font-bold border rounded text-center {clinical !=
                        null
                          ? 'bg-yellow-500'
                          : 'bg-green-500'}">{comp[2].value}</span
                      >
                    </p>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="lab">
          <div class="flex flex-col gap-3 p-5">
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
                      {test[4]?.value}
                    </p>
                  </div>
                </div>
                <br />
              {/if}
            {/each}
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="Compositions">
          <div class="flex flex-col gap-3 p-5">
            {#each listComp as comp}
              {#if comp[1]}
                <div
                  class="grid grid-cols-2 p-5 rounded-lg shadow-inner bg-gray-900 text-gray-200 items-center"
                >
                  <div class="text-center text-lg font-semibold">
                    <sl-format-date
                      month="long"
                      day="numeric"
                      hour="numeric"
                      minute="numeric"
                      hour-format="12"
                      date={comp[0]}
                    />
                  </div>
                  <div class="flex flex-row items-center justify-center">
                    <Link
                      class="text-center text-lg bg-gray-200 text-gray-900 px-4 py-2 rounded hover:bg-gray-500 hover:text-white font-semibold"
                      to={`/postdata/${ehrId}/${comp[1].substring(0, 36)}`}
                    >
                      Edit Composition
                    </Link>
                  </div>
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
