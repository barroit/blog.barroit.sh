/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

export default function SVG({ icon, ...props })
{
	APPEND_CLASS(props, 'mask-cover mask-(--mask) select-none')

RETURN_JSX_BEGIN
<div style={ { '--mask': `url(${icon})` } } { ...props }></div>
RETURN_JSX_END
}
