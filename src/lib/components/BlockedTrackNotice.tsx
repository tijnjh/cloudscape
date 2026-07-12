import { CircleAlertIcon } from 'lucide-react'

export default function BlockedTrackNotice() {
  return (
    <div className='rounded-lg bg-base-300-700 p-4 text-base-600-400'>
      <div className='flex gap-4'>
        <CircleAlertIcon className='shrink-0' />
        <p>This track is not available for playback.</p>
      </div>
    </div>
  )
}
