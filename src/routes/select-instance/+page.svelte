<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { getSoundcloakInstances } from "$lib/api/other";
  import Main from "$lib/components/Main.svelte";
  import QueryView from "$lib/components/QueryView.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { selectedInstance } from "$lib/global.svelte";
  import { createQuery } from "@tanstack/svelte-query";

  const instancesQuery = createQuery(() => ({
    queryKey: ["soundcloak-instances"],
    queryFn: async () => getSoundcloakInstances(),
  }));

  function cleanUrl(url: string) {
    const urlObj = new URL(url);
    return urlObj.host;
  }

  const dn = new Intl.DisplayNames("en", { type: "region" });

  function reload() {
    if (!browser) return;
    location.reload();
  }
</script>

<Main>
  {#snippet left()}
    <p>Before you can use the app, please select a server</p>
    <p>This list only shows servers with the API setting enabled</p>
  {/snippet}

  {#snippet right()}
    <QueryView query={instancesQuery}>
      {#snippet content(instances)}
        {#each instances as instance (instance.URL)}
          {@const isSelected = instance.URL === selectedInstance.current}

          {#if instance.Settings.EnableAPI}
            <Button
              onclick={() => {
                selectedInstance.current = instance.URL;
                goto(resolve("/")).then(() => {
                  reload();
                });
              }}
              variant={isSelected ? "primary" : "secondary"}
            >
              {cleanUrl(instance.URL)}
              ({dn.of(instance.Host.Country)})
            </Button>
          {/if}
        {/each}
      {/snippet}
    </QueryView>
  {/snippet}
</Main>
