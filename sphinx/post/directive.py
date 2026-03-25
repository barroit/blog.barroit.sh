#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

import sqlite3

from sphinx.util.docutils import SphinxDirective

TAGS_MAP = 'tags_map'

ALIAS_QUERY = """
	select tag.id, tag.class,
	       group_concat(alias.lang || ':' || alias.name) as aliases
	from tag left join alias on tag.id = alias.tag
	where tag.id = ?
"""

__db = None

def resolve_db():
	global __db

	if not __db:
		__db = sqlite3.connect('tag.db')
		__db.row_factory = sqlite3.Row

	return __db

def tag_init_map(app):
	if not hasattr(app.env, TAGS_MAP):
		setattr(app.env, TAGS_MAP, {})

def tag_get_map(env):
	return getattr(env, TAGS_MAP)

def format_aliases(aliases):
	arr = aliases.split(',')

	for idx, alias in enumerate(arr):
		arr[idx] = alias.split(':')

	return arr

class tag_directive(SphinxDirective):
	has_content = False
	required_arguments = 1
	final_argument_whitespace = True

	def run(self):
		env = self.env
		doc = env.docname

		map = tag_get_map(env)
		tags = map.get(doc)

		if tags is None:
			tags = []
			map[doc] = tags

		ids = self.arguments[0].split(',')
		db = resolve_db()

		for id in ids:
			id = id.strip()
			cur = db.execute(ALIAS_QUERY, [ id ])

			__res = cur.fetchone()
			res = dict(__res)
			names = [ [ 'en', res['id'] ] ]

			if res['aliases']:
				aliases = format_aliases(res['aliases'])

				names.extend(aliases)

			# FIXME store language -> tag in dom

			tags.extend([ name[1] for name in names ])

		return []
