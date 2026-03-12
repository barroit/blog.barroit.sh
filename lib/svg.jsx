/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

export default function SVGIcon({ src, ...props })
{
	APPEND_CLASS(props, 'rounded-full drop-shadow-sm select-none')

RETURN_JSX_BEGIN
<div { ...props }>
  <div class='mask-no-repeat mask-cover mask-(--mask)'
       style={ { '--mask': `url(${src})` } }></div>
</div>
RETURN_JSX_END
}
