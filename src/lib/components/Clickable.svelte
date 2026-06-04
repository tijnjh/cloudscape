<script module lang="ts">
  import type {
    HTMLAttributeAnchorTarget,
    HTMLAttributes,
    HTMLButtonAttributes,
  } from "svelte/elements";
  import type { MergeExclusive } from "type-fest";

  export type ClickableProps = HTMLAttributes<HTMLElement> &
    MergeExclusive<
      {
        disabled?: boolean | undefined | null;
        form?: string | undefined | null;
        formaction?: string | undefined | null;
        formenctype?:
          | "application/x-www-form-urlencoded"
          | "multipart/form-data"
          | "text/plain"
          | undefined
          | null;
        formmethod?:
          | "dialog"
          | "get"
          | "post"
          | "DIALOG"
          | "GET"
          | "POST"
          | undefined
          | null;
        formnovalidate?: boolean | undefined | null;
        formtarget?: string | undefined | null;
        name?: string | undefined | null;
        type?: "submit" | "reset" | "button" | undefined | null;
        value?: string | string[] | number | undefined | null;
        popovertarget?: string | undefined | null;
        popovertargetaction?: "toggle" | "show" | "hide" | undefined | null;
        command?:
          | "show-modal"
          | "close"
          | "request-close"
          | "show-popover"
          | "hide-popover"
          | "toggle-popover"
          | (string & {})
          | undefined
          | null;
        commandfor?: string | undefined | null;
      },
      {
        download?: any;
        href?: string | undefined | null;
        hreflang?: string | undefined | null;
        media?: string | undefined | null;
        ping?: string | undefined | null;
        rel?: string | undefined | null;
        target?: HTMLAttributeAnchorTarget | undefined | null;
        type?: string | undefined | null;
        referrerpolicy?: ReferrerPolicy | undefined | null;
      }
    >;
</script>

<script lang="ts">
  const { children, ...props }: ClickableProps = $props();

  const Tag = $derived("href" in props ? "a" : "button");
</script>

{#if "href" in props}
  <a {...props}>
    {@render children?.()}
  </a>
{:else}
  <button {...props as HTMLButtonAttributes}>
    {@render children?.()}
  </button>
{/if}
