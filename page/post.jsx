/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useRoute } from 'preact-iso'
import { useContext } from 'preact/hooks'

import { PostContext } from '../index.jsx'
import { NotFoundDialog } from './404.jsx'

export default function Post()
{
	const { params } = useRoute()
	const { slug } = params

	const { post_map } = useContext(PostContext)

RETURN_JSX_BEGIN
<div>
{ post_map && !HAS_PROP(post_map, slug) && (
  <NotFoundDialog part='Slug' content={ slug }/>
) }
</div>
RETURN_JSX_END
}
