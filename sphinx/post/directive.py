#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

from sphinx.util.docutils import SphinxDirective

TAG_IDS_MAP = 'tag_ids_map'

def tag_init_ids_map(app):
	if not hasattr(app.env, TAG_IDS_MAP):
		setattr(app.env, TAG_IDS_MAP, {})

def tag_get_ids_map(env):
	return getattr(env, TAG_IDS_MAP)

class tag_directive(SphinxDirective):
	has_content = False
	required_arguments = 1
	final_argument_whitespace = True

	def run(self):
		env = self.env
		doc = env.docname

		map = tag_get_ids_map(env)
		tags = map.get(doc)

		if tags is None:
			tags = []
			map[doc] = tags

		tag_arr = self.arguments[0].split(',')

		for tag_str in tag_arr:
			tag = tag_str.strip()

			# FIXME: tag is id, read name from db
			#        https://chatgpt.com/c/
			#        68a40697-85f0-832e-983a-e38748a735fd
			tags.append(tag)

		return []
