dnl SPDX-License-Identifier: GPL-3.0-or-later
dnl
divert(-1)

define(BIND, $1.bind(undefined, [[shift($@)]]))

define(HAS_PROP, $1.hasOwnProperty($2))

define(ON_EVENT, $1.addEventListener($2, $3))
define(IGNORE_EVENT, $1.removeEventListener($2, $3))

define(PAGE_ON_EVENT, ON_EVENT(window, $@))
define(PAGE_IGNORE_EVENT, IGNORE_EVENT(window, $@))

define(NORMALIZE, $1.toLowerCase().trim())
define(ESCAPE, [[$1.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')]])

define(IS_ARR, Array.isArray($1))

define(MAX, Math.max($1))
define(MIN, Math.min($1))

divert(0)dnl
