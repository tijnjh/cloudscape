import { maxCollectionNameLength } from '$lib/collections'
import { Dialog } from '@base-ui/react/dialog'
import { useState } from 'react'
import { AnimatedDialog } from './ui/animated-dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function CollectionNameDialog({
  open,
  onOpenChange,
  title,
  initialName = '',
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  initialName?: string
  onSave: (name: string) => void
}) {
  return (
    <AnimatedDialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Title className='text-2xl font-medium'>{title}</Dialog.Title>
      <Dialog.Description className='mt-2 text-base-600-400'>
        Collections are saved in this browser. Share a link to send someone a copy.
      </Dialog.Description>
      <NameForm initialName={initialName} onSave={onSave} onClose={() => onOpenChange(false)} />
    </AnimatedDialog>
  )
}

function NameForm({ initialName, onSave, onClose }: {
  initialName: string
  onSave: (name: string) => void
  onClose: () => void
}) {
  const [name, setName] = useState(initialName)
  const [error, setError] = useState('')

  return (
    <form
      className='mt-4 flex flex-col gap-4'
      onSubmit={(event) => {
        event.preventDefault()
        try {
          onSave(name.trim())
          onClose()
        }
        catch {
          setError('Could not save this collection. Check that browser storage is available and has free space.')
        }
      }}
    >
      <label className='flex flex-col gap-2'>
        Collection name
        <Input value={name} onChange={event => setName(event.target.value)} required maxLength={maxCollectionNameLength} />
      </label>
      {error && <p role='alert'>{error}</p>}
      <div className='flex justify-end gap-2'>
        <Button type='button' variant='secondary' onClick={onClose}>Cancel</Button>
        <Button type='submit' disabled={!name.trim()}>Save</Button>
      </div>
    </form>
  )
}
