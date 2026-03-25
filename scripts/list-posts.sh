#!/bin/sh
# SPDX-License-Identifier: GPL-3.0-or-later

set -e

query=$(cat <<-EOF
select
   tag.id,
   tag.class,
   max(case when alias.role = 'master' then alias.name end) as master,
   max(case when alias.role = 'aux' then alias.name end) as aux,
   json_group_array(alias.name) filter (where alias.role is null) as aliases
from
   tag
left join
   alias
on
   tag.id = alias.tag
where
   tag.id = 
EOF
)

trap 'rm -f .tmp-$$' EXIT

while read src; do
	>.tmp-$$

	uri=$(printf $src | cut -d. -f1 | tr [:lower:]/- [:upper:]__)_FJSON
	path=$(printf $src | sed $1)

	class=$(printf $path | cut -d/ -f1)
	slug=$(printf $path | cut -d/ -f2 | cut -d. -f1)

	meta=$2/$class/$slug.*fjson
	title=$(cat $meta | jq -r .title)

	ids=$(grep -m1 '^.. tag:: ' $src | sed 's/^\.\. tag:://' | tr , ' ')

	for id in $ids $class; do
		printf "%s'%s'\n" "$query" $id | sqlite3 -json tag.db | \
		jq '.[0] | .aliases |= fromjson | .master //= .id' >>.tmp-$$
	done

	tag=$(jq -s . .tmp-$$)

	now=$(date +'%Y-%m-%dT%H:%M:%S%z')
	birth=$(git log --format=%aI --follow --diff-filter=A -- $src | tail -1)
	modify=$(git log --format=%aI -1 -- $src)

	if [ -n "$(git status --porcelain -- $src)" ]; then
		modify=$now
	fi

	birth=$(printf "$birth" | sed 's/:\([[:digit:]][[:digit:]]\)$/\1/')
	modify=$(printf "$modify" | sed 's/:\([[:digit:]][[:digit:]]\)$/\1/')

	birth=${birth:-$now}
	modify=${modify:-$now}

	cat <<-EOF | jq -c
	{
		"uri": "$uri",
		"class": "$class",
		"slug": "$slug",
		"title": "$title",
		"tag": $tag,
		"birth": "$birth",
		"modify": "$modify"
	}
	EOF
done
