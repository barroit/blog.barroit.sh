#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

from sphinxcontrib.serializinghtml import JSONHTMLBuilder

from .index import tag_index

class post_builder(JSONHTMLBuilder):
	name = 'post'

	def prepare_writing(self, docs):
		JSONHTMLBuilder.prepare_writing(self, docs)

		options = self.config.html_search_options
		scorer = self.config.html_search_scorer
		self.indexer = tag_index(self.env, 'mixed', options, scorer)

		self.load_indexer(docs)
