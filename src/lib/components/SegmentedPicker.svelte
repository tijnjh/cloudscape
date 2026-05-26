<script lang="ts" generics="T extends string[]">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { cn } from "$lib/utils";
  import type { ClassValue } from "clsx";

  let {
    options,
    current = $bindable(),
    onchange,
    class: className,
  }: {
    options: T;
    current?: T[number];
    onchange?: (value: T[number]) => void;
    class?: ClassValue;
  } = $props();
</script>

<Tabs.Root bind:value={current} onValueChange={onchange} class={cn(className)}>
  <Tabs.List>
    {#each options as option (option)}
      <Tabs.Trigger value={option}>{option}</Tabs.Trigger>
    {/each}
  </Tabs.List>
</Tabs.Root>
