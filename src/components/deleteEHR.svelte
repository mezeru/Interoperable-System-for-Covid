<script>
  import axios from "axios";

  const handleSubmit = async (e) => {
    const target = new FormData(e.target);
    let submit = {};

    for (const [i, j] of target.entries()) {
      submit[i] = j;
    }

    // try{
    //     const resp = await axios.delete()

    // }
  };
</script>

<div>
  <h1 class="font-sans text-6xl font-bold mb-10">
    Delete an Electronic Health Record
  </h1>

  <form
    class="shadow-lg rounded-lg border flex flex-col p-5 items-center"
    on:submit|preventDefault={handleSubmit}
  >
    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="ahrno"
      >
        Adhaar ID of the Patient
      </label>
      <input
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        placeholder="XXXX XXXX XXXX"
        name="ahrno"
      />
    </div>
  </form>
</div>
