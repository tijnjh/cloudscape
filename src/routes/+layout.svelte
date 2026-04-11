<script lang="ts">
  import { page } from "$app/state";
  import favicon from "$lib/assets/favicon.svg";
  import NowPlayingBar from "$lib/components/NowPlayingBar.svelte";
  import NowPlayingView from "$lib/components/NowPlayingView.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import "./layout.css";
  import { ChevronLeft } from "@lucide/svelte";

  const { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if page.route.id !== "/"}
  <div
    class="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-5xl justify-between bg-linear-to-b from-mist-200-800 to-mist-300-700/0 p-4"
  >
    <Button
      variant="secondary"
      icon={ChevronLeft}
      onclick={() => history.back()}>Back</Button
    >

    <Button variant="secondary" href="/">Home</Button>
  </div>
{/if}

<NowPlayingView />
<NowPlayingBar />

{@render children()}
