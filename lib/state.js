/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useState } from 'preact/hooks'

function set_state(val, __set_state, key)
{
	if (typeof val == 'function') {
		__set_state(prev =>
		{
			const next = val(prev)
			const str = JSON.stringify(next)

			localStorage.setItem(key, str)
			return next
		})

	} else {
		const str = JSON.stringify(val)

		__set_state(val)
		localStorage.setItem(key, str)
	}
}

export default function useCachedState(init, key)
{
	const [ state, __set_state ] = useState(init)
	const set_state_fn = val => set_state(val, __set_state, key)

	return [ state, set_state_fn ]
}
