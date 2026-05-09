<script lang="ts">
  import { page } from "$app/state";
  import favicon from "$lib/assets/favicon.svg";
  import NowPlayingBar from "$lib/components/NowPlayingBar.svelte";
  import NowPlayingView from "$lib/components/NowPlayingView.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { selectedAccentColor, selectedBaseColor } from "$lib/global.svelte";
  import { shades } from "$lib/theme";
  import "./layout.css";
  import { ChevronLeft } from "@lucide/svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { ModeWatcher } from "mode-watcher";

  const { children } = $props();

  const queryClient = new QueryClient();

  function setProperty(name: string, value: string) {
    document.documentElement.style.setProperty(name, value);
  }

  $effect(() => {
    for (const shade of shades) {
      setProperty(
        `--t-base-${shade}`,
        `var(--color-${selectedBaseColor.current}-${shade})`,
      );
      setProperty(
        `--t-accent-${shade}`,
        `var(--color-${selectedAccentColor.current}-${shade})`,
      );
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher defaultMode="system" />

<QueryClientProvider client={queryClient}>
  {#if page.route.id !== "/"}
    <div
      class="fixed inset-x-0 top-0 z-20 mx-auto flex max-w-5xl justify-between bg-linear-to-b from-base-200-800 to-base-300-700/0 p-4"
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
