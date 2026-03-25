#!/bin/sh
# SPDX-License-Identifier: GPL-3.0-or-later

set -e

printf 'divert(-1)\n\n'

while read uri; do
	name=$(printf $uri | sed $1)

	stem=${name%-*}
	ext=${name##*.}

	printf 'define('
	printf '%s_%s' $stem $ext | tr [:lower:]/- [:upper:]__
	printf ', %s)\n\n' $uri
done

printf 'divert(0)dnl\n'
