dnl SPDX-License-Identifier: GPL-3.0-or-later
dnl
divert(-1)

define(RETURN_JSX_BEGIN, [[return (]])
define(RETURN_JSX_END, [[)]])

define(HOT, $2hover:$1 $2focus-visible:$1)
define(ACTIVE, $2active:$1)
define(FOCUS, $2focus:$1)
define(FOCUS_WITHIN, $2focus-within:$1)

define(GROUP_HOT, HOT($1, $2group-))
define(GROUP_ACTIVE, ACTIVE($1, $2group-))
define(GROUP_FOCUS, FOCUS($1, $2group-))
define(GROUP_FOCUS_WITHIN, FOCUS_WITHIN($1, $2group-))

define(PEER_HOT, HOT($1, $2peer-))
define(PEER_ACTIVE, ACTIVE($1, $2peer-))
define(PEER_FOCUS, FOCUS($1, $2peer-))
define(PEER_FOCUS_WITHIN, FOCUS_WITHIN($1, $2peer-))

define(DOC_NODE, document.documentElement)

define(APPEND_CLASS, if ($1.class) $1.class += ` ${$2}`; else $1.class = $2;)

define(CLASSES, $1.classList)

define(PARENT, $1.parentElement)

define(FIRST_CHILD, $1.firstElementChild)
define(LAST_CHILD, $1.lastElementChild)
define(TEXT, $1.textContent)

define(NEXT_SIBLING, $1.nextElementSibling)
define(PREV_SIBLING, $1.previousElementSibling)

define(_T, $1.target)
define(T, $1.currentTarget)
define(C, $1.current)

divert(0)dnl
