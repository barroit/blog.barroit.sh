#!/bin/sh
# SPDX-License-Identifier: GPL-3.0-or-later

set -e

digest=$(openssl dgst -sha256 -binary $1)
unique=$(printf %s "$digest" | base64 | tr '+/' '_-' | tr -d '=-' | cut -c1-8)

stem=$(basename $1 | cut -d. -f1)
ext=$(basename $1 | cut -d. -f2)

rm -f $2/$stem-*.$ext
ln $1 $2/$stem-$unique.$ext
