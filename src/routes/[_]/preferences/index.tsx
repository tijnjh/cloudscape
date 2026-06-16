import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_/preferences/')({
  beforeLoad: () => {
    throw redirect({ to: '/_/preferences/theme' })
  },
})
