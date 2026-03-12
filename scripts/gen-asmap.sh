#!/bin/sh
# SPDX-License-Identifier: GPL-3.0-or-later

set -e

printf 'divert(-1)\n\n'

while read uri; do
	name=$(printf $uri | sed $1)

	stem=$(printf $name | cut -d- -f1)
	ext=$(printf $name | cut -d. -f2)

	printf 'define('
	printf '%s_%s_%s' $2 $stem $ext | tr [[:lower:]]/ [[:upper:]]_
	printf ', %s)\n\n' $uri
done

printf 'divert(0)dnl\n'
