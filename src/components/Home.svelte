<script>
  import { Router, Link, Route } from "svelte-navigator";
</script>

<div class="grid grid-cols-1 gap-10">
  <Link to="/new" class="flex-auto flex justify-center">
    <button
      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow "
    >
      New Patient
    </button>
  </Link>

  <Link to="/get" class="flex-auto flex justify-center">
    <button
      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow "
    >
      Get Registered Patients
    </button>
  </Link>

  <Link to="/delete" class="flex-auto flex justify-center">
    <button
      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow "
    >
      Delete Patient Data
    </button>
  </Link>

  <Link to="/add-compositions" class="flex-auto flex justify-center">
    <button
      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow "
    >
      Post Data of Registered Patients
    </button>
  </Link>
</div>
