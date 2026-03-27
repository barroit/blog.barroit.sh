/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import Button from '../lib/button.jsx'

function onclick()
{
	navigation.navigate('/search')
}

export default function Header({ children, nosearch, ...props })
{
	APPEND_CLASS(props, 'mb-4 flex justify-between text-zinc-600')

RETURN_JSX_BEGIN
<header { ...props }>
  { children }
{ !nosearch ? (
  <Button { ...{ onclick } }>search</Button>
) : undefined }
</header>
RETURN_JSX_END
}
