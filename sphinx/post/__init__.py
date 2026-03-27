#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

from .builder import post_builder
from .directive import tag_init_map, tag_get_map, tag_directive
from .lang import mixed_lang

def purge_doc(app, env, doc):
	map = tag_get_map(env)

	if map and doc in map:
		del map[doc]

def merge_info(app, env, docs, other):
	dst = tag_get_map(env)
	src = tag_get_map(other)

	for doc in docs:
		tags = src.get(doc)

		if not tags:
			continue

		dst[doc] = list(tags)

def setup(app):
	app.connect('builder-inited', tag_init_map)
	app.add_directive('tag', tag_directive)

	app.add_search_language(mixed_lang)
	app.add_builder(post_builder)

	app.connect('env-purge-doc', purge_doc)
	app.connect('env-merge-info', merge_info)

	return {
		'parallel_read_safe': 1,
		'parallel_write_safe': 1,
	}
