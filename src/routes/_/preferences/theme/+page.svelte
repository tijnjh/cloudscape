<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import { selectedAccentColor, selectedBaseColor } from "$lib/global.svelte";
  import { baseColors, accentColors, type ValidColor } from "$lib/theme";
  import { setMode, userPrefersMode } from "mode-watcher";
  import type { PersistedState } from "runed";

  const themeModes = ["light", "dark", "system"] as const;
</script>

{#snippet colorSelector(
  colors: ValidColor[],
  selectedColorState: PersistedState<ValidColor>,
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
        disabled={isSelected}
      >
        <div
          class="size-3 rounded-full bg-(--color) outline-2 outline-base-300-700"
        ></div>
        {color}
      </Button>
    {/each}
  </div>
{/snippet}

<h3 class="text-xl font-medium">Theme</h3>

<span>Mode</span>

<div class="flex flex-wrap gap-2">
  {#each themeModes as themeMode (themeMode)}
    {@const isSelected = userPrefersMode.current === themeMode}
    <Button
      variant={isSelected ? "primary" : "secondary"}
      disabled={isSelected}
      onclick={() => setMode(themeMode)}
      class="capitalize"
    >
      {themeMode}
    </Button>
  {/each}
</div>

<span>Base color</span>

<div class="flex flex-wrap gap-2">
  {@render colorSelector(baseColors, selectedBaseColor)}
</div>

<span>Accent color</span>

<div class="flex flex-wrap gap-2">
  {@render colorSelector(accentColors, selectedAccentColor)}
</div>
