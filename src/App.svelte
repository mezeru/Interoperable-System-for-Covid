<script lang="ts">
  import "medblocks-ui/dist/medblocks";
  import "medblocks-ui/dist/shoelace";
  import "./style.css";
  import New from "./components/newPatient.svelte";
  import Home from "./components/Home.svelte";
  import Delete from "./components/deleteEHR.svelte";
  import Get from "./components/GetData.svelte";
  import { Router, Route } from "svelte-navigator";
  import CompoForm from "./components/Startform.svelte";
  import Patient from "./components/getPatient.svelte";
  import NavBar from "./components/nav.svelte";
</script>

<Router>
  <NavBar />

  <main class="p-2 md:p-12 flex flex-col gap-5 h-full">
    <Route path="/new" component={New} />

    <Route path="/get" component={Get} />

    <Route path="/delete" component={Delete} />

    <Route path="/patient/:id/:ehrId" component={Patient} />

    <Route path="/post-data/:ehrId" component={CompoForm} />

    <Route>
      <Home />
    </Route>
  </main>
</Router>
