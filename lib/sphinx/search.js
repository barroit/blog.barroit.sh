/* SPDX-License-Identifier: BSD-2-Clause */
/*
 * Copyright (c) 2007-2025 by the Sphinx team
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 *
 * At cc7c6f435ad3
 */
divert(-1)

/*
 * index file format version
 */
envversion?: num

/*
 * source doc name by doc position
 */
docnames: [ str, ... ]

/*
 * output file name by doc position
 */
filenames: [ str, ... ]

/*
 * main page title by doc position
 */
titles: [ str, ... ]

/*
 * title text -> list of [ doc_pos, anchor_id ]
 */
alltitles: { str: [ [ num, str | null ], ... ] }

/*
 * user defined term -> list of [ doc_pos, anchor_id, is_main ]
 */
indexentries: { str: [ [ num, str, unknown ], ... ] }

/*
 * stemmed body term -> doc position(s)
 */
terms: { str: num | [ num, ... ] }

/*
 * stemmed title term -> doc position(s)
 */
titleterms: { str: num | [ num, ... ] }

/*
 * object prefix -> list of [
 *	doc_pos,
 *	obj_type_pos,
 *	search_prio,
 *	resovled_anchor,
 *	obj_name,
 * ]
 *
 * search_prio: -1 | 0 | 1 | 2
 * resovled_anchor: str | '' | '-'
 *
 * for:
 *	py:function:: pkg.mod.fn
 *
 * object:
 *	type	py:function
 *	prefix	pkg.mod
 *	name	fn
 */
objects: { str: [ [ num, num, num, str, str ], ... ] }

/*
 * object type position -> [ domain, type, label ]
 *
 * where
 *	domain	"py" or "c"
 *	type	"function" or "class"
 *	label	human-facing type name from domain.get_type_name(...),
 */
objnames: { num: [ str, str, str ] }

/*
 * extra object type map emitted by Sphinx
 * searchtools.js does not use it
 */
objtypes?: { str: num }

define(TITLE_SCORE, 15)
define(TITLE_PARTIAL_SCORE, 7)

define(TERM_SCORE, 5)
define(TERM_PARTIAL_SCORE, 2)

define(OBJECT_SCORE, 11)
define(OBJECT_PARTIAL_SCORE, 6)

define(OBJECT_PRIO_SCORE, [[{ 0: 15, 1: 5, 2: -5 }]])
define(OBJECT_PRIO_FB_SCORE, 0)

divert(0)dnl

function normalize(str)
{
	return str.toLowerCase().trim()
}

function calc_score(scale, a, b)
{
	return Math.round((scale * a.length) / b.length)
}

function escape(str)
{
	return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')
}

function sort_res_fn(a, b)
{
	const score_a = a[4]
	const score_b = b[4]
	let title_a
	let title_b

	if (score_a != score_b)
		return score_a > score_b ? 1 : -1

	title_a = a[1].toLowerCase()
	title_b = b[1].toLowerCase()

	if (title_a == title_b)
		return 0

	return title_a > title_b ? -1 : 1
}

function split_query(query)
{
	const re = /[^\p{Letter}\p{Number}_\p{Emoji_Presentation}]+/gu
	const terms = query.split(re)

	return terms.filter(str => str)
}

function parse_query(terms, stem, stopwords)
{
	const include = new Set()
	const exclude = new Set()

	for (const term of terms) {
		let word

		if (stopwords.has(term) || term.match(/^\d+$/))
			continue

		word = stem(term)

		if (word[0] == '-')
			exclude.add(word.substr(1))
		else
			include.add(word)
	}

	return [ include, exclude ]
}

function eval_titles(ctx, query, index)
{
	for (const [ title, positions ] of Object.entries(index.alltitles)) {
		const title_lower = normalize(title)

		if (!title_lower.includes(query) ||
		    query.length < title.length / 2)
			continue

		for (const [ pos, anchor_id ] of positions) {
			const score = calc_score(TITLE_SCORE, query, title)
			const boost = +(index.titles[pos] == title)

			const same_title = index.titles[pos] == title
			const nest_title = `${index.titles[pos]} > ${title}`

			ctx.res.push([
				index.docnames[pos],
				same_title ? title : nest_title,
				anchor_id != null ? `#${anchor_id}` : '',
				null,
				score + boost,
				index.filenames[pos],
				'title',
			])
		}
	}
}

function eval_indexes(ctx, query, index)
{
	for (const [ term, indexes ] of Object.entries(index.indexentries)) {
		if (!term.includes(query) || query.length < term.length / 2)
			continue

		for (const [ pos, anchor_id, main ] of indexes) {
			const score = calc_score(100, query, term)
			const result = [
				index.docnames[pos],
				index.titles[pos],
				anchor_id ? `#${anchor_id}` : '',
				null,
				score,
				index.filenames[pos],
				'index',
			]

			if (main)
				ctx.res.push(result)
			else
				ctx.res_aux.push(result)
		}
	}
}

function eval_object(ctx, term, terms, index, prefix,
		     doc_pos, type_pos, prio_pos, anchor, name)
{
	const [ domain, type, label ] = index.objnames[type_pos]
	const title = index.titles[doc_pos]
	const fullname = ((prefix ? `${prefix}.` : '') + name).toLowerCase()

	let names
	let score
	let other
	let desc

	if (fullname.indexOf(term) < 0)
		return

	names = fullname.split('.')
	score = 0
	other = new Set(terms)

	if (fullname == term || names[names.length - 1] == term)
		score += OBJECT_SCORE
	else if (names[names.length - 1].indexOf(term) > -1)
		score += OBJECT_PARTIAL_SCORE

	other.delete(term)

	if (other.size > 0) {
		const haystacks = [ prefix, name, label, title ]
		const haystack = haystacks.join(' ').toLowerCase()

		for (const str of other) {
			if (haystack.indexOf(str) < 0)
				return
		}
	}

	if (anchor == '')
		anchor = fullname
	else if (anchor == '-')
		anchor = `${type}-${fullname}`

	desc = `${label}, in ${title}`

	if (HAS_PROP([[OBJECT_PRIO_SCORE]], prio_pos))
		score += OBJECT_PRIO_SCORE[prio_pos]
	else
		score += OBJECT_PRIO_FB_SCORE

	ctx.res.push([
		index.docnames[doc_pos],
		fullname,
		`#${anchor}`,
		desc,
		score,
		index.filenames[doc_pos],
		'object',
	])
}

function eval_objects(ctx, terms, index)
{
	const obj_ents = Object.entries(index.objects)

	for (const term of terms) {
		for (const [ prefix, objects ] of obj_ents) {
			for (const object of objects) {
				eval_object(ctx, term, terms,
					    index, prefix, ...object)
			}
		}
	}
}

function prep_eval_terms(words_map, score_map, word, index)
{
	const cands = []
	const terms_has_word = HAS_PROP(index.terms, word)
	const titleterms_has_word = HAS_PROP(index.titleterms, word)

	if (terms_has_word)
		cands.push([ index.terms[word], TERM_SCORE ])

	if (titleterms_has_word)
		cands.push([ index.titleterms[word], TITLE_SCORE ])

	if (word.length > 2) {
		const escaped = escape(word)

		if (!terms_has_word) {
			for (const term of Object.keys(index.terms)) {
				if (!term.match(escaped))
					continue

				cands.push([ index.terms[term],
					     TERM_PARTIAL_SCORE ])
			}
		}

		if (!titleterms_has_word) {
			for (const term of Object.keys(index.titleterms)) {
				if (!term.match(escaped))
					continue

				cands.push([ index.titleterms[term],
					     TITLE_PARTIAL_SCORE ])
			}
		}
	}

	for (let [ positions, score ] of cands) {
		if (!Array.isArray(positions))
			positions = [ positions ]

		for (const pos of positions) {
			if (!words_map.has(pos))
				words_map.set(pos, new Set())
			words_map.get(pos).add(word)

			if (!score_map.has(pos))
				score_map.set(pos, new Map())
			score_map.get(pos).set(word, score)
		}
	}
}

function eval_term(ctx, score_map, pos, words, include, exclude, index)
{
	let score
	let scores

	if (words.size != include.size) {
		const arr = [ ...include ]
		const filtered = arr.filter(term => term.length > 2)

		if (words.size != filtered.length)
			return
	}

	for (const term of exclude) {
		if (index.terms[term] == pos ||
		    index.titleterms[term] == pos ||
		    index.terms[term]?.includes(pos) ||
		    index.titleterms[term]?.includes(pos))
			return
	}

	scores = [ ...words ].map(str => score_map.get(pos).get(str))
	score = Math.max(...scores)

	ctx.res.push([
		index.docnames[pos],
		index.titles[pos],
		'',
		null,
		score,
		index.filenames[pos],
		'text'
	])
}

function eval_terms(ctx, include, exclude, index)
{
	const score_map = new Map()
	const words_map = new Map()

	for (const word of include)
		prep_eval_terms(words_map, score_map, word, index)

	for (const [ pos, words ] of words_map)
		eval_term(ctx, score_map, pos, words, include, exclude, index)
}

function search(query_dirty, index, stem, stopwords)
{
	const query = normalize(query_dirty)
	const query_terms = split_query(query)
	const unique_query_terms = new Set(query_terms)
	const [ include, exclude ] = parse_query(query_terms, stem, stopwords)

	const ctx = {}
	const seen = new Set()
	let out
	let res

	ctx.res = []
	ctx.res_aux = []

	eval_titles(ctx, query, index)
	eval_indexes(ctx, query, index)
	eval_objects(ctx, unique_query_terms, index)
	eval_terms(ctx, include, exclude, index)

	ctx.res.sort(sort_res_fn)
	ctx.res_aux.sort(sort_res_fn)

	res = [ ...ctx.res_aux, ...ctx.res ]

	for (let i = res.length - 1; i >= 0; i--) {
		const arr = res[i].slice(0, 4).concat([ res[i][5] ])
		const str = arr.map((v) => String(v)).join()

		if (seen.has(str))
			continue

		seen.add(str)
		out.push(res[i])
	}

	return out.reverse()
}
