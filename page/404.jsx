/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useLocation } from 'preact-iso'

function close_dialog(event)
{
	PARENT_OF(event.currentTarget).close()
}

export default function NotFound()
{
	const { path, route } = useLocation()
	const on_dialog_close = route.bind(undefined, '/', 1)

RETURN_JSX_BEGIN
<dialog open class='inset-0 w-screen h-screen flex' onclose={ on_dialog_close }>
  <button class='m-auto p-3 w-75 rounded-lg shadow-sm space-y-5 cursor-pointer
                 transition HOT(bg-slate-100) ACTIVE(scale-90)'
          onclick={ close_dialog }>
    <div class='space-y-2'>
      <p class='text-xl'>Unknown Path</p>
      <p class='px-1 text-xs text-zinc-700 wrap-break-word'>{ path }</p>
    </div>
    <div class='mx-auto w-fit font-x16y32px_grid_gazer tracking-widest'>
      <p class='pointer-coarse:hidden'>click to return</p>
      <p class='pointer-fine:hidden'>tap to return</p>
    </div>
  </button>
</dialog>
RETURN_JSX_END
}
