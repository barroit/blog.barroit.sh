/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useContext } from 'preact/hooks'

import { PostListContext } from '../index.jsx'
import useMobile from '../lib/device.js'
import { CenteredLoading } from '../lib/ux.jsx'
import Header from './header.jsx'

function Field({ children, icon, ...props })
{
	APPEND_CLASS(props, 'flex items-center gap-x-2 text-zinc-800 text-sm')

RETURN_JSX_BEGIN
<div { ...props }>
  <img src={ icon } class='select-none h-4' draggable={ 0 }/>
  { children }
</div>
RETURN_JSX_END
}

function Post({ post })
{
	const mobile = useMobile()

	const href = `/post/${post.class}/${post.slug}`
	const date = new Date(post.modify)
	const cate = post.tag.find(tag => tag.class)

	/*
	 * toDateString
	 *	Thu Mar 26 2026
	 *
	 * toTimeString
	 *	08:17:30 GMT+0900 (Japan Standard Time)
	 */
	const date_str = date.toDateString()
	const time_str = date.toTimeString()

	const date_cols = date_str.split(' ')
	const time_cols = time_str.split(' ')

	const yr = date_cols[3]
	const mon = date_cols[1]
	const day = date_cols[2]

	const weekday = date_cols[0]
	const time = time_cols[0]
	const timezone = post.modify.split('+')[1]

	const placeholder = [ ...post.title ].slice(0, 4).join('')

RETURN_JSX_BEGIN
<li class='w-fit flex gap-x-9'>
{ !mobile ? (
  <div class='relative hidden md:block'>
    <p>{ mon } { day }</p>
    <p class='text-right text-sm text-zinc-500'>{ yr }</p>
    <div class='absolute left-2/3 bottom-5 w-[2px] h-7
                select-none bg-zinc-300'/>
  </div>
) : undefined }
  <a { ...{ href } } class='group pb-4 pr-4 *:not-first:ml-1'>
    <div class='relative'>
      <div class='absolute bottom-0 border-b-2 border-zinc-300'>
        <div class='text-lg invisible'>{ placeholder }</div>
      </div>
      <h2 class='text-lg origin-left transition-transform group-hover:scale-105
                 group-hover:-translate-y-1 group-hover:translate-x-1'>
        { post.title }
      </h2>
    </div>
    <div class='mt-4 grid grid-cols-2'>
      <Field icon='IMAGES_GOOGLE_FOLDER_SVG'>
        <p>{ cate.master }</p>
      </Field>
    { !mobile ? (
      <Field icon='IMAGES_GOOGLE_CALENDAR_TODAY_SVG'>
        <div>
          <span>{ weekday } { time } </span>
          <span class='text-zinc-500'>+{ timezone }</span>
        </div>
      </Field>
    ) : undefined }
    </div>
    <Field class='mt-3' icon='IMAGES_GOOGLE_SELL_SVG'>
      <div class='*:not-last:after:content-[","] space-x-[1ch]'>
      { post.tag.map(tag => tag.class ? undefined : (
        <span>{ tag.master }</span>
      )) }
      </div>
    </Field>
  { mobile ? (
    <Field class='mt-3' icon='IMAGES_GOOGLE_CALENDAR_TODAY_SVG'>
      <div>
        <span>{ weekday } { time } </span>
        <span class='text-zinc-500'>+{ timezone }</span>
      </div>
    </Field>
  ) : undefined }
  </a>
</li>
RETURN_JSX_END
}

export default function Posts()
{
	const post_list = useContext(PostListContext)
	const ready = post_list && post_list.length

RETURN_JSX_BEGIN
<main class='relative'>
{ !ready ? (
  <CenteredLoading loading={ post_list && !post_list.length }/>
) : undefined }
  <Header>
    <div class='hidden md:block'></div>
  </Header>
{ post_list ? (
  <ul class='mt-6 md:mt-0 space-y-10'>
  { post_list.map(post => (
    <Post { ...{ post } } />
  )) }
  </ul>
) : undefined }
</main>
RETURN_JSX_END
}
