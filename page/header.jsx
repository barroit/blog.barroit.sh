/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import Flick from '../lib/flick.jsx'

export default function Header({ children, nosearch, ...props })
{
	APPEND_CLASS(props, 'mb-4 flex justify-between \
			     text-zinc-600 dark:text-zinc-300')

RETURN_JSX_BEGIN
<header { ...props }>
  { children }
{ !nosearch ? (
  <a href='/search'
     class='p-1 transition-colors underline decoration-transparent
            HOT(decoration-black) HOT(decoration-white, dark:)'>
    <Flick>search</Flick>
  </a>
) : undefined }
</header>
RETURN_JSX_END
}
