const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function formatDate(date?: Date | string | null | undefined) {
  if (!date)
    return
  const normalizedDate = typeof date === 'string' ? new Date(date) : date
  return dateFormatter.format(normalizedDate)
}
