dnl SPDX-License-Identifier: GPL-3.0-or-later
dnl
divert(-1)

define(HOST, ifdef([[DEV]], DEV, https://blog.barroit.sh))
define(R, [[HOST]]$1)

divert(0)dnl
