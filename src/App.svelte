<script lang="ts">
  import "@shoelace-style/shoelace/dist/shoelace";
  import "medblocks-ui/dist/medblocks";
  import "./style.css";
  import New from "./components/newPatient.svelte";
  import Home from "./components/Home.svelte";
  import Delete from "./components/deleteEHR.svelte";
  import { Router, Link, Route } from "svelte-navigator";
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
      <New />
    </Route>

    <Route path="/get" />

    <Route path="/delete">
      <Delete />
    </Route>

    <Route path="/">
      <Home />
    </Route>
  </main>
</Router>
