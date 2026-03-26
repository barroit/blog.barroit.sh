/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useLocation } from 'preact-iso'

export function NotFoundDialog({ part, content })
{

RETURN_JSX_BEGIN
<dialog open class='inset-0 w-screen h-screen flex'>
  <a href='/'
     class='m-auto p-3 w-75 block rounded-lg shadow-sm transition 
            HOT(bg-slate-100) ACTIVE(scale-90) space-y-5'>
    <div class='max-w-75 flex justify-center gap-x-5'>
      <img class='h-16' src='IMAGES_AMALA_FROWN_PNG'/>
      <div class='mt-1 min-w-0 space-y-2'>
        <p class='text-xl'>Unknown { part }</p>
        <p class='px-1 text-sm text-zinc-700 wrap-break-word'>{ content }</p>
      </div>
    </div>
    <div class='mx-auto w-fit font-x16y32px_grid_gazer tracking-widest'>
      <p class='pointer-coarse:hidden'>click to return</p>
      <p class='pointer-fine:hidden'>tap to return</p>
    </div>
  </a>
</dialog>
RETURN_JSX_END
}

export default function NotFound()
{
	const { path } = useLocation()

RETURN_JSX_BEGIN
<NotFoundDialog part='Path' content={ path }/>
RETURN_JSX_END
}
