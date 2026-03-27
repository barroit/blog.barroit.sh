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

function fixup_hash_target(box)
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

function Content({ post })
{
	const box = useRef()

	useEffect(() =>
	{
		const fixup_hash_target_fn = BIND(fixup_hash_target, box)
		const event_args = [ 'hashchange', fixup_hash_target_fn ]
		let target

		box.current.insertAdjacentHTML('beforeend', post)
		target = fixup_hash_target_fn()

		if (target)
			target.scrollIntoView()

		window.addEventListener(...event_args)
		return () => window.removeEventListener(...event_args)
	}, [])

RETURN_JSX_BEGIN
<div ref={ box } id='post'
     class='post mx-auto max-w-[60ch] font-post tracking-wide'></div>
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
