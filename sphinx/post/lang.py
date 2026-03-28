#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later
#
# sphinx v9.1.0 @cc7c6f435ad3:
#
#	stem		split		word_filter	stopwords
#
# en	snowball	parent		parent		yes
# ja	none		TinySegmenter	len > 1		no
# zh	== en*		none		len > 1		== en
#
# Use zh.stem, it's the enhanced version of en.

import re

from sphinx.search import SearchLanguage
from sphinx.search.en import SearchEnglish
from sphinx.search.ja import SearchJapanese
from sphinx.search.zh import SearchChinese

class mixed_lang(SearchLanguage):
	lang = 'mixed'
	language_name = 'Mixed'
	stopwords = SearchEnglish.stopwords

	def __init__(self, options):
		SearchLanguage.__init__(self, options)

		self.ja = SearchJapanese(options)
		self.zh = SearchChinese(options)

	def split(self, text):
		words = set()

		words.update(SearchLanguage.split(self, text))
		words.update(self.ja.split(text))

		return list(words)

	def stem(self, word):
		return self.zh.stem(word)

	def word_filter(self, word):
		return SearchLanguage.word_filter(self, word) and len(word) > 1
