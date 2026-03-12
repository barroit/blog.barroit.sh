/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { render } from 'preact'
import { LocationProvider, Router, Route } from 'preact-iso'

import Posts from './page/posts.jsx'
import Post from './page/post.jsx'
import NotFound from './page/404.jsx'

function Root()
{

RETURN_JSX_BEGIN
<div class='p-5 xl:mx-auto xl:w-5xl 2xl:w-7xl min-h-screen shadow-md bg-slate-50
            space-y-5'>
  <LocationProvider>
    <div class=''>1</div>
    <Router>
      <Posts path='/'/>
      <Post path='/posts/:slug'/>
      <NotFound default/>
    </Router>
  </LocationProvider>
</div>
RETURN_JSX_END
}

render(<Root/>, document.body)
