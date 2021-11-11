<script>
  import { Router, Link, Route } from "svelte-navigator";
</script>

<div class="flex flex-col justify-center items-center">
  <div class="grid grid-cols-3 gap-10 m-5">
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
  </div>
  <div class="grid grid-cols-1 gap-5 m-5">
    <Link to="/Templates" class="flex-auto flex justify-center">
      <sl-button type="neutral" size="large"
        ><sl-icon name="layers-fill" slot="prefix" /> List or Add openEHR Templates
      </sl-button>
    </Link>
  </div>
</div>
