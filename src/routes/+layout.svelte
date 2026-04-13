<script lang="ts">
  import { page } from "$app/state";
  import favicon from "$lib/assets/favicon.svg";
  import NowPlayingBar from "$lib/components/NowPlayingBar.svelte";
  import NowPlayingView from "$lib/components/NowPlayingView.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import "./layout.css";
  import { ChevronLeft } from "@lucide/svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

  const { children } = $props();

  const queryClient = new QueryClient();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<QueryClientProvider client={queryClient}>
  {#if page.route.id !== "/"}
    <div
      class="fixed inset-x-0 top-0 z-20 mx-auto flex max-w-5xl justify-between bg-linear-to-b from-mist-200-800 to-mist-300-700/0 p-4"
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
</QueryClientProvider>
