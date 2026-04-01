#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

import json

from sphinx.search import IndexBuilder
from sphinx.search.en import SearchEnglish
from sphinx.search.ja import SearchJapanese
from sphinx.search.zh import SearchChinese

from .directive import tag_get_map

def gen_doc_index(titles):
	out = {}
	docs = sorted(titles)
	i = 0

	for doc in docs:
		out[doc] = i
		i += 1

	return out

def gen_doc_live_index(titles):
	out = {}

	for doc in titles:
		out[doc] = 1

	return out

def collect_tag_words(tag_map, titles, lang):
	out = []
	live_index = gen_doc_live_index(titles)

	for pos in tag_map:
		if pos not in live_index:
			continue

		tags = tag_map[pos]

		for tag in tags:
			words = lang.split(tag)

			for word in words:
				out.append((pos, word))

	return out

def gen_tag_index(tag_map, titles, lang):
	out = {}
	rows = collect_tag_words(tag_map, titles, lang)
	doc_index = gen_doc_index(titles)

	for row in rows:
		pos = row[0]
		word = row[1]
		stemmed = lang.stem(word)

		docs = out.get(stemmed)

		if docs is None:
			docs = {}
			out[stemmed] = docs

		docs[doc_index[pos]] = 1

	return out

def freeze_tag_index(index):
	out = {}
	keys = sorted(index)

	for key in keys:
		docs = sorted(index[key])

		if len(docs) == 1:
			out[key] = docs[0]
		else:
			out[key] = docs

	return out

class tag_index(IndexBuilder):
	def __init__(self, env, lang, options, scoring):
		IndexBuilder.__init__(self, env, lang, options, scoring)
		self.tag_map = tag_get_map(env)

	def freeze(self):
		data = IndexBuilder.freeze(self)
		index = gen_tag_index(self.tag_map, self._titles, self.lang)

		data['tags'] = freeze_tag_index(index)
		return data
