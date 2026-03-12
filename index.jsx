/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { render } from 'preact'

function Root()
{
RETURN_JSX_BEGIN
<main class='font-jetbrans_mono text-neutral-900 h-screen'>
  <div class='px-5 xl:mx-auto xl:w-5xl 2xl:w-7xl min-h-screen shadow-md bg-slate-50
              space-y-25 space-x-5'>
    <div class=''>11
    </div>
  </div>
</main>
RETURN_JSX_END
}

render(<Root/>, document.body)
