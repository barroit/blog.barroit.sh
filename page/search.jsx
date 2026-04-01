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

import {
	res_to_str,
	search_eval_indexes,
	search_eval_objects,
	search_eval_tags,
	search_eval_terms,
	search_eval_titles,
	search_init,
	search_reset,
	search_split,
	search_stem,
	search_yield,
} from '../lib/search.js'

const word_index_uri = document.body.dataset['wordIndex']

const search_parse = search_parser.parse.bind(search_parser)

function filter_tags(search_ctx, items, tag)
{
	const words = search_split(tag)
	const stems = search_stem(words)

	search_eval_tags(search_ctx, stems)

	const ___results = search_yield(search_ctx)
	const __results = ___results.map(res => res[3])
	const results = new Set(__results)
	const out = new Set()

	for (const item of items) {
		if (results.has(item[3]))
			out.add(item)
	}

	search_reset(search_ctx)
	return out
}

function filter_titles(search_ctx, items, title)
{
	const words = search_split(title)
	const stems = search_stem(words)

	search_eval_titles(search_ctx, title, stems)

	const ___results = search_yield(search_ctx)
	const __results = ___results.map(res => res[3])
	const results = new Set(__results)
	const out = new Set()

	for (const item of items) {
		if (results.has(item[3]))
			out.add(item)
	}

	search_reset(search_ctx)
	return out
}

function eval_filter(search_ctx, node, items)
{
	let left
	let right

	let words
	let stems

	let filtered
	const results = new Set()

	switch (node[0]) {
	case 'or':
		left = eval_filter(search_ctx, node[1], items)
		right = eval_filter(search_ctx, node[2], items)

		return left.union(right)
	case 'and':
		left = eval_filter(search_ctx, node[1], items)
		right = eval_filter(search_ctx, node[2], items)

		return left.intersection(right)
	case 'not':
		left = items
		right = eval_filter(search_ctx, node[1], items)

		return left.difference(right)
	case 'tag':
	case 'title':
		words = search_split(node[1])
		stems = search_stem(words)

		if (node[0] == 'tag')
			search_eval_tags(search_ctx, stems)
		else
			search_eval_titles(search_ctx, node[1], stems)

		filtered = search_yield(search_ctx)
		filtered = filtered.map(res => res[3])
		filtered = new Set(filtered)

		for (const item of items) {
			if (filtered.has(item[3]))
				results.add(item)
		}

		search_reset(search_ctx)
		return results
	default:
		throw new Error(`unknown filter: ${node[0]}`)
	}

}

function search_input(ctx, input, word_index)
{
	const [ fuzzy, filter ] = search_parse(input)
	const search_ctx = search_init(word_index)

	if (fuzzy) {
		const words = search_split(fuzzy)
		const stems = search_stem(words)

		ctx.query = stems

		search_eval_tags(search_ctx, stems)
		search_eval_titles(search_ctx, fuzzy, stems)
		search_eval_indexes(search_ctx, fuzzy)
		search_eval_objects(search_ctx, words)
		search_eval_terms(search_ctx, stems)
	} else {
		search_ctx.res = ctx.post_list.map(post => ([
			`${post.class}/${post.slug}`,
			undefined,
			undefined,
			post.title,
			'',
			undefined,
		]))
		ctx.query = [ '' ]
	}

	const __results = search_yield(search_ctx)
	const results = new Set(__results)
	let filtered = results

	if (filter) {
		search_reset(search_ctx)
		filtered = eval_filter(search_ctx, filter, results)
	}

	return [ ...filtered ]
}

function search(ctx, word_index, event)
{
	const input = event.target.value
	let data

	if (input) {
		data = [ undefined, undefined, undefined ]
		data[0] = input

		try {
			data[1] = search_input(ctx, input, word_index)
		} catch ({ name, message }) {
			data[2] = message
		}
	}

	ctx.set_data(data)
}

function resolve_anchor_summary(anchor, text, text_meta)
{
	const { off, len } = text_meta.find(info => info.anchor == anchor)

	return text.slice(off, off + len)
}

function resolve_summary(query, anchor, [ text, text_meta ])
{
	if (text_meta)
		return resolve_anchor_summary(anchor, text, text_meta)

	const __text = text.toLowerCase()
	const __base = query.map(term => __text.indexOf(term))
			    .filter(i => i > -1)
	const base = __base[__base.length - 1]

	let begin = base
	let end = base

	for (; begin > 0 && text[begin] != '\n'; begin--);
	for (; end < text.length && text[end] != '\n'; end++);

	return text.slice(begin, end)
}

function Result({ ctx, match })
{
	/*
	 * lib/sphinx/search.js:89
	 */
	const [ docname, type, _, title, anchor, __summary ] = match
	const uri = `/post/${docname}${anchor}`
	let [ summary, set_summary ] = useState(__summary)

	useEffect(() =>
	{
		if (summary)
			return

		const pos = C(ctx).post_map[docname]
		const meta = C(ctx).post_list[pos]

		const resolve_summary_fn = BIND(resolve_summary,
						C(ctx).query, anchor.slice(1))
		const tasks = []

		tasks.push(fetch(meta.text).then(res => res.text()))

		if (anchor)
			tasks.push(fetch(meta.block).then(res => res.json()))

		Promise.all(tasks).then(resolve_summary_fn).then(set_summary)
	}, [])

	if (summary && summary.length > 180)
		summary = summary.slice(0, 180) + '...'

RETURN_JSX_BEGIN summary ? (
<a href={ uri } class='group p-2 max-w-fit block'>
  <div class='flex gap-2 items-baseline'>
    <span class='truncate min-w-0 transition origin-right
                 GROUP_HOT(scale-105) GROUP_HOT(-translate-1)'>
      { title }
    </span>
  { type ? (
    <span class='text-xs text-zinc-500'>({ type })</span>
  ) : undefined }
  </div>
  <p class='mt-2 ml-[4ch] text-sm text-zinc-600'>{ summary }</p>
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

function Input({ ctx, error })
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
  <label for='search-input' data-error={ error }
         class='group flex-1 p-3 flex rounded-md outline-2
                transition bg-gray-100 shadow-sm outline-transparent
                FOCUS_WITHIN(outline-luka-pink) data-error:outline-red-500'>
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

function Panel({ word_index, post_list, post_map })
{
	const ctx = useRef()
	const [ data, set_data ] = useState()
	const fmt_key = (res) => res_to_str(res) + `,${String(res[5])}`

	if (!C(ctx)) {
		C(ctx) = {}

		C(ctx).post_list = post_list
		C(ctx).post_map = post_map

		C(ctx).__search = BIND(search, C(ctx), word_index)
		C(ctx).search = debounce(C(ctx).__search, 239)

		C(ctx).set_data = set_data
	}

	useEffect(() =>
	{
		const input = document.getElementById('search-input')

		input.value = '-tag miku -or -title 初音ミク -not -tag concert'
		input.value = '-tags s'
		input.dispatchEvent(new Event('input', { bubbles: true }))
	}, [])

	const error = data && data[2]
	const matches = data && data[1]

RETURN_JSX_BEGIN
<div class='mx-auto max-w-[60ch] flex flex-col items-center'>
  <Input { ...{ ctx, error } }/>
{ data ? (
  <div class='mt-2 w-full space-y-5'>
    <div class='px-2 flex justify-end text-sm text-zinc-700'>
    { !error ? (
      <div>
        <span class='font-bold'>{ data[1].length } </span>
        <span>match{ data[1].length < 2 ? '' : 'es' }</span>
      </div>
    ) : (
      <p>{ error }</p>
    ) }
    </div>
    <div class='w-full px-4 space-y-6'>
    { !error ? matches.map(match => (
      <Result key={ fmt_key(match) } { ...{ ctx, match } }/>
    )) : undefined }
    </div>
  </div>
) : undefined }
</div>
RETURN_JSX_END
}

function goto_manual()
{
	const domain = 'https://docs.barroit.sh'
	const page = `${domain}/blog.barroit.sh/section/querying.html`

	window.open(page, '_blank')
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
    <Button onclick={ goto_manual }>manual</Button>
  </Header>
{ post_list && !loading ? (
  <Panel { ...{ word_index, post_list, post_map } }/>
) : undefined }
</main>
RETURN_JSX_END
}
