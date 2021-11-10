<script lang="ts">
  import "medblocks-ui/dist/medblocks";
  import "medblocks-ui/dist/shoelace";
  import "./style.css";
  import New from "./components/newPatient.svelte";
  import Home from "./components/Home.svelte";
  import Delete from "./components/deleteEHR.svelte";
  import Add from "./components/alreadyPost.svelte";
  import Get from "./components/GetData.svelte";
  import { Router, Link, Route } from "svelte-navigator";
  import CompoForm from "./components/Startform.svelte";
  import Patient from "./components/getPatient.svelte";
  import NavBar from "./components/nav.svelte";
  let baseURL = "http://localhost:3000/";
</script>

<Router>
  <NavBar />

  <main class="p-2 md:p-12 flex flex-col gap-5 h-full">
    <Route path="/new" component={New} />

    <Route path="/get">
      <Get {baseURL} />
    </Route>

    <Route path="/delete">
      <Delete />
    </Route>

    <Route path="/add-compositions">
      <Add {baseURL} />
    </Route>

    <Route path="/patient/:ehrId">
      <Patient />
    </Route>

    <Route path="/post-data/:ehrId">
      <CompoForm ehrId={null} />
    </Route>

    <Route>
      <Home />
    </Route>
  </main>
</Router>
