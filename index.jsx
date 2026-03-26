/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { createContext, render } from 'preact'
import { LocationProvider, Router } from 'preact-iso'
import { useEffect, useState } from 'preact/hooks'

import Posts from './page/posts.jsx'
import Post from './page/post.jsx'
import NotFound from './page/404.jsx'

const post_list_uri = document.body.dataset['postList']
const post_map_uri = document.body.dataset['postMap']

export const PostContext = createContext()

function Root()
{
	const [ post_list, set_post_list ] = useState()
	const [ post_map, set_post_map ] = useState()

	useEffect(() =>
	{
		set_post_list([])
	}, [])

	useEffect(async () =>
	{
		const res = await fetch(post_list_uri)
		const list = await res.json()

		set_post_list(list)
	}, [])

	useEffect(async () =>
	{
		const res = await fetch(post_map_uri)
		const map = await res.json()

		set_post_map(map)
	}, [])

RETURN_JSX_BEGIN
<div class='p-5 xl:mx-auto xl:w-5xl 2xl:w-7xl min-h-screen flex flex-col
	    shadow-md bg-slate-50 space-y-5 *:last:flex-1'>
  <LocationProvider>
    <PostContext value={ { post_list, post_map } }>
      <header class=''>1</header>
      <Router>
        <Posts path='/'/>
        <Post path='/post/:class/:slug'/>
        <NotFound default/>
      </Router>
    </PostContext>
  </LocationProvider>
</div>
RETURN_JSX_END
}

render(<Root/>, document.body)
