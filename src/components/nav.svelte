<script>
  import { Router, Link, Route } from "svelte-navigator";
  import { useNavigate } from "svelte-navigator";
  const navigo = useNavigate();

  const handleBack = () => {
    navigo(-1);
  };
</script>

<header>
  <ul class="flex p-5">
    <li class="mr-2">
      <Link to="/">
        <sl-button type="primary" size="medium"
          ><sl-icon name="house-door-fill" slot="prefix" /> Home
        </sl-button>
      </Link>
      <sl-button type="primary" size="medium" on:click={handleBack}
        ><sl-icon name="arrow-left-square-fill" slot="prefix" /> Back
      </sl-button>
    </li>
  </ul>
</header>
