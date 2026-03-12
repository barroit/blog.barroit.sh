/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useState, useEffect } from 'preact/hooks'

function test_mobile()
{
	const media = window.matchMedia('(pointer: coarse)')

	return +media.matches
}

export default function useMobile()
{
	const [ mobile, set_mobile ] = useState(test_mobile)

	useEffect(() =>
	{
		const media = window.matchMedia('(pointer: coarse)')
		const onchange = (event) => set_mobile(+event.matches)

		media.addEventListener('change', onchange)
		return () => media.removeEventListener('change', onchange)
	}, [])

	return mobile
}
