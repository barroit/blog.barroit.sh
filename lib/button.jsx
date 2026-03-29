/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { createContext } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

import Flick from './flick.jsx'

export function Button({ children, ...props })
{
	APPEND_CLASS(props, 'p-1 transition-colors underline \
			     decoration-transparent hover:decoration-black')

RETURN_JSX_BEGIN
<button { ...props }>
  <Flick>{ children }</Flick>
</button>
RETURN_JSX_END
}

function goback()
{
	if (navigation.canGoBack)
		navigation.back()
	else
		navigation.navigate('/')
}

export function GobackButton()
{

RETURN_JSX_BEGIN
<Button onclick={ goback }>return</Button>
RETURN_JSX_END
}
