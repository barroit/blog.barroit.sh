/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

import Button from '../lib/button.jsx'

export default function Header({ children, ...props })
{
	APPEND_CLASS(props, 'mb-4 flex justify-between text-zinc-600')

RETURN_JSX_BEGIN
<header { ...props }>
  { children }
  <Button onclick={ () => {} }>search</Button>
</header>
RETURN_JSX_END
}
