/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
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
alltitles: { str: [ [ num, str ], ... ] }

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

/*
 * [ docname, type, score, title, anchor, summary ]
 *
 * empty anchor means top level title
 */
result: [ str, str, number, str, str, str | undefined ]

define(TITLE_SCORE, 15)
define(TITLE_PARTIAL_SCORE, 7)

define(TERM_SCORE, 5)
define(TERM_PARTIAL_SCORE, 2)

define(TAG_SCORE, 17)
define(TAG_PARTIAL_SCORE, 9)

define(OBJECT_SCORE, 11)
define(OBJECT_PARTIAL_SCORE, 6)

define(OBJECT_PRIO_SCORE, [[{ 0: 15, 1: 5, 2: -5 }]])
define(OBJECT_PRIO_FB_SCORE, 0)

define(FMT_ANCHOR, [[$1 ? `#${$1}` : '']])
define(CALC_SCORE, Math.round(($1 * $2.length) / $3.length))

divert(0)dnl

import __split from './sphinx/tiny_segmenter.js'
import __stemmer from './sphinx/english_stemmer.js'
import __stopwords from './sphinx/stopword.js'

const stemmer = new __stemmer()
const __stem = stemmer.stem.bind(stemmer)
const stopwords = new Set(__stopwords)

export function search_split(query)
{
	/*
	 * Match the Sphinx side.
	 */
	const step_1 = query.match(/\w+/g) ?? []
	const step_2 = __split(query)

	return [ ...step_1, ...step_2 ].filter(Boolean)
}

export function search_stem(words)
{
	const stems = new Set()

	for (const word of words) {
		if (!stopwords.has(word) && !word.match(/^\d+$/)) {
			const term = __stem(word)

			stems.add(term)
		}
	}

	return [ ...stems ]
}

function scan_terms(ctx, terms, score, score_partial, type, query_stems)
{
	const scores_map = new Map()
	const poss_map = new Map()

	const out = []
	const valid_query_stems = query_stems.filter(term => term.length > 2)

	for (const q_term of query_stems) {
		const poss = []
		const candidates = []

		if (HAS_PROP(terms, q_term)) {
			candidates.push([ terms[q_term], score ])
		} else if (q_term.length > 2) {
			const re_term = ESCAPE(q_term)
			const matches = Object.keys(terms).filter(term =>
				term.match(re_term))

			matches.forEach(term =>
				candidates.push([ terms[term], score_partial ]))
		}

		if (!candidates.length)
			continue

		for (const candidate of candidates) {
			/*
			 * lib/sphinx/search.js:45
			 */
			if (!Array.isArray(candidate[0]))
				candidate[0] = [ candidate[0] ]

			poss.push(...candidate[0])

			for (const pos of candidate[0]) {
				if (!scores_map.has(pos))
					scores_map.set(pos, new Map())

				scores_map.get(pos).set(q_term, candidate[1])
			}
		}

		for (const pos of poss) {
			if (!poss_map.has(pos))
				poss_map.set(pos, [ q_term ])

			if (!poss_map.get(pos).includes(q_term))
				poss_map.get(pos).push(q_term)
		}
	}

	for (const [ pos, q_terms ] of poss_map) {
		if (q_terms.length == query_stems.length ||
		    q_terms.length == valid_query_stems.length) {
			const scores = q_terms.map(term =>
				scores_map.get(pos).get(term))
			const best = MAX(...scores)

			out.push([
				ctx.index.docnames[pos],
				type,
				best,
				ctx.index.titles[pos],
				'',
				undefined,
			])
		}
	}

	return out
}

function words_in_order(a, b)
{
	let i = 0

	for (const word of a) {
		while (i < b.length && !b[i].startsWith(word))
			i++

		if (i == b.length)
			return 0

		i++
	}

	return 1
}

export function search_eval_titles(ctx, query, query_stems)
{
	const candidates = scan_terms(ctx, ctx.index.titleterms, TITLE_SCORE,
				      TITLE_PARTIAL_SCORE, 'title', query_stems)

	for (const candidate of candidates) {
		const score = candidate[2]
		const title = NORMALIZE(candidate[3])
		const title_words = search_split(title)

		const match_all = query_stems.every(term =>
			title.includes(term))
		const match_query = title.includes(query)
		const match_order = words_in_order(query_stems, title_words)

		if (!match_all && !match_query)
			continue

		if (!HAS_PROP(ctx.index.titleterms, query)) {
			if (match_all)
				candidate[2] += 30
			if (match_query)
				candidate[2] += 15
			if (match_order)
				candidate[2] += 5
		}

		ctx.res.push(candidate)
	}
}

export function search_eval_indexes(ctx, query)
{
	const indexes = Object.entries(ctx.index.indexentries)

	for (const [ term, info ] of indexes) {
		if (!term.includes(query) || query.length < term.length / 2)
			continue

		for (const [ pos, anchor_id, main ] of info) {
			const res = main ? ctx.res : ctx.res_aux

			res.push([
				ctx.index.docnames[pos],
				'index',
				CALC_SCORE(100, query, term),
				ctx.index.titles[pos],
				FMT_ANCHOR(anchor_id),
				undefined,
			])
		}
	}
}

function eval_object(ctx, query_terms, query_term, prefix,
		     doc_pos, type_pos, prio_pos, anchor, name)
{
	const __fullname = (prefix ? prefix + '.' : '') + name
	const fullname = __fullname.toLowerCase()

	if (!fullname.includes(query_term))
		return

	let score = 0
	const names = fullname.split('.')

	if (fullname == query_term || names[names.length - 1] == query_term)
		score += OBJECT_SCORE
	else if (names[names.length - 1].includes(query_term))
		score += OBJECT_PARTIAL_SCORE

	const [ domain, type, label ] = ctx.index.objnames[type_pos]
	const title = ctx.index.titles[doc_pos]

	if (query_terms.size > 1) {
		const o_terms = new Set(query_terms)

		o_terms.delete(query_term)

		if (o_terms.size > 0) {
			const __haystack = `${prefix} ${name} ${label} ${title}`
			const haystack = __haystack.toLowerCase()

			for (const term of o_terms) {
				if (!haystack.includes(term))
					return
			}
		}
	}

	if (anchor == '')
		anchor = __fullname
	else if (anchor == '-')
		anchor = `${type}-${__fullname}`

	if (HAS_PROP([[OBJECT_PRIO_SCORE]], prio_pos))
		score += OBJECT_PRIO_SCORE[prio_pos]
	else
		score += OBJECT_PRIO_FB_SCORE

	ctx.res.push([
		ctx.index.docnames[doc_pos],
		'object',
		score,
		__fullname,
		FMT_ANCHOR(anchor),
		`${label}, in ${title}`,
	])
}

export function search_eval_objects(ctx, query_words)
{
	const query_terms = new Set(query_words)
	const objects = Object.entries(ctx.index.objects)
	const __evaluate_object = BIND(eval_object, ctx, query_terms)

	for (const q_term of query_terms) {
		for (const [ prefix, infos ] of objects) {
			for (const info of infos)
				__evaluate_object(q_term, prefix, ...info)
		}
	}
}

export function search_eval_terms(ctx, query_stems)
{
	const candidates = scan_terms(ctx, ctx.index.terms, TERM_SCORE,
				      TERM_PARTIAL_SCORE, 'text', query_stems)

	ctx.res.push(...candidates)
}

export function search_eval_tags(ctx, query_stems)
{
	const candidates = scan_terms(ctx, ctx.index.tags, TAG_SCORE,
				      TAG_PARTIAL_SCORE, 'tag', query_stems)

	ctx.res.push(...candidates)
}

function sort_res_fn(a, b)
{
	const score_a = a[2]
	const score_b = b[2]

	if (score_a != score_b)
		return score_a > score_b ? -1 : 1

	const title_a = a[3].toLowerCase()
	const title_b = b[3].toLowerCase()

	if (title_a == title_b)
		return 0

	return title_a > title_b ? 1 : -1
}

export function res_to_str(res)
{
	return res.slice(0, 2).concat(res.slice(3)).map(String).join()
}

export function search_init(index)
{
	return { res: [], res_aux: [], index }
}

export function search_reset(ctx)
{
	ctx.res = []
	ctx.res_aux = []
}

export function search_yield(ctx)
{
	ctx.res.sort(sort_res_fn)
	ctx.res_aux.sort(sort_res_fn)

	const out = []
	const seen = new Set()
	const res = [ ...ctx.res, ...ctx.res_aux ]

	for (let i = 0; i < res.length; i++) {
		const str = res_to_str(res[i])
	
		if (seen.has(str))
			continue

		seen.add(str)
		out.push(res[i])
	}

	return out
}
