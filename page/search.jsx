/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import { useEffect, useState } from 'preact/hooks'

import Button from '../lib/button.jsx'
import Header from './header.jsx'

const word_index_uri = document.body.dataset['wordIndex']

function go_back()
{
	if (navigation.canGoBack)
		navigation.back()
	else
		navigation.navigate('/')
}

export default function Search()
{
	const [ word_index, set_word_index ] = useState()

	useEffect(() =>
	{
		fetch(word_index_uri).then(res => res.json())
				     .then(set_word_index)
	}, [])

RETURN_JSX_BEGIN
<main>
  <Header nosearch>
    <Button onclick={ go_back }>return</Button>
  </Header>
</main>
RETURN_JSX_END
}
