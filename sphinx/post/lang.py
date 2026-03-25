#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later
#
# For the js side, zh uses english stemmer and stopwords, and ja uses the
# default stemmer with no stopword as it doesn't stem words, it just split text.
# Also, as for the sphinx v9.1.0, no language search defines a splitter for the
# js side.

import re

from sphinx.search import SearchLanguage
from sphinx.search.en import SearchEnglish
from sphinx.search.ja import SearchJapanese
from sphinx.search.zh import SearchChinese

LANG_EN = 1
LANG_JA = 2
LANG_ZH = 3

latin_re = re.compile(r'^[A-Za-z0-9_]+$')

def is_hira(ch):
	return '\u3040' <= ch <= '\u309f'

def is_kata(ch):
	if '\u30a0' <= ch <= '\u30ff':
		return True
	elif '\uff66' <= ch <= '\uff9f':
		return True
	else:
		return False

def is_han(ch):
	if '\u3400' <= ch <= '\u4dbf':
		return True
	elif '\u4e00' <= ch <= '\u9fff':
		return True
	elif '\uf900' <= ch <= '\ufaff':
		return True
	else:
		return False

def is_latin(ch):
	if not ch.isascii():
		return False
	elif ch.isalnum():
		return True
	else:
		return ch == '_'

def is_latin_word(word):
	return latin_re.match(word) is not None

def resolve_lang(ch):
	if is_latin(ch):
		return LANG_EN
	elif is_hira(ch) or is_kata(ch):
		return LANG_JA
	elif is_han(ch):
		return LANG_ZH
	else:
		return None

def add_words(dst, seen, words):
	i = 0

	while i < len(words):
		word = words[i]

		if word not in seen:
			seen.add(word)
			dst.append(word)

		i += 1

def split_by_lang(text, lang, langs):
	if lang == LANG_EN:
		return langs.en.split(text)
	elif lang == LANG_JA:
		return langs.ja.split(text)
	elif lang == LANG_ZH:
		out = []
		seen = set()

		words = langs.ja.split(text)
		add_words(out, seen, words)

		words = langs.zh.split(text)
		add_words(out, seen, words)

		return out
	else:
		return []

def flush_words(langs, out, seen, buf, lang):
	text = ''.join(buf)
	words = split_by_lang(text, lang, langs)

	add_words(out, seen, words)
	buf.clear()

class mixed_lang(SearchLanguage):
	lang = 'mixed'
	language_name = 'Mixed'

	js_stemmer_rawcode = 'english-stemmer.js'
	stopwords = SearchEnglish.stopwords

	def __init__(self, options):
		SearchLanguage.__init__(self, options)

		self.en = SearchEnglish(options)
		self.ja = SearchJapanese(options)
		self.zh = SearchChinese(options)

	def split(self, text):
		out = []
		seen = set()

		buf = []
		lang = None
		i = 0

		while i < len(text):
			ch = text[i]
			cur = resolve_lang(ch)

			if buf and cur != lang:
				flush_words(self, out, seen, buf, lang)
				lang = None

			if cur:
				if not buf:
					lang = cur

				buf.append(ch)

			i += 1

		if buf:
			flush_words(self, out, seen, buf, lang)

		return out

	def stem(self, word):
		if not is_latin_word(word):
			return word

		# zh stemmer calls en stemmer, and has short technical terms and
		# acronyms protection.
		return self.zh.stem(word)

	def word_filter(self, stemmed):
		if is_latin_word(stemmed):
			return self.en.word_filter(stemmed)

		# ja and zh do this.
		return len(stemmed) > 1
