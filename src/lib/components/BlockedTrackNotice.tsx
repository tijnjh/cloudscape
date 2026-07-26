import { IconAlertCircle } from '@tabler/icons-react'
import { Alert, AlertTitle } from './ui/alert'

export function BlockedTrackNotice() {
  return (
    <Alert variant='destructive'>
      <IconAlertCircle />
      <AlertTitle>This track is not available for playback.</AlertTitle>
    </Alert>
  )
}
