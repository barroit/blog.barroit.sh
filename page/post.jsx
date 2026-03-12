/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useRoute } from 'preact-iso'

export default function Post()
{
	const { params } = useRoute()

	console.log(params)
}
