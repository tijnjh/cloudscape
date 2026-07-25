import { IconAlertCircle } from '@tabler/icons-react'
import { serializeError } from 'serialize-error'

export function ErrorDisplay({ error }: { error: unknown }) {
  const err = serializeError(error)

  return (
    <div className='@container rounded-lg bg-rose-500/20 p-4 text-rose-800-200'>
      <div className='flex flex-col gap-4 @lg:flex-row'>
        <IconAlertCircle className='shrink-0' />
        {err.message}
      </div>
    </div>
  )
}
