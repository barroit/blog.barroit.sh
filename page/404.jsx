/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useLocation } from 'preact-iso'

import { NotFoundDialog } from '../lib/ux.jsx'

export default function NotFound()
{
	const { path } = useLocation()

RETURN_JSX_BEGIN
<NotFoundDialog part='Path' content={ path }/>
RETURN_JSX_END
}
