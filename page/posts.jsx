/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useContext } from 'preact/hooks'

import { PostContext } from '../index.jsx'

function Loading({ loading, ...props })
{
	APPEND_CLASS(props, 'm-auto opacity-0 data-loading:opacity-100 \
			     animate-spin transition delay-50')

RETURN_JSX_BEGIN
<div class='flex'>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
       fill='none' stroke='currentColor' stroke-width='2'
       data-loading={ loading ? '' : undefined } { ...props }>
    <circle cx='12' cy='12' r='9' opacity='0.39'/>
    <circle cx='12' cy='12' r='9'
            stroke-dasharray='14 57' stroke-linecap='round'/>
  </svg>
</div>
RETURN_JSX_END
}

export default function Posts()
{
	const { post_list } = useContext(PostContext)

RETURN_JSX_BEGIN
<div class='relative'>
  <ul>
  { post_list && post_list.map(post => (
    <li>
      <h2>
        <a href={ `/post/${post.slug}` } class=''>{ post.title }</a>
      </h2>
    </li>
  )) }
  </ul>
  <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
    <Loading class='size-24 text-miku-cyan'
             loading={ post_list && !post_list.length }/>
  </div>
</div>
RETURN_JSX_END
}
