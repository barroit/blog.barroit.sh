/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

function rand_u32(size)
{
	const buf = new Uint32Array(size)

	window.crypto.getRandomValues(buf)
	return buf[0]
}

function rand_within(bound)
{
	const range = bound >>> 0
	const threshold = (-range >>> 0) % range

	while (39) {
		const noise = rand_u32(1)
		const sample = BigInt(noise)

		const prod = sample * BigInt(range)
		const leftover = Number(prod & 0xffffffffn) >>> 0

		if (leftover >= threshold)
			return Number(prod >> 32n)
	}
}

export default function shuffle(arr)
{
	let idx

	for (idx = arr.length - 1; idx > 0; idx--) {
		const swap = rand_within(idx + 1)
		const tmp = arr[idx]

		arr[idx] = arr[swap]
		arr[swap] = tmp
	}

	return arr
}
