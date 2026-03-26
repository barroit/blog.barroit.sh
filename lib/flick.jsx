/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { createContext } from 'preact'
import { useContext, useEffect, useRef } from 'preact/hooks'

import shuffle from './shuffle.js'

export const FlickContext = createContext(undefined)

const default_handler = {
	pointerenter: new Map(),
	click: new Map(),
}

export function flick_init_handler(handler_map)
{
	handler_map.current = structuredClone(default_handler)
}

export function flick_on_event(handler_map, event)
{
	const handler_entries = handler_map.current[event.type]
	const fns = handler_entries.values()

	for (const fn of fns)
		fn(event)
}

function drop_handler(flick, key)
{
	flick.current.pointerenter.delete(key)
}

function pds_1d_fast(arr, min_dist, max_item)
{
	const ret = []
	const grid = new Map()
	let idx

	for (idx = 0; idx < arr.length && ret.length < max_item; idx++) {
		const val = arr[idx]
		const key = Math.floor(val / min_dist)

		if (grid.has(key))
			continue

		if (grid.has(key - 1)) {
			const neighbor = grid.get(key - 1)

			if (Math.abs(neighbor - val) < min_dist)
				continue
		}

		if (grid.has(key + 1)) {
			const neighbor = grid.get(key + 1)

			if (Math.abs(neighbor - val) < min_dist)
				continue
		}

		ret.push(val)
		grid.set(key, val)
	}

	return ret
}

function enable_flick(ctx, spans, picked)
{
	spans[picked[ctx.on]].style.opacity = 0.1
	ctx.on++

	if (ctx.on == picked.length)
		clearInterval(ctx.on_timer)
}

function disable_flick(ctx, spans, picked)
{
	spans[picked[ctx.off]].style.opacity = 1
	ctx.off++

	if (ctx.off == picked.length)
		clearInterval(ctx.off_timer)
}

async function on_pointerenter(box, idx_map)
{
	const spans = Array.from(box.current.children)
	const shuffled = shuffle(idx_map)

	const picked = pds_1d_fast(shuffled, 1, shuffled.length / 2)
	const ctx = { on: 0, off: 0 }

	ctx.on_timer = setInterval(enable_flick, 40, ctx, spans, picked)

	await new Promise(r => setTimeout(r, 120))

	ctx.off_timer = setInterval(disable_flick, 40, ctx, spans, picked)
}

function format_token(chr)
{

RETURN_JSX_BEGIN
<span class='duration-120'>{ chr }</span>
RETURN_JSX_END
}

export default function Flick({ children, ...props })
{
	const flick = useContext(FlickContext)
	const box = useRef()

	if (!Array.isArray(children))
		children = [ children ]

	const chars = children.join('').split('')
	const ws_regex = /\s/

	const idx_map = []
	let idx

	for (idx = 0; idx < chars.length; idx++) {
		if (ws_regex.test(chars[idx]))
			continue

		idx_map.push(idx)
	}

	const on_pointerenter_fn = BIND(on_pointerenter, box, idx_map)

	useEffect(() =>
	{
		if (!flick)
			return

		flick.current.pointerenter.set(box, on_pointerenter_fn)
		return BIND(drop_handler, flick, box)
	}, [])

	const token = chars.map(format_token)

RETURN_JSX_BEGIN
<span ref={ box } { ...props }
      onpointerenter={ flick ? undefined : on_pointerenter_fn }>
  { token }
</span>
RETURN_JSX_END
}
