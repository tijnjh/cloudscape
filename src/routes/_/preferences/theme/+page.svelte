<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import {
    isBlackAccent,
    selectedAccentColor,
    selectedBaseColor,
  } from "$lib/global.svelte";
  import { baseColors, accentColors, type ValidColor } from "$lib/theme";
  import { setMode, userPrefersMode } from "mode-watcher";

  const themeModes = ["light", "dark", "system"] as const;
</script>

{#snippet colorSelector(
  color: ValidColor,
  {
    isSelected,
    onclick,
  }: {
    isSelected: boolean;
    onclick: VoidFunction;
  },
)}
  <div class="flex flex-wrap gap-2">
    <Button
      style="--color: var(--color-{color}-500, var(--color-{color}));"
      {onclick}
      variant={isSelected ? "primary" : "secondary"}
    >
      <div
        class="size-3 rounded-full bg-(--color) outline-2 outline-base-300-700"
      ></div>
      {color}
    </Button>
  </div>
{/snippet}

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

<span>Accent Colors</span>

<div class="flex flex-wrap gap-2">
  {@render colorSelector("black", {
    isSelected: isBlackAccent.current === true,
    onclick: () => {
      isBlackAccent.current = !isBlackAccent.current;
    },
  })}

  {#each accentColors as accentColor (accentColor)}
    {@render colorSelector(accentColor, {
      isSelected:
        selectedAccentColor.current === accentColor && !isBlackAccent.current,
      onclick: () => {
        isBlackAccent.current = false;
        selectedAccentColor.current = accentColor;
      },
    })}
  {/each}
</div>

<span>Base Colors</span>

<div class="flex flex-wrap gap-2">
  {#each baseColors as baseColor (baseColor)}
    {@render colorSelector(baseColor, {
      isSelected: selectedBaseColor.current === baseColor,
      onclick: () => {
        selectedBaseColor.current = baseColor;
      },
    })}
  {/each}
</div>
