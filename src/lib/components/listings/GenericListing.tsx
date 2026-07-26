import type { ComponentProps } from 'react'
import type { ListingThumbnailProps } from '../ListingThumbnail'
import type { Action } from '../Menu'
import { IconArrowUpRight, IconDots } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import cn from 'cnfast'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../ui/item'

// export type GenericListingProps = & {
//   title: string
//   badges?: (string | false)[]
//   subtitle: string
//   thumbnail: ListingThumbnailProps
//   actions?: Action[]
//   href?: string
// }

export interface GenericListingProps extends ComponentProps<typeof Item> {
  title: string
  badges?: (string | false)[]
  subtitle: string
  thumbnail: ListingThumbnailProps
  actions?: Action[]
}

export function GenericListing({
  title,
  badges,
  subtitle,
  thumbnail,
  actions,
  render,
  ...props
}: GenericListingProps) {
  return (
    <Item
      render={render}
      variant='outline'
      size='default'
      className='text-left p-3'
      {...props}
    >
      <ItemMedia variant='image' className='rounded-sm'>
        <img src={thumbnail.src!} alt={thumbnail.alt} />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className=''>
          <h3 className='text-ellipsis'>{title}</h3>
          {badges?.map(badge => badge && <Badge key={badge}>{badge}</Badge>)}
        </ItemTitle>

        <ItemDescription>
          {subtitle}
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        {actions && (
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={e => e.stopPropagation()}
              render={(
                <Button variant='outline' size='icon'>
                  <IconDots />
                </Button>
              )}
            />

            <DropdownMenuContent onClick={e => e.stopPropagation()}>
              {actions.map(action => (
                <DropdownMenuGroup key={action.label}>
                  <DropdownMenuItem
                    render={action.href ? <Link to={action.href} /> : undefined}
                    className={cn(action.href && 'cursor-pointer')}
                    onClick={action.onClick}

                  >
                    <action.icon />
                    {action.label}

                    {action.href && (
                      <IconArrowUpRight className='ml-auto' />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {/* {actions && actions.map(action => (
          <Button>
            {action.label}
          </Button>
        ))} */}

      </ItemActions>
    </Item>
  )

  // return (
  //   <div className='flex items-center gap-4 text-left'>
  //     <BaseButton
  //       render={render}
  //       nativeButton={!render}
  //       {...props}
  //       disabled={disabled}
  //       className={[
  //         'relative isolate flex w-full min-w-0 gap-4 text-left transition-transform duration-150 ease-out',
  //         disabled
  //           ? 'cursor-not-allowed opacity-50'
  //           : 'cursor-pointer active:scale-97 active:opacity-50',
  //         'before:absolute before:-inset-2 before:-z-10 before:rounded-[10px] before:bg-base-300-700 before:content-[\'\']',
  //         'before:scale-95 before:opacity-0 before:transition-[opacity,scale] before:duration-160 before:ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:before:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:before:opacity-100',
  //         disabled && 'before:hidden',
  //       ].filter(Boolean).join(' ')}
  //     >
  //       <ListingThumbnail {...thumbnail} />

  //       <div className='flex flex-col truncate'>
  //         <div className='flex gap-2'>
  //           <h3 className='truncate'>{title}</h3>

  //           {badges?.map(badge => badge && <Badge key={badge}>{badge}</Badge>)}
  //         </div>
  //         <p className='truncate text-accent/75'>
  //           {subtitle}
  //         </p>
  //       </div>
  //     </BaseButton>

  //     {actions && (
  //       <Menu
  //         actions={actions}
  //         title={title}
  //         subtitle={subtitle}
  //       />
  //     )}
  //   </div>
  // )
}

// export function GenericListing({
//   title,
//   badges,
//   subtitle,
//   thumbnail,
//   actions,
//   disabled,
//   href,
//   ...props
// }: GenericListingProps) {
//   const render = href ? <Link to={href} /> : undefined

//   return (
//     <div className='flex items-center gap-4 text-left'>
//       <BaseButton
//         render={render}
//         nativeButton={!render}
//         {...props}
//         disabled={disabled}
//         className={[
//           'relative isolate flex w-full min-w-0 gap-4 text-left transition-transform duration-150 ease-out',
//           disabled
//             ? 'cursor-not-allowed opacity-50'
//             : 'cursor-pointer active:scale-97 active:opacity-50',
//           'before:absolute before:-inset-2 before:-z-10 before:rounded-[10px] before:bg-base-300-700 before:content-[\'\']',
//           'before:scale-95 before:opacity-0 before:transition-[opacity,scale] before:duration-160 before:ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:before:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:before:opacity-100',
//           disabled && 'before:hidden',
//         ].filter(Boolean).join(' ')}
//       >
//         <ListingThumbnail {...thumbnail} />

//         <div className='flex flex-col truncate'>
//           <div className='flex gap-2'>
//             <h3 className='truncate'>{title}</h3>

//             {badges?.map(badge => badge && <Badge key={badge}>{badge}</Badge>)}
//           </div>
//           <p className='truncate text-accent/75'>
//             {subtitle}
//           </p>
//         </div>
//       </BaseButton>

//       {actions && (
//         <Menu
//           actions={actions}
//           title={title}
//           subtitle={subtitle}
//         />
//       )}
//     </div>
//   )
// }
