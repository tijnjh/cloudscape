import type { ReactElement } from 'react'
import { maxCollectionNameLength } from '$lib/collections'
import { Dialog } from '@base-ui/react/dialog'
import { Toast } from '@base-ui/react/toast'
import { useState } from 'react'
import { Button } from './ui/button'
import { DialogContent } from './ui/dialog-content'
import { Input } from './ui/input'

export function CollectionNameDialog({ initialName = '', onSave, children }: {
  initialName?: string
  onSave: (name: string) => void
  children: ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(initialName)
  const toast = Toast.useToastManager()
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (open)
          setName(initialName)
        setOpen(open)
      }}
    >
      <Dialog.Trigger render={children} />
      <DialogContent title={initialName ? 'Rename collection' : 'Create collection'}>
        <form
          className='mt-4 flex flex-col gap-4'
          onSubmit={(event) => {
            event.preventDefault()
            try {
              onSave(name.trim())
              setOpen(false)
            }
            catch {
              toast.add({ title: 'Could not save collection', type: 'error' })
            }
          }}
        >
          <Input aria-label='Collection name' value={name} onValueChange={setName} required pattern='.*\S.*' maxLength={maxCollectionNameLength} />
          <div className='flex justify-end gap-2'>
            <Dialog.Close render={<Button variant='secondary'>Cancel</Button>} />
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog.Root>
  )
}
