/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useContext } from 'preact/hooks'

import { PostContext } from '../index.jsx'
import { CenteredLoading } from '../lib/ux.jsx'
import Header from './header.jsx'

function Master({ post_list })
{

RETURN_JSX_BEGIN
<ul>
{ post_list.map(post => (
  <li>
    <h2>
      <a href={ `/post/${post.class}/${post.slug}` } class=''>
        { post.title }
      </a>
    </h2>
  </li>
)) }
</ul>
RETURN_JSX_END
}

export default function Posts()
{
	const { post_list } = useContext(PostContext)

RETURN_JSX_BEGIN
<main class='relative'>
  <CenteredLoading loading={ post_list && !post_list.length }/>
  <Header>1</Header>
{ post_list ? (
  <Master { ...{ post_list } }/>
) : undefined }
</main>
RETURN_JSX_END
}
