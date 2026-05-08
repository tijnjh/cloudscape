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
  import type { PersistedState } from "runed";

  const selectedInstanceHostname = $derived.by(() => {
    if (!selectedInstance.current) return;
    return new URL(selectedInstance.current).hostname;
  });
</script>

{#snippet colorButton(
  color: BaseColor | AccentColor,
  remoteVar: PersistedState<BaseColor | AccentColor>,
)}
  {@const isSelected = remoteVar.current === color}

  <Button
    class={["bg-(--color) ring-black/50 ring-offset-2", isSelected && "ring-2"]}
    style="
            --color: var(--color-{color}-500);
          "
    onclick={() => {
      remoteVar.current = color;
    }}
    title={color}
  ></Button>
{/snippet}

<Main>
  {#snippet left()}
    <h3 class="text-xl font-medium">Server instance</h3>
    current: {selectedInstanceHostname}

    <Button href={resolve("/select-instance")}>Select instance</Button>

    <hr class="h-px border-0 bg-base-400-600" />

    <h3 class="text-xl font-medium">Theme</h3>

    <span>Base Colors</span>

    <div class="flex flex-wrap gap-2">
      {#each baseColors as baseColor (baseColor)}
        {@render colorButton(baseColor, selectedBaseColor)}
      {/each}
    </div>

    <span>Accent Colors</span>

    <div class="flex flex-wrap gap-2">
      {#each accentColors as accentColor (accentColor)}
        {@render colorButton(accentColor, selectedAccentColor)}
      {/each}
    </div>
  {/snippet}
  {#snippet right()}{/snippet}
</Main>
