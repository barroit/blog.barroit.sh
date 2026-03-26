/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { createContext } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

import Flick, {
	FlickContext,
	flick_init_handler,
	flick_on_event,
} from './flick.jsx'

export default function Button({ children, onclick, ...props })
{
	const handler_map = useRef()
	const box = useRef()
	const on_event_fn = BIND(flick_on_event, handler_map)

	if (!handler_map.current)
		flick_init_handler(handler_map)

	APPEND_CLASS(props, 'p-1 cursor-pointer')
	props.onclick = on_event_fn
	props.onpointerenter = on_event_fn

	useEffect(() =>
	{
		handler_map.current.click.set(box, onclick)
	}, [])

RETURN_JSX_BEGIN
<button ref={ box } { ...props }>
  <FlickContext value={ handler_map }>
      <Flick>{ children }</Flick>
  </FlickContext>
</button>
RETURN_JSX_END
}
