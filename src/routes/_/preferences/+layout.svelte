<script lang='ts'>
  import type { Snippet } from 'svelte'
  import { page } from '$app/state'
  import Main from '$lib/components/Main.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import { ServerCogIcon, SwatchBookIcon } from '@lucide/svelte'

  const { children }: { children: Snippet } = $props()

  const tabs = [
    { name: 'theme', icon: SwatchBookIcon },
    { name: 'instance', icon: ServerCogIcon },
  ]
</script>

<Main split={[25, 75]}>
  {#snippet left()}
    <div class='flex gap-2 lg:contents'>
      {#each tabs as tab (tab.name)}
        {const href = `/_/preferences/${tab.name}`}
        {const isSelected = $derived(page.route.id === href)}

        <Button
          {href}
          icon={tab.icon}
          class='w-fit justify-start capitalize md:w-full'
          variant={isSelected ? 'primary' : 'secondary'}
        >
          {tab.name}
        </Button>
      {/each}
    </div>
  {/snippet}
  {#snippet right()}
    {@render children?.()}
  {/snippet}
</Main>
