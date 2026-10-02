import type { UseInfiniteQueryResult, UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { cn } from 'cnfast'
import { motion, useReducedMotion } from 'motion/react'
import { ErrorDisplay } from './error-display'
import { Spinner } from './spinner'

export function QueryView<T>({
  query,
  content,
  className,
}: {
  query: UseQueryResult<T> | UseInfiniteQueryResult<T>
  content: (data: T) => ReactNode
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  if (query.isLoading)
    return <Spinner />

  if (query.isError)
    return <ErrorDisplay error={query.error} />

  return (
    <motion.div
      initial={{ y: reduceMotion ? 0 : 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('flex flex-col gap-4', className)}
    >
      {content(query.data!)}
    </motion.div>
  )
}
