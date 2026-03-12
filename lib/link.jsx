/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useContext, useEffect, useRef } from 'preact/hooks'

import { ShellContext } from './shell.jsx'

function on_click(event)
{
	event.stopPropagation()
}

function on_shell_click(link, event)
{
	link.current.click()
}

function drop_effect(shell, key)
{
	shell.current.click.delete(key)
}

export function LinkIntern({ children, node, ...props })
{
	const shell = useContext(ShellContext)
	let link = useRef()

	if (node)
		link = node

	useEffect(() =>
	{
		if (!shell)
			return

		const on_shell_click_fn = on_shell_click.bind(undefined, link)
		const drop_effect_fn = drop_effect.bind(undefined, shell, link)

		shell.current.click.set(link, on_shell_click_fn)
		return drop_effect_fn
	}, [])

RETURN_JSX_BEGIN
<a ref={ link } onclick={ shell ? on_click : undefined } { ...props }>
  { children }
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

export function ExternMark({ children, ...props })
{
	APPEND_CLASS(props, 'after:content-["↗"] after:ml-1')

RETURN_JSX_BEGIN
<span { ...props }>
  { children }
</span>
RETURN_JSX_END
}
