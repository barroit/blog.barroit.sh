#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

import json
import os
import sqlite3

from sphinx.util.docutils import SphinxDirective

TAGS_MAP = 'tags_map'

ALIAS_QUERY = """
select tag.id, json_group_array(alias.name) as aliases
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

		cls = doc.split(os.sep)[0]
		ids = self.arguments[0].split(',')
		db = resolve_db()

		ids.append(cls)

		for id in ids:
			id = id.strip()
			cur = db.execute(ALIAS_QUERY, [ id ])

			__res = cur.fetchone()
			res = dict(__res)
			aliases = json.loads(res['aliases'])

			tags.append(res['id'])
			tags.extend(aliases)

		return []
