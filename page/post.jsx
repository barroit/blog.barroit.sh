/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useRoute, useLocation } from 'preact-iso'
import { useContext, useEffect, useRef, useState } from 'preact/hooks'

import { PostListContext, PostMapContext } from '../index.jsx'
import { GobackButton } from '../lib/button.jsx'
import Dialog from '../lib/dialog.jsx'
import { CenteredLoading, NotFoundDialog } from '../lib/ux.jsx'
import { Field } from './credit.jsx'
import Header from './header.jsx'

function sanitize_post(post)
{
	post = post.replaceAll(/style="width: ([\d.]+%)"/g, 'width="$1"')
	post = post.replaceAll(/style=".+"/g, '')

	return post
}

function find_active_anchor(box)
{
	const hash = window.location.hash.slice(1)
	const id = decodeURIComponent(hash)
	const prev = C(box).getElementsByClassName('targeting')[0]
	const next = document.getElementById(id)

	if (prev)
		prev.classList.remove('targeting')

	if (!id)
		return

	if (next)
		next.classList.add('targeting')

	return next
}

function preview_media(dialog, event)
{
	const url = T(event).dataset.url

	FIRST_CHILD(dialog).src = url

	document.documentElement.dataset.noscroll = ''
	dialog.showModal()
}

function reset_img(event)
{
	FIRST_CHILD(T(event)).removeAttribute('src')
}

function Content({ post })
{
	const box = useRef()

	useEffect(() =>
	{
		const dialog = LAST_CHILD(C(box))
		const find_active_anchor_fn = BIND(find_active_anchor, box)
		const preview_media_fn = BIND(preview_media, dialog)

		const cleanup = []
		define(CLEANUP, cleanup.push(() => $1))dnl

		let anchor
		let media

		C(box).replaceChildren()
		C(box).insertAdjacentHTML('afterbegin', post)

		media = C(box).getElementsByTagName('img')
		anchor = find_active_anchor_fn()

		if (anchor)
			anchor.scrollIntoView()

		for (const img of media) {
			const btn = NEXT_SIBLING(img)

			img.draggable = 0

			if (!CLASSES(PARENT(img)).contains('image-wrapper'))
				continue

			btn.dataset.url = img.src

			ON_EVENT(btn, 'click', preview_media_fn)
			CLEANUP(IGNORE_EVENT(btn, 'click', preview_media_fn))
		}

		CLEANUP(PAGE_IGNORE_EVENT('hashchange', find_active_anchor_fn))

		PAGE_ON_EVENT('hashchange', find_active_anchor_fn)
		return () => cleanup.forEach(c => c())
	}, [ post ])

RETURN_JSX_BEGIN
<div id='post' class='mx-auto mt-15 max-w-[60ch] font-post tracking-wide'>
  <div ref={ box }></div>
  <Dialog class='p-10 w-full h-[100dvh]' onclose={ reset_img }>
    <img class='m-auto max-h-full'/>
  </Dialog>
</div>
RETURN_JSX_END
}

export default function Post()
{
	const { params } = useRoute()
	const [ post, set_post ] = useState()
	const [ post_list, post_loading ] = useContext(PostListContext)
	const post_map = useContext(PostMapContext)

	const meta_loading = post_loading || !post_map
	const loading = meta_loading || !post

	useEffect(() =>
	{
		if (meta_loading)
			return

		const post_path = `${params.class}/${params.slug}`
		const post_pos = post_map[post_path]
		const post_meta = post_list[post_pos]

		if (!HAS_PROP(post_map, post_path)) {
			set_post(-1)
			return
		}

		fetch(post_meta.html).then(res => res.text())
				     .then(sanitize_post).then(set_post)
	}, [ meta_loading, params.class, params.slug ])

RETURN_JSX_BEGIN post == -1 ? (
<NotFoundDialog part='Slug' content={ params.slug }/>
) : (
<main class='relative'>
  <CenteredLoading { ...{ loading } }/>
  <Header>
    <GobackButton/>
  </Header>
{ post ? (
  <>
    <Content { ...{ post } }/>
    <div class='mt-10'>
      <div class='w-full h-[2px] select-none bg-zinc-300 dark:bg-neutral-400'>
      </div>
      <div class='mt-5 mx-auto max-w-[60ch] flex flex-col md:flex-row
                  justify-between gap-3'>
        <Field icon='IMAGES_GOOGLE_LICENSE_SVG'>CC-BY-NC-4.0</Field>
        <Field icon='IMAGES_GOOGLE_COPYRIGHT_SVG'>
          Jiamu Sun {'<39@barroit.sh>'}
        </Field>
      </div>
    </div>
  </>
) : undefined }
</main>
) RETURN_JSX_END
}
