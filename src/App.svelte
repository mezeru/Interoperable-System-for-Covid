<script lang="ts">
  import "@shoelace-style/shoelace/dist/shoelace";
  import "medblocks-ui/dist/medblocks";
  import "./style.css";
  import New from "./components/newPatient.svelte";
  import Home from "./components/Home.svelte";
  import Delete from "./components/deleteEHR.svelte";
  import Add from "./components/alreadyPost.svelte";
  import Get from "./components/GetData.svelte";
  import { Router, Link, Route } from "svelte-navigator";
  import CompoForm from "./components/Startform.svelte";
  import Patient from "./components/getPatient.svelte";
  let baseURL = "http://localhost:3000/";
</script>

<Router>
  <header>
    <ul class="flex p-5">
      <li class="mr-2">
        <Link to="/">
          <button
            class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Home
          </button>
        </Link>
      </li>
    </ul>
  </header>

  <main class="p-2 md:p-12 flex flex-col gap-5">
    <Route path="/new">
      <New {baseURL} />
    </Route>

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
