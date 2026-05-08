<script lang="ts">
  import { resolve } from "$app/paths";
  import Main from "$lib/components/Main.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import {
    selectedAccentColor,
    selectedBaseColor,
    selectedInstance,
  } from "$lib/global.svelte";
  import { baseColors, accentColors } from "$lib/theme";

  const selectedInstanceHostname = $derived.by(() => {
    if (!selectedInstance.current) return;
    return new URL(selectedInstance.current).hostname;
  });
</script>

<Main>
  {#snippet left()}
    <Button href={resolve("/select-instance")}>Select instance</Button>
    current: {selectedInstanceHostname}

    <h3 class="text-2xl font-medium text-accent-600-400">Theme</h3>

    <h4 class="text-lg font-medium">Base Colors</h4>

    <div class="flex flex-wrap gap-2">
      {#each baseColors as baseColor (baseColor)}
        {@const isSelected = selectedBaseColor.current === baseColor}

        <Button
          class={[
            "bg-(--color) size-5 p-0 ring-black/50 ring-offset-2",
            isSelected && "ring-2",
          ]}
          style="
            --color: var(--color-{baseColor}-500);
          "
          onclick={() => {
            selectedBaseColor.current = baseColor;
          }}
          title={baseColor}
        ></Button>
      {/each}
    </div>

    <h4 class="text-lg font-medium">Accent Colors</h4>

    <div class="flex flex-wrap gap-2">
      {#each accentColors as accentColor (accentColor)}
        {@const isSelected = selectedAccentColor.current === accentColor}

        <Button
          class={[
            "bg-(--color) size-5 p-0 ring-black/50 ring-offset-2",
            isSelected && "ring-2",
          ]}
          style="
            --color: var(--color-{accentColor}-500);
          "
          onclick={() => {
            selectedAccentColor.current = accentColor;
          }}
          title={accentColor}
        ></Button>
      {/each}
    </div>
  {/snippet}
  {#snippet right()}
    <p>
      These settings are saved in localstorage, so they will persist across
      sessions but won't sync between devices.
    </p>
  {/snippet}
</Main>
