<script>
  import { mongo, openehr } from "../service";
  import { useNavigate } from "svelte-navigator";
  let ehrId;

  const navigo = useNavigate();

  const handleSubmitDemo = async (e) => {
    const target = new FormData(e.target);
    let patient = {};

    for (const [i, j] of target.entries()) {
      patient[i] = j;
    }

    try {
      const respEHR = await openehr.post(
        "/ehr",
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
                value: patient["AdhaarNo"],
                scheme: patient["Name"],
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

      if (respEHR.status === 204) {
        patient["ehrId"] = respEHR.headers["etag"].replace(/['"]+/g, "");
        ehrId = patient["ehrId"];
        console.log(ehrId);

        try {
          const resp = await mongo.post(`new`, patient);

          if (resp.status == 200) {
            navigo(`/patient/${patient.AdhaarNo}/${ehrId}`);
          }
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
      if (String(e).includes("400")) {
        alert("Patient Already Exists");
      } else {
        alert("Server is Down");
      }
    }
  };
</script>

<form
  class="flex-col gap-3 p-5 shadow-lg rounded-lg border"
  on:submit|preventDefault={handleSubmitDemo}
>
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-first-name"
      >
        Patients Name
      </label>
      <input
        required
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-blue-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        id="grid-first-name"
        name="Name"
        type="text"
        placeholder="Jane Doe"
      />
    </div>
  </div>
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full px-3">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="Aadhaar"
      >
        Aadhaar Card Number
      </label>
      <input
        required
        placeholder="XXXX XXXX XXXX"
        type="number"
        id="AdhaarNo"
        name="AdhaarNo"
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      />
    </div>
  </div>

  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full px-3">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="phno"
      >
        Phone Number
      </label>
      <input
        required
        placeholder="0123456789"
        type="number"
        id="phno"
        name="PhoneNo"
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      />
    </div>
  </div>

  <div class="flex flex-wrap -mx-3 mb-2">
    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-Address"
      >
        Address
      </label>
      <input
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="grid-Address"
        type="text"
        name="PlaceofLiving"
        placeholder="Delhi"
      />
    </div>
    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-Gender"
      >
        Gender
      </label>
      <div class="relative">
        <select
          class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-gender"
          name="Gender"
        >
          <option>Male</option>
          <option>Female</option>
          <option>Not Say</option>
        </select>
      </div>
    </div>
  </div>
  <button
    class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-5"
    type="submit"
  >
    Submit
  </button>
</form>
