import { getSoundcloakInstances } from '$lib/api/other'
import { Button } from '$lib/components/ui/Button'
import { selectedInstanceAtom } from '$lib/global'
import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'

export const Route = createFileRoute('/_/preferences/instance')({
  component: InstancePage,

  loader: async () => {
    const instances = await getSoundcloakInstances()

    return { instances }
  },
})

function InstancePage() {
  const [selectedInstance, setSelectedInstance] = useAtom(selectedInstanceAtom)

  const { instances } = Route.useLoaderData()

  function cleanUrl(url: string) {
    const urlObj = new URL(url)
    return urlObj.host
  }

  function getCountryName(countryCode: string) {
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
      return regionNames.of(countryCode)
    }
    catch {
      return countryCode
    }
  }

  function selectInstance(instanceUrl: string) {
    const isInitialSelection = selectedInstance === undefined

    setSelectedInstance(instanceUrl)

    if (isInitialSelection)
      location.assign('/')
    else
      location.reload()
  }

  return (
    <>
      <p>Before you can use the app, please select a server</p>
      <p>This list only shows servers with the API setting enabled</p>

      {instances.map((instance) => {
        const isSelected = instance.URL === selectedInstance

        return instance.Settings.EnableAPI && (
          <Button
            key={instance.URL}
            onClick={() => selectInstance(instance.URL)}
            variant={isSelected ? 'primary' : 'secondary'}
          >
            {cleanUrl(instance.URL)}
            {' '}
            (
            {getCountryName(instance.Host.Country)}
            )
          </Button>
        )
      })}
    </>
  )
}
