import type { UseQueryResult } from '@tanstack/react-query'
import type { ClassValue } from 'cnfn'
import type { ReactNode } from 'react'
import { cn } from 'cnfn'
import { motion } from 'motion/react'
import ErrorDisplay from './ErrorDisplay'
import Spinner from './Spinner'

export default function QueryView<T>({
  query,
  children,
  className,
}: {
  query: UseQueryResult<T>
  children: (data: T) => ReactNode
  className?: ClassValue
}) {
  if (query.isLoading) {
    return <Spinner />
  }

  if (query.isError) {
    return <ErrorDisplay error={query.error} />
  }

  if (query.data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('flex flex-col gap-4', className)}
      >
        {children(query.data)}
      </motion.div>
    )
  }

  return null
}
