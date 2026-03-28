/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

function __debounce(timer, fn, delay, ...args)
{
	clearTimeout(timer.id)

	fn = BIND(fn, ...args)
	timer.id = setTimeout(fn, delay)
}

export default function debounce(fn, delay)
{
	const timer = {}

	return BIND(__debounce, timer, fn, delay)
}
