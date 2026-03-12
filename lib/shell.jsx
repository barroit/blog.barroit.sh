/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { createContext } from 'preact'
import { useRef } from 'preact/hooks'

export const ShellContext = createContext(undefined)
const handler_init = {
	pointerenter: new Map(),
	click: new Map(),
}

function on_event(handler_map, event)
{
	const handler_ents = handler_map.current[event.type]
	const fns = handler_ents.values()

	for (const fn of fns)
		fn(event)
}

export default function Shell({ children, color = 'MIKU_PINK',
				left = '[', right = ']', move = 5, ...props })
{
	const handler_map = useRef()
	const on_event_fn = on_event.bind(undefined, handler_map)

	if (!handler_map.current)
		handler_map.current = structuredClone(handler_init)

	APPEND_CLASS(props, 'group/shell relative')

RETURN_JSX_BEGIN
<div onclick={ on_event_fn } onpointerenter={ on_event_fn } { ...props }>
  <div class='before:absolute before:right-full before:content-[attr(data-left)]
              before:text-(--color) before:transition-[padding]
              group-hover/shell:before:pr-[calc(var(--spacing)*var(--move))]
              group-active/shell:before:pr-[calc(var(--spacing)*var(--move))]
              after:absolute after:left-full after:content-[attr(data-right)]
              after:text-(--color) after:transition-[padding]
              group-hover/shell:after:pl-[calc(var(--spacing)*var(--move))]
              group-active/shell:after:pl-[calc(var(--spacing)*var(--move))]'
       data-left={ left } data-right={ right }
       style={ { '--move': move, '--color': color } }>
    <ShellContext value={ handler_map }>
      { children }
    </ShellContext>
  </div>
</div>
RETURN_JSX_END
}
