import type { ValidColor } from '$lib/theme'
import type { CSSProperties } from 'react'
import { Button } from '$lib/components/ui/Button'
import {
  isBlackAccentAtom,
  selectedAccentColorAtom,
  selectedBaseColorAtom,
  themeModeAtom,
} from '$lib/global'
import { accentColors, baseColors } from '$lib/theme'
import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'

const themeModes = ['light', 'dark', 'system'] as const

export const Route = createFileRoute('/_/preferences/theme')({
  component: ThemePage,
})

function Swatch({
  color,
  isSelected,
  onClick,
}: {
  color: ValidColor
  isSelected: boolean
  onClick: VoidFunction
}) {
  const style = color === 'black'
    ? {
        '--swatch-color-light': '#000',
        '--swatch-color-dark': '#fff',
      } as CSSProperties
    : {
        '--swatch-color-light': `var(--color-${color}-500, var(--color-${color}))`,
        '--swatch-color-dark': `var(--color-${color}-400, var(--color-${color}))`,
      } as CSSProperties

  return (
    <Button style={style} onClick={onClick} variant={isSelected ? 'primary' : 'secondary'}>
      <div
        className='size-3 rounded-full bg-(--swatch-color-light) outline-2 outline-base-300-700 dark:bg-(--swatch-color-dark)'
      />
      {color}
    </Button>
  )
}

function ThemePage() {
  const [themeMode, setThemeMode] = useAtom(themeModeAtom)
  const [isBlackAccent, setIsBlackAccent] = useAtom(isBlackAccentAtom)
  const [selectedAccentColor, setSelectedAccentColor] = useAtom(selectedAccentColorAtom)
  const [selectedBaseColor, setSelectedBaseColor] = useAtom(selectedBaseColorAtom)

  return (
    <>
      <h3 className='text-xl font-medium'>Theme</h3>

      <span>Mode</span>

      <div className='flex flex-wrap gap-2'>
        {themeModes.map(mode => (
          <Button
            key={mode}
            variant={themeMode === mode ? 'primary' : 'secondary'}
            onClick={() => setThemeMode(mode)}
            className='capitalize'
          >
            {mode}
          </Button>
        ))}
      </div>

      <span>Accent Colors</span>

      <div className='flex flex-wrap gap-2'>
        <Swatch
          color='black'
          isSelected={isBlackAccent === true}
          onClick={() => setIsBlackAccent(value => !value)}
        />

        {accentColors.map(accentColor => (
          <Swatch
            key={accentColor}
            color={accentColor}
            isSelected={selectedAccentColor === accentColor && !isBlackAccent}
            onClick={() => {
              setIsBlackAccent(false)
              setSelectedAccentColor(accentColor)
            }}
          />
        ))}
      </div>

      <span>Base Colors</span>

      <div className='flex flex-wrap gap-2'>
        {baseColors.map(baseColor => (
          <Swatch
            key={baseColor}
            color={baseColor}
            isSelected={selectedBaseColor === baseColor}
            onClick={() => setSelectedBaseColor(baseColor)}
          />
        ))}
      </div>
    </>
  )
}
