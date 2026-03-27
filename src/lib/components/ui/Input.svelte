<script lang="ts">
  import type { IconProps } from "@lucide/svelte";
  import { cn } from "cnfn";
  import type { Component } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";

  let {
    value = $bindable(),
    class: className,
    icon: Icon,
    ...props
  }: HTMLInputAttributes & {
    icon?: Component<IconProps>;
  } = $props();
</script>

<div
  class={cn(
    "bg-mist-300-700 relative flex h-10 items-center gap-2 overflow-clip rounded-full pl-4 ring-blue-500 focus-within:ring-2",
    className,
  )}
>
  {#if Icon}
    <Icon size={16} strokeWidth={3} class="shrink-0" />
  {/if}

  <input {...props} bind:value class="h-full grow outline-none" />
</div>
