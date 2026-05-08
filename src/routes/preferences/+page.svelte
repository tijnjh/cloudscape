<script lang="ts">
  import { resolve } from "$app/paths";
  import Main from "$lib/components/Main.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import {
    selectedAccentColor,
    selectedBaseColor,
    selectedInstance,
  } from "$lib/global.svelte";
  import {
    baseColors,
    accentColors,
    type BaseColor,
    type AccentColor,
  } from "$lib/theme";
  import { setMode, userPrefersMode } from "mode-watcher";
  import type { PersistedState } from "runed";

  const selectedInstanceHostname = $derived.by(() => {
    if (!selectedInstance.current) return;
    return new URL(selectedInstance.current).hostname;
  });

  const themeModes = ["light", "dark", "system"] as const;
</script>

{#snippet colorSelector<C extends BaseColor | AccentColor>(
  colors: C[],
  selectedColorState: PersistedState<C>,
)}
  <div class="flex flex-wrap gap-2">
    {#each colors as color (color)}
      {@const isSelected = selectedColorState.current === color}

      <Button
        style="--color: var(--color-{color}-500, var(--color-{color}));"
        onclick={() => {
          selectedColorState.current = color;
        }}
        variant={isSelected ? "primary" : "secondary"}
      >
        <div
          class="size-3 rounded-full bg-(--color) outline-2 outline-base-300-700"
        ></div>
        {color}
      </Button>
    {/each}
  </div>
{/snippet}

<Main>
  {#snippet left()}
    <h3 class="text-xl font-medium">Server instance</h3>
    current: {selectedInstanceHostname}

    <Button href={resolve("/select-instance")}>Select instance</Button>

    <hr class="h-px border-0 bg-base-400-600" />

    <h3 class="text-xl font-medium">Theme</h3>

    <span>Mode</span>

    <div class="flex flex-wrap gap-2">
      {#each themeModes as themeMode (themeMode)}
        {@const isSelected = userPrefersMode.current === themeMode}
        <Button
          variant={isSelected ? "primary" : "secondary"}
          onclick={() => setMode(themeMode)}
          class="capitalize"
        >
          {themeMode}
        </Button>
      {/each}
    </div>

    <span>Base Colors</span>

    <div class="flex flex-wrap gap-2">
      {@render colorSelector(baseColors, selectedBaseColor)}
    </div>

    <span>Accent Colors</span>

    <div class="flex flex-wrap gap-2">
      {@render colorSelector(accentColors, selectedAccentColor)}
    </div>
  {/snippet}
  {#snippet right()}{/snippet}
</Main>
