<script lang="ts">
  import Button from "./ui/Button.svelte";
  import { EllipsisIcon, type LucideProps } from "@lucide/svelte";
  import { Dialog, DropdownMenu } from "bits-ui";
  import { cn } from "cnfn";
  import type { Component } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { scale } from "svelte/transition";
  import type { MergeExclusive } from "type-fest";

  const {
    title,
    subtitle,
    actions,
  }: {
    title?: string;
    subtitle?: string;
    actions?: MergeExclusive<
      {
        label: string;
        icon: Component<LucideProps>;
        onclick: VoidFunction;
      },
      {
        label: string;
        icon: Component<LucideProps>;
        href: string;
      }
    >[];
  } = $props();

  const isDesktop = new MediaQuery("min-width: 768px");
</script>

{#snippet trigger({ props }: { props: Record<string, unknown> })}
  <Button variant="secondary" aria-label="More options" {...props}>
    <EllipsisIcon size={16} />
  </Button>
{/snippet}

{#if isDesktop.current}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        {@render trigger({ props })}
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content align="end" forceMount preventScroll={false}>
        {#snippet child({ props, open, wrapperProps })}
          <div {...wrapperProps}>
            {#if open}
              <div
                {...props}
                class="z-1000 flex origin-top-right flex-col gap-2 pt-2"
                transition:scale={{ start: 0.9, duration: 150 }}
              >
                {#each actions as action (action.label)}
                  <Button
                    href={action.href}
                    onclick={action.onclick}
                    icon={action.icon}
                    class="w-full justify-start"
                  >
                    {action.label}
                  </Button>
                {/each}
              </div>
            {/if}
          </div>
        {/snippet}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
{:else}
  <Dialog.Root>
    <Dialog.Trigger>
      {#snippet child({ props })}
        {@render trigger({ props })}
      {/snippet}
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay
        class={[
          "fixed inset-0 z-40 bg-mist-950/50 backdrop-blur-lg duration-300",
          "data-[state=open]:animate-in data-[state=open]:fade-in",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out",
        ]}
      />

      <Dialog.Content
        class={cn(
          "fixed w-full z-50 bottom-0 inset-x-0 mb-24",
          "duration-400 ease-[cubic-bezier(0.65,0.05,0.36,1)",
          "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:blur-in data-[state=open]:slide-in-from-bottom",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:blur-out data-[state=closed]:slide-out-to-bottom",
        )}
      >
        <div
          class="flex h-full flex-col justify-center gap-2 overflow-scroll p-4"
        >
          <h1 class="w-fit text-3xl font-medium text-mist-100">
            {title}
          </h1>

          <p class="mb-4 w-fit text-lg text-mist-100">
            {subtitle}
          </p>

          {#each actions as action (action?.label)}
            {#if action}
              <Button
                icon={action.icon}
                onclick={action.onclick}
                variant="secondary"
                href={action.href}
                class="w-full justify-start"
              >
                {action.label}
              </Button>
            {/if}
          {/each}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
{/if}
