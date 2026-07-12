import { getSoundcloakInstances } from '$lib/api/other'
import QueryView from '$lib/components/QueryView'
import Button from '$lib/components/ui/Button'
import { selectedInstanceAtom } from '$lib/global'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'

export const Route = createFileRoute('/_/preferences/instance')({
  component: InstancePage,
})

function InstancePage() {
  const [selectedInstance, setSelectedInstance] = useAtom(selectedInstanceAtom)

  const instancesQuery = useQuery({
    queryKey: ['soundcloak-instances'],
    queryFn: async () => getSoundcloakInstances(),
  })

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

  function reload() {
    location.reload()
  }

  return (
    <>
      <p>Before you can use the app, please select a server</p>
      <p>This list only shows servers with the API setting enabled</p>

      <QueryView
        query={instancesQuery}
        content={instances => instances.map((instance) => {
          const isSelected = instance.URL === selectedInstance

          return instance.Settings.EnableAPI && (
            <Button
              key={instance.URL}
              onClick={() => {
                setSelectedInstance(instance.URL)
                reload()
              }}
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
      />
    </>
  )
}
