/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useContext, useEffect, useRef } from 'preact/hooks'

import Flick from './flick.jsx'

export function LinkIntern({ children, ...props })
{

RETURN_JSX_BEGIN
<a { ...props }>
  <Flick>{ children }</Flick>
</a>
RETURN_JSX_END
}

export function LinkExtern({ children, ...props })
{

RETURN_JSX_BEGIN
<LinkIntern target='_blank' { ...props }>
  {children}
</LinkIntern>
RETURN_JSX_END
}

export function LinkExternMark({ children, ...props })
{
	APPEND_CLASS(props, 'after:content-["↗"] after:ml-1')

RETURN_JSX_BEGIN
<span { ...props }>
  { children }
</span>
RETURN_JSX_END
}
