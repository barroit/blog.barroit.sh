/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useContext } from 'preact/hooks'

import { PostListContext } from '../index.jsx'
import SVG from '../lib/svg.jsx'
import { CenteredLoading } from '../lib/ux.jsx'
import Header from './header.jsx'
import Credit from './credit.jsx'

function Field({ children, icon, ...props })
{
	APPEND_CLASS(props, 'flex items-center gap-x-2 \
			     text-zinc-800 dark:text-zinc-200 text-sm')

RETURN_JSX_BEGIN
<div { ...props }>
  <SVG { ...{ icon } } class='shrink-0 size-4 bg-zinc-800 dark:bg-zinc-200'/>
  { children }
</div>
RETURN_JSX_END
}

function Post({ post })
{
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
	const [ _, ...tags ] = post.tag

RETURN_JSX_BEGIN
<li class='w-fit flex gap-x-9'>
  <div class='relative hidden md:block'>
    <p>{ mon } { day }</p>
    <p class='text-right text-sm text-zinc-500 dark:text-neutral-400'>{ yr }</p>
    <div class='absolute left-2/3 bottom-5 w-[2px] h-7
                select-none bg-zinc-300 dark:bg-neutral-400'></div>
  </div>
  <a { ...{ href } } class='group pb-4 pr-4 *:not-first:ml-1'>
    <div class='relative'>
      <div class='absolute bottom-0 border-b-2
                  border-zinc-300 dark:border-neutral-400'>
        <div class='text-lg invisible'>{ placeholder }</div>
      </div>
      <h2 class='text-lg origin-left transition-transform GROUP_HOT(scale-105)
                 GROUP_HOT(-translate-y-1) GROUP_HOT(translate-x-1)'>
        { post.title }
      </h2>
    </div>
    <div class='mt-4 grid grid-cols-2'>
      <Field icon='IMAGES_GOOGLE_FOLDER_SVG'>
        <p>{ cate.master }</p>
      </Field>
      <Field icon='IMAGES_GOOGLE_CALENDAR_TODAY_SVG' class='hidden md:flex'>
        <div>
          <span>{ weekday } { time } </span>
          <span class='text-zinc-500 dark:text-neutral-400'>+{ timezone }</span>
        </div>
      </Field>
    </div>
    <Field class='mt-3' icon='IMAGES_GOOGLE_SELL_SVG'>
      <div>
      { tags.length ? tags.map(tag => (
        <>
          <span>{ tag.master }</span>
          <span class='last:hidden'>, </span>
        </>
      )) : (
        <p>ε</p>
      ) }
      </div>
    </Field>
    <Field class='mt-3 md:hidden' icon='IMAGES_GOOGLE_CALENDAR_TODAY_SVG'>
      <div>
        <span>{ weekday } { time } </span>
        <span class='text-zinc-500 dark:text-neutral-400'>+{ timezone }</span>
      </div>
    </Field>
  </a>
</li>
RETURN_JSX_END
}

export default function Posts()
{
	const [ post_list, loading ] = useContext(PostListContext)

RETURN_JSX_BEGIN
<main class='relative'>
  <CenteredLoading { ...{ loading } }/>
  <Header>
    <div></div>
  </Header>
  <ul class='mt-6 md:mt-0 space-y-10'>
  { post_list ? post_list.map(post => (
    <Post { ...{ post } } />
  )) : undefined }
  </ul>
  { post_list && !loading ? (
    <Credit/>
  ) : undefined }
</main>
RETURN_JSX_END
}
