<script>
  import { Router, Link, Route } from "svelte-navigator";
</script>

<div class="flex justify-center">
  <div class="grid grid-cols-4 gap-10">
    <Link to="/new" class="flex-auto flex justify-center">
      <sl-button type="primary" size="large"
        ><sl-icon name="plus-lg" slot="prefix" /> New Patient
      </sl-button>
    </Link>

    <Link to="/get" class="flex-auto flex justify-center">
      <sl-button type="success" size="large"
        ><sl-icon name="list-check" slot="prefix" /> List of Patients
      </sl-button>
    </Link>

    <Link to="/delete" class="flex-auto flex justify-center">
      <sl-button type="danger" size="large"
        ><sl-icon name="trash" slot="prefix" /> Delete Patient Data
      </sl-button>
    </Link>

    <Link to="/add-compositions" class="flex-auto flex justify-center">
      <sl-button type="primary" size="large"
        ><sl-icon name="plus-lg" slot="prefix" /> Add Data of a Patient
      </sl-button>
    </Link>
  </div>
</div>
