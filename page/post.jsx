/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useRoute } from 'preact-iso'
import { useContext } from 'preact/hooks'

import { PostContext } from '../index.jsx'
import { CenteredLoading, NotFoundDialog } from '../lib/ux.jsx'

function Master({ post_list, post_map })
{
	const { params } = useRoute()
	const post_pos = post_map[params.slug]
	const post_meta = post_list[post_pos]

	console.log(HAS_PROP(post_map, params.slug))

RETURN_JSX_BEGIN
<div>
{ !HAS_PROP(post_map, params.slug) || post_meta.class != params.class ? (
  <NotFoundDialog part='Slug' content={ params.slug }/>
) : undefined }
</div>
RETURN_JSX_END
}

export default function Post()
{
	const { post_list, post_map } = useContext(PostContext)
	const ready = post_list && post_list.length && post_map
	const loading = post_list && (!post_list.length || !post_map)

RETURN_JSX_BEGIN
<main class={ loading ? 'relative' : '' }>
  <CenteredLoading { ...{ loading } }/>
{ ready ? (
  <Master { ...{ post_list, post_map } }/>
) : undefined }
</main>
RETURN_JSX_END
}
