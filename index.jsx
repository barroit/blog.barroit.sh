/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { render } from 'preact'
import { LocationProvider, Router, Route } from 'preact-iso'

import Index from './page/posts.jsx'

function Root()
{
RETURN_JSX_BEGIN
<div class='px-5 xl:mx-auto xl:w-5xl 2xl:w-7xl min-h-screen shadow-md
            bg-slate-50 space-y-25 space-x-5'>
  <LocationProvider>
    <Router>
      <Index path='/'/>
    </Router>
  </LocationProvider>
</div>
RETURN_JSX_END
}

render(<Root/>, document.body)
