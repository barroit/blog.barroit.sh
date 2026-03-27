/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useRoute, useLocation } from 'preact-iso'
import { useContext, useEffect, useRef, useState } from 'preact/hooks'

import { PostListContext, PostMapContext } from '../index.jsx'
import Button from '../lib/button.jsx'
import { CenteredLoading, NotFoundDialog } from '../lib/ux.jsx'
import Header from './header.jsx'

function sanitize_post(post)
{
	post = post.replaceAll(/style="width: ([\d.]+%)"/g, 'width="$1"')

	return post
}

function find_active_anchor(box)
{
	const hash = window.location.hash.slice(1)
	const id = decodeURIComponent(hash)
	const prev = box.current.getElementsByClassName('targeting')[0]
	const next = document.getElementById(id)

	if (prev)
		prev.classList.remove('targeting')

	if (!id)
		return

	if (next)
		next.classList.add('targeting')

	return next
}

function preview_media({  })
{
	//
}

function Content({ post })
{
	const box = useRef()
	const dialog = useRef()

	useEffect(() =>
	{
		const find_active_anchor_fn = BIND(find_active_anchor, box)
		const cleanup = []
		define(CLEANUP, cleanup.push(() => $1))dnl

		let anchor
		let media

		box.current.insertAdjacentHTML('afterbegin', post)

		media = box.current.getElementsByTagName('img')
		anchor = find_active_anchor_fn()

		if (anchor)
			anchor.scrollIntoView()

		for (const img of media)
			img.draggable = 0

		CLEANUP(PAGE_IGNORE_EVENT('hashchange', find_active_anchor_fn))

		PAGE_ON_EVENT('hashchange', find_active_anchor_fn)
		return () => cleanup.forEach(c => c())
	}, [])

	const src = 'http://192.168.50.246:3939/media/concert/miku-mm-25/1-gEeogLxn.avif'

RETURN_JSX_BEGIN
<div ref={ box } id='post'
     class='post mx-auto max-w-[60ch] font-post tracking-wide'>
  <dialog class='inset-0 p-10 w-full h-[100dvh] open:flex'>
    <img class='m-auto max-h-full object-contain' src={ src }/>
  </dialog>
</div>
RETURN_JSX_END
}

function Master({ post_list, post_map })
{
	const { params } = useRoute()
	const [ post, set_post ] = useState()

	const post_pos = post_map[params.slug]
	const post_meta = post_list[post_pos]

	const found = HAS_PROP(post_map, params.slug) &&
		      post_meta.class == params.class

	useEffect(async () =>
	{
		if (!found)
			return

		const res = await fetch(post_meta.uri)
		const __data = await res.text()
		const data = sanitize_post(__data)

		set_post(data)
		return () => set_post()
	}, [ params.slug ])

RETURN_JSX_BEGIN !found ? (
<NotFoundDialog part='Slug' content={ params.slug }/>
) : post ? (
<Content { ...{ post } }/>
) : undefined RETURN_JSX_END
}

function go_back()
{
	navigation.navigate('/')
}

export default function Post()
{
	const post_list = useContext(PostListContext)
	const post_map = useContext(PostMapContext)

	const ready = post_list && post_list.length && post_map
	const loading = post_list && (!post_list.length || !post_map)

RETURN_JSX_BEGIN
<main class={ loading ? 'relative' : '' }>
{ !ready ? (
  <CenteredLoading { ...{ loading } }/>
) : undefined }
  <Header>
    <Button onclick={ go_back }>return</Button>
  </Header>
{ ready ? (
  <Master { ...{ post_list, post_map } }/>
) : undefined }
</main>
RETURN_JSX_END
}
