import type { AnchorHTMLAttributes, ReactElement } from 'react'
import { Link } from '@tanstack/react-router'

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

type RouterLinkProps = Omit<AppLinkProps, 'href'> & {
  to: string
}

const RouterLink = Link as unknown as (props: RouterLinkProps) => ReactElement

export function AppLink({ href, children, ...props }: AppLinkProps) {
  if (href.startsWith('/')) {
    return (
      <RouterLink to={href} {...props}>
        {children}
      </RouterLink>
    )
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
