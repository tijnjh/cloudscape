<script module lang="ts">
  import Button from "./Button.svelte";
  import { type IconProps, XIcon } from "@lucide/svelte";
  import { cn } from "cnfn";
  import type { Component } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { scale } from "svelte/transition";

  export interface InputProps extends HTMLInputAttributes {
    icon?: Component<IconProps>;
  }
</script>

<script lang="ts">
  let {
    value = $bindable(),
    class: className,
    icon: Icon,
    ...props
  }: InputProps = $props();
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

  {#if value}
    <div transition:scale={{ start: 0.75, duration: 150 }}>
      <Button
        type="button"
        onclick={() => (value = "")}
        size="icon"
        class="mr-2 size-6 shrink-0"
      >
        <XIcon size={12} strokeWidth={3} />
      </Button>
    </div>
  {/if}
</div>
