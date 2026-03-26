/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useLocation } from 'preact-iso'

/*
 * Initialize this Loading component with loading = 0, otherwise the delay is
 * applied incorreclty.
 */
export function Loading({ loading, ...props })
{
	APPEND_CLASS(props, 'm-auto opacity-0 data-loading:opacity-100 \
			     animate-spin transition delay-50')

RETURN_JSX_BEGIN
<div class='flex'>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
       fill='none' stroke='currentColor' stroke-width='2'
       data-loading={ loading ? '' : undefined } { ...props }>
    <circle cx='12' cy='12' r='9' opacity='0.39'/>
    <circle cx='12' cy='12' r='9'
            stroke-dasharray='14 57' stroke-linecap='round'/>
  </svg>
</div>
RETURN_JSX_END
}

export function CenteredLoading({ loading })
{

RETURN_JSX_BEGIN
<div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
  <Loading class='size-24 text-miku-cyan' { ...{ loading } }/>
</div>
RETURN_JSX_END
}

function go_back()
{
	let path = '/'

	if (navigation.canGoBack) {
		const entries = navigation.entries()
		const next = navigation.currentEntry
		const prev = entries[next.index - 1]

		path = prev.url
	}

	navigation.navigate(path, { history: 'replace' })
}

export function NotFoundDialog({ part, content })
{

RETURN_JSX_BEGIN
<dialog open class='inset-0 w-screen h-screen flex'>
  <button onclick={ go_back }
          class='m-auto p-3 w-75 rounded-lg shadow-sm
                 transition HOT(bg-slate-100) ACTIVE(scale-90) space-y-5'>
    <span class='max-w-75 flex justify-center gap-x-5'>
      <img class='h-16' src='IMAGES_AMALA_FROWN_PNG'/>
      <span class='mt-1 min-w-0 space-y-2'>
        <span class='block text-xl'>Unknown { part }</span>
        <span class='px-1 block text-sm text-zinc-700 wrap-break-word'>
          { content }
        </span>
      </span>
    </span>
    <span class='mx-auto w-fit font-x16y32px_grid_gazer tracking-widest'>
      <span class='pointer-coarse:hidden'>click to return</span>
      <span class='pointer-fine:hidden'>tap to return</span>
    </span>
  </button>
</dialog>
RETURN_JSX_END
}
