/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { createContext, render } from 'preact'
import { LocationProvider, Router } from 'preact-iso'
import { useEffect, useState } from 'preact/hooks'

import Posts from './page/posts.jsx'
import Post from './page/post.jsx'
import Search from './page/search.jsx'
import NotFound from './page/404.jsx'

const post_list_uri = document.body.dataset['postList']
const post_map_uri = document.body.dataset['postMap']

export const PostListContext = createContext()
export const PostMapContext = createContext()

function Root()
{
	const [ post_list, set_post_list ] = useState()
	const [ post_map, set_post_map ] = useState()
	const post_loading = post_list && !post_list.length

	useEffect(() =>
	{
		set_post_list([])

		fetch(post_list_uri).then(res => res.json()).then(set_post_list)
		fetch(post_map_uri).then(res => res.json()).then(set_post_map)
	}, [])

RETURN_JSX_BEGIN
<div class='py-5 px-10 md:mx-auto md:w-2xl xl:w-5xl min-h-screen flex flex-col
            shadow-md bg-slate-50 space-y-5 *:last:flex-1'>
  <LocationProvider>
    <PostListContext value={ [ post_list, post_loading ] }>
      <PostMapContext value={ post_map }>
        <Router>
          <Posts path='/'/>
          <Post path='/post/:class/:slug'/>
          <Search path='/search'/>
          <NotFound default/>
        </Router>
      </PostMapContext>
    </PostListContext>
  </LocationProvider>
</div>
RETURN_JSX_END
}

render(<Root/>, document.body)
