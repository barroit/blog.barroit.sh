/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

export function history_return(route)
{
	if (!navigation.canGoBack) {
		route('/', 1)

	} else {
		const entries = navigation.entries()
		const next_idx = navigation.currentEntry.index
		const prev = entries[next_idx - 1]

		route(prev.url, 1)
	}
}
