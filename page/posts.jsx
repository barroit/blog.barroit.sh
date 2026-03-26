/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useContext } from 'preact/hooks'

import { PostContext } from '../index.jsx'
import { CenteredLoading } from '../lib/ux.jsx'

export default function Posts()
{
	const { post_list } = useContext(PostContext)

RETURN_JSX_BEGIN
<main class='relative'>
  <ul>
  { post_list ? post_list.map(post => (
    <li>
      <h2>
        <a href={ `/post/${post.class}/${post.slug}` } class=''>
          { post.title }
        </a>
      </h2>
    </li>
  )) : undefined }
  </ul>
  <CenteredLoading loading={ post_list && !post_list.length }/>
</main>
RETURN_JSX_END
}
