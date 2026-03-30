/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useContext, useEffect, useRef, useState } from 'preact/hooks'

import { PostListContext, PostMapContext } from '../index.jsx'
import { Button, GobackButton } from '../lib/button.jsx'
import debounce from '../lib/debounce.js'
import Dialog from '../lib/dialog.jsx'
import { CenteredLoading, NotFoundDialog } from '../lib/ux.jsx'
import Header from './header.jsx'

import __search, { res_to_str } from '../lib/sphinx/search.js'

const word_index_uri = document.body.dataset['wordIndex']

function search(ctx, word_index, event)
{
	const input = event.target.value
	let query

	if (input)
		query = __search(input, word_index)

	ctx.set_query(query)
}

function show_tip_dialog(event)
{
	DOC_NODE.dataset.noscroll = ''
	NEXT_SIBLING(T(event)).showModal()
}

function hide_tip_dialog(event)
{
	!PARENT(PARENT(T(event))).close()
}

function can_hide_tip_dialog(event)
{
	return !FIRST_CHILD(T(event)).contains(_T(event))
}

function resolve_anchor_summary(anchor, text, text_meta)
{
	const { off, len } = text_meta.find(info => info.anchor == anchor)

	return text.slice(off, off + len)
}

function resolve_summary(include, anchor, [ text, text_meta ])
{
	if (text_meta)
		return resolve_anchor_summary(anchor, text, text_meta)

	const __text = text.toLowerCase()
	const __base = [ ...include ].map(term => __text.indexOf(term))
				     .filter(i => i > -1)
	const base = __base[__base.length - 1]

	let begin = base
	let end = base

	for (; begin > 0 && text[begin] != '\n'; begin--);
	for (; end < text.length && text[end] != '\n'; end++);

	return text.slice(begin, end)
}

function Result({ include, match })
{
	/*
	 * lib/sphinx/search.js:89
	 */
	const [ docname, type, _, title, anchor, __summary ] = match
	const uri = `/post/${docname}${anchor}`

	const [ post_list ] = useContext(PostListContext)
	const post_map = useContext(PostMapContext)
	let [ summary, set_summary ] = useState(__summary)

	useEffect(() =>
	{
		if (summary)
			return

		const pos = post_map[docname]
		const meta = post_list[pos]

		const resolve_summary_fn = BIND(resolve_summary,
						include, anchor.slice(1))
		const tasks = []

		tasks.push(fetch(meta.text).then(res => res.text()))

		if (anchor)
			tasks.push(fetch(meta.block).then(res => res.json()))

		Promise.all(tasks).then(resolve_summary_fn).then(set_summary)
	}, [])

	if (summary && summary.length > 180)
		summary = summary.slice(0, 180) + '...'

RETURN_JSX_BEGIN summary ? (
<a href={ uri } class='block max-w-fit'>
  <div class='flex gap-2 items-baseline'>
    <span class='truncate min-w-0'>{ title }</span>
    <span class='text-xs text-zinc-500'>({ type })</span>
  </div>
  <p class='mt-2 ml-[4ch] text-sm'>{ summary }</p>
</a>
) : (
<div>
  <h2 class='truncate'>{ title }</h2>
  <div class='ml-[4ch] rounded-md bg-gray-200 animate-pulse'>
    <p class='invisible'>miku</p>
  </div>
</div>
) RETURN_JSX_END
}

function Results({ query: [ include, matches ] })
{
	const fmt_key = (res) => res_to_str(res) + `,${String(res[5])}`

RETURN_JSX_BEGIN
<div class='w-full px-4 space-y-8'>
{ matches.map(match => (
  <Result key={ fmt_key(match) } { ...{ include, match } }/>
)) }
</div>
RETURN_JSX_END
}

function Input({ ctx })
{
	const oninput = (event) =>
	{
		_T(event).style.height = 'auto'
		_T(event).style.height = `${_T(event).scrollHeight}px`
		C(ctx).search(event)
	}

	const textarea = {
		id: 'search-input',
		rows: '1',
		autocorrect: 'off',
		spellcheck: 0,
		oninput,
	}

RETURN_JSX_BEGIN
<div class='mt-5 w-full flex items-center gap-x-4'>
  <label for='search-input'
         class='group flex-1 p-3 flex rounded-md outline-2
                transition bg-gray-100 shadow-sm outline-transparent
                FOCUS_WITHIN(outline-luka-pink)'>
    <div class='size-6 bg-black mask-cover transition pointer-events-none
                mask-[url(IMAGES_GOOGLE_SEARCH_SVG)]
                GROUP_FOCUS_WITHIN(bg-miku-pink)'></div>
    <textarea { ...textarea }
              class='px-3 w-full outline-none resize-none
                     [caret-shape:underscore] caret-miku-cyan'></textarea>
  </label>
</div>
RETURN_JSX_END
}

function Panel({ word_index })
{
	const ctx = useRef({})
	const [ query, set_query ] = useState()

	useEffect(() =>
	{
		if (word_index) {
			C(ctx).__search = BIND(search, C(ctx), word_index)
			C(ctx).search = debounce(C(ctx).__search, 239)
			C(ctx).set_query = set_query
		}
	}, [ word_index ])

RETURN_JSX_BEGIN
<div class='mx-auto max-w-[60ch] flex flex-col items-center'>
  <Input { ...{ ctx } }/>
{ query ? (
  <div class='mt-2 w-full space-y-5'>
    <p class='pr-2 text-right text-sm text-zinc-700'>
      <span class='font-bold'>{ query[1].length } </span>
      <span>match{ query[1].length < 2 ? '' : 'es' }</span>
    </p>
    <Results { ...{ query } }/>
  </div>
) : undefined }
</div>
RETURN_JSX_END
}

function Syntax()
{
	const tips = [
		[ 'word', 'include this word' ],
		[ '-word', 'exclude this word' ],
		[ 'title:', 'search title terms', 'Document' ],
		[ 'tag:', 'search tag terms', 'miku' ],
		[ 'during:', 'search within a date range', '3/9/26-8/31/26' ],
	]

RETURN_JSX_BEGIN
<>
  <Button onclick={ show_tip_dialog }>syntax</Button>
  <Dialog onclick={ can_hide_tip_dialog } class='size-full bg-transparent'>
    <div class='relative m-auto p-8 max-w-90 rounded-lg bg-gray-100'>
      <dl>
      { tips.map(([ feat, desc, hint ]) => (
        <>
          <dt class='not-first:mt-6'>
            <span class='font-bold'>{ feat }</span>
            <span class='text-gray-400'>{ hint }</span>
          </dt>
          <dd class='ml-[4ch] mt-2 text-gray-600'>{ desc }</dd>
        </>
      )) }
      </dl>
      <p class='mx-auto mt-5 max-w-[30ch] text-sm font-bold text-zinc-800'>
        Filters are evaluated left to right. Order matters, like in find(1).
      </p>
      <Button onclick={ hide_tip_dialog }
              class='absolute top-3 right-3 text-zinc-600'>close</Button>
    </div>
  </Dialog>
</>
RETURN_JSX_END
}

export default function Search()
{
	const [ word_index, set_word_index ] = useState()
	const [ post_list, post_loading ] = useContext(PostListContext)
	const post_map = useContext(PostMapContext)
	const loading = !word_index || post_loading || !post_map

	useEffect(() =>
	{
		fetch(word_index_uri).then(res => res.json())
				     .then(set_word_index)
	}, [])

RETURN_JSX_BEGIN
<main class='relative'>
  <CenteredLoading { ...{ loading } }/>
  <Header nosearch>
    <GobackButton/>
    <Syntax/>
  </Header>
  <Panel { ...{ word_index } }/>
</main>
RETURN_JSX_END
}
