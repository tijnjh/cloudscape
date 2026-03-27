<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import NowPlayingBar from "$lib/components/NowPlayingBar.svelte";
  import NowPlayingView from "$lib/components/NowPlayingView.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { global } from "$lib/global.svelte";
  import "../app.css";
  import { ChevronLeft } from "@lucide/svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { watch } from "runed";
  import { onMount } from "svelte";

  const { children } = $props();

  const queryClient = new QueryClient();

  function setThemeVariables() {
    console.log("func was calle dbrah", global.theme.darkMuted);
    for (const [key, value] of Object.entries(global.theme)) {
      document.documentElement.style.setProperty(
        `--theme-color-${key}`,
        value ?? "",
      );
    }
  }

  function resetThemeVariables() {
    for (const key of Object.keys(global.theme)) {
      document.documentElement.style.setProperty(`--theme-color-${key}`, "");
    }
  }

  watch(
    () => global.theme,
    (theme) => {
      console.log("theme changed", theme);
      setThemeVariables();
    },
  );

  onMount(() => {
    resetThemeVariables();
  });

  watch(
    () => page.route.id,
    () => {
      resetThemeVariables();
    },
  );

  onNavigate(() => {
    resetThemeVariables();
  });
</script>

<QueryClientProvider client={queryClient}>
  {#if page.route.id !== "/"}
    <div
      class="from-mist-muted-200-800 to-mist-300-700/0 fixed inset-x-0 top-0 z-40 mx-auto flex max-w-5xl justify-between bg-linear-to-b p-4 transition-colors duration-700"
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
