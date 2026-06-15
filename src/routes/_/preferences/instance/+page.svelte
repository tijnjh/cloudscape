<script lang="ts">
  import { browser } from "$app/environment";
  import { getSoundcloakInstances } from "$lib/api/other";
  import Button from "$lib/components/ui/Button.svelte";
  import { selectedInstance } from "$lib/global.svelte";

  const instances = await getSoundcloakInstances();

  function cleanUrl(url: string) {
    const urlObj = new URL(url);
    return urlObj.host;
  }

  function getCountryName(countryCode: string) {
    try {
      const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
      return regionNames.of(countryCode);
    } catch {
      return countryCode;
    }
  }

  function reload() {
    if (!browser) return;
    location.reload();
  }
</script>

<p>Before you can use the app, please select a server</p>
<p>This list only shows servers with the API setting enabled</p>

{#each instances as instance (instance.URL)}
  {const isSelected = instance.URL === selectedInstance.current}

  {#if instance.Settings.EnableAPI}
    <Button
      onclick={() => {
        selectedInstance.current = instance.URL;
        reload();
      }}
      variant={isSelected ? "primary" : "secondary"}
    >
      {cleanUrl(instance.URL)}
      ({getCountryName(instance.Host.Country)})
    </Button>
  {/if}
{/each}
