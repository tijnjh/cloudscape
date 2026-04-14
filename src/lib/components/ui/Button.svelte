<script module lang="ts">
  import type { ButtonRootProps } from "bits-ui";
  import { tv, type VariantProps } from "tailwind-variants";

  export const buttonVariants = tv({
    slots: {
      base: [
        "flex cursor-pointer items-center justify-center gap-2 truncate rounded-full transition-transform",
      ],
    },
    variants: {
      variant: {
        primary: "bg-mist-900-100 text-mist-200-800",
        secondary: "bg-mist-300-700",
      },
      size: {
        default: "px-4 py-2",
        icon: "size-10",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: "hover:opacity-80 active:scale-90 active:opacity-50",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "primary",
    },
  });

  export type ButtonProps = ButtonRootProps &
    VariantProps<typeof buttonVariants> & {
      icon?: Component<IconProps>;
      iconPosition?: "leading" | "trailing";
    };
</script>

<script lang="ts">
  import type { IconProps } from "@lucide/svelte";
  import { Button } from "bits-ui";
  import { cn } from "cnfn";
  import type { Component } from "svelte";

  const {
    children,
    variant,
    size,
    icon: Icon,
    iconPosition = "leading",
    class: className,
    ...props
  }: ButtonProps = $props();

  const classes = $derived(
    buttonVariants({ variant, size, disabled: props.disabled }),
  );
</script>

<Button.Root class={classes.base({ class: cn(className) })} {...props}>
  {#if iconPosition === "leading"}
    <Icon size={16} strokeWidth={3} class="shrink-0" />
  {/if}

  {@render children?.()}

  {#if iconPosition === "trailing"}
    <Icon size={16} strokeWidth={3} class="shrink-0" />
  {/if}
</Button.Root>
