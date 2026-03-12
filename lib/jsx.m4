dnl SPDX-License-Identifier: GPL-3.0-or-later
dnl
divert(-1)

define(RETURN_JSX_BEGIN, [[return (]])
define(RETURN_JSX_END, [[)]])

define(MIKU_PINK, var(--color-miku-pink))
define(MIKU_CYAN, var(--color-miku-cyan))

define(HOT, $2hover:$1 $2focus-visible:$1)
define(ACTIVE, $2active:$1)

define(GROUP_HOT, HOT($1, $2group-))
define(GROUP_ACTIVE, ACTIVE($1, $2group-))

define(APPEND_CLASS, if ($1.class) $1.class += ` ${$2}`; else $1.class = $2;)

define(PARENT_OF, $1.parentElement)

define(CHILD_OF, $1.firstChild)
define(LAST_CHILD_OF, $1.lastChild)
define(CHILD_TEXT_OF, CHILD_OF($1).textContent)

define(NEXT_SIBLING_OF, $1.nextSibling)
define(PREV_SIBLING_OF, $1.previousSibling)

divert(0)dnl
