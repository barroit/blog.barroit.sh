/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

function __onclose(other, event)
{
	let use_default = 1

	if (other)
		use_default = other(event)

	if (use_default)
		delete DOC_NODE.dataset.noscroll
}

function __onclick(other, event)
{
	let use_default = 1

	if (other)
		use_default = other(event)

	if (use_default)
		T(event).close()
}

export default function Dialog({ children, ...props })
{
	props.onclose = BIND(__onclose, props.onclose)
	props.onclick = BIND(__onclick, props.onclick)

	APPEND_CLASS(props, 'open:flex')

RETURN_JSX_BEGIN
<dialog { ...props }>
  { children }
</dialog>
RETURN_JSX_END
}
