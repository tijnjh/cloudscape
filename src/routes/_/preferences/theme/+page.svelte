<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import { isBlackAccent, selectedAccentColor, selectedBaseColor } from "$lib/global.svelte";
  import { accentColors, baseColors, type ValidColor } from "$lib/theme";
  import { setMode, userPrefersMode } from "mode-watcher";
  import { match } from "ts-pattern";

  const themeModes = ["light", "dark", "system"] as const;
</script>

{#snippet swatch(
  color: ValidColor,
  {
    isSelected,
    onclick,
  }: {
    isSelected: boolean;
    onclick: VoidFunction;
  },
)}
  {@const style = match(color)
  .with(
    "black",
    () => "--swatch-color-light: #000; --swatch-color-dark: #fff;",
  )
  .otherwise(
    () => `
          --swatch-color-light: var(--color-${color}-500, var(--color-${color}));
          --swatch-color-dark: var(--color-${color}-400, var(--color-${color}));
        `,
  )}
  <Button {style} {onclick} variant={isSelected ? "primary" : "secondary"}>
    <div
      class="size-3 rounded-full bg-(--swatch-color-light) outline-2 outline-base-300-700 dark:bg-(--swatch-color-dark)"
    >
    </div>
    {color}
  </Button>
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
  {@render swatch("black", {
    isSelected: isBlackAccent.current === true,
    onclick: () => {
      isBlackAccent.current = !isBlackAccent.current;
    },
  })}

  {#each accentColors as accentColor (accentColor)}
    {@render swatch(accentColor, {
      isSelected: selectedAccentColor.current === accentColor && !isBlackAccent.current,
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
    {@render swatch(baseColor, {
      isSelected: selectedBaseColor.current === baseColor,
      onclick: () => {
        selectedBaseColor.current = baseColor;
      },
    })}
  {/each}
</div>
