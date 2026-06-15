<script lang="ts">
  import { browser } from "$app/environment";
  import { navigating, page } from "$app/state";
  import favicon from "$lib/assets/favicon.svg";
  import NowPlayingBar from "$lib/components/NowPlayingBar.svelte";
  import NowPlayingView from "$lib/components/NowPlayingView.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import {
    isBlackAccent,
    selectedAccentColor,
    selectedBaseColor,
  } from "$lib/global.svelte";
  import { shades } from "$lib/theme";
  import "./layout.css";
  import { ChevronLeft, LoaderCircleIcon } from "@lucide/svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { ModeWatcher } from "mode-watcher";

  const { children } = $props();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const doc = browser ? document.documentElement : undefined;

  function setProperty(name: string, value: string) {
    doc?.style.setProperty(name, value);
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

  $effect(() => {
    if (isBlackAccent.current) {
      doc?.classList.add("black-accent");
    } else {
      doc?.classList.remove("black-accent");
    }
  });

  let showNavigationSpinner = $state(false);

  $effect(() => {
    if (!navigating.type) {
      showNavigationSpinner = false;
      return;
    }

    const timeout = setTimeout(() => {
      showNavigationSpinner = true;
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  });

  navigating.type;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher defaultMode="system" />

<QueryClientProvider client={queryClient}>
  <div
    aria-hidden="true"
    class="pointer-events-none fixed top-0 left-0 z-99999999 h-80 w-full select-none"
  >
    <div
      class={[
        "absolute top-0 w-full h-80 rounded-[100%] bg-amber-500/30 blur-3xl transition-all duration-500  dark:bg-sky-400/25",
        showNavigationSpinner
          ? "-translate-y-1/2 opacity-100"
          : "-translate-y-full opacity-0",
      ]}
    ></div>
    <div
      class={[
        "absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-white/75 p-2 shadow-lg backdrop-blur-lg transition-all duration-300 dark:bg-slate-900/40",
        showNavigationSpinner
          ? "translate-y-0 opacity-100"
          : "-translate-y-6 opacity-0",
      ]}
    >
      <LoaderCircleIcon
        class={[
          "animate-spin text-gray-900 dark:text-white text-2xl",
          "text-4xl",
        ]}
        aria-label="Loading"
      />
    </div>
  </div>

  {#if page.route.id !== "/"}
    <div
      class="fixed inset-x-0 top-0 z-20 mx-auto flex max-w-5xl justify-between bg-linear-to-b from-base-200-800 to-base-300-700/0 p-4"
    >
      <Button
        variant="secondary"
        icon={ChevronLeft}
        onclick={() => history.back()}
      >
        Back
      </Button>

      <Button variant="secondary" href="/">Home</Button>
    </div>
  {/if}

  <NowPlayingView />
  <NowPlayingBar />

  {@render children()}
</QueryClientProvider>
