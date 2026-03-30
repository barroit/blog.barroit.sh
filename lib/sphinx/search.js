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

define(OBJECT_SCORE, 11)
define(OBJECT_PARTIAL_SCORE, 6)

define(OBJECT_PRIO_SCORE, [[{ 0: 15, 1: 5, 2: -5 }]])
define(OBJECT_PRIO_FB_SCORE, 0)

define(FMT_ANCHOR, [[$1 ? `#${$1}` : '']])
define(CALC_SCORE, Math.round(($1 * $2.length) / $3.length))

divert(0)dnl

import __split from './tiny_segmenter.js'
import __stemmer from './english_stemmer.js'
import __stopwords from './stopword.js'

const stemmer = new __stemmer()
const stem = stemmer.stem.bind(stemmer)
const stopwords = new Set(__stopwords)

function split_query(query)
{
	const s1 = query.match(/\w+/g) ?? []
	const s2 = __split(query)
	const words = [ ...s1, ...s2 ]

	return words.filter(Boolean)
}

function parse_query(words)
{
	const include = new Set()
	const exclude = new Set()

	for (const word of words) {
		let term

		if (stopwords.has(word) || word.match(/^\d+$/))
			continue

		term = stem(word)

		if (term[0] == '-')
			exclude.add(term.[[substr]](1))
		else
			include.add(term)
	}

	return [ include, exclude ]
}

function scan_terms(ctx, terms, score, score_partial, type, include, exclude)
{
	const scores_map = new Map()
	const poss_map = new Map()

	const out = []
	const valid_include = [ ...include ].filter(term => term.length > 2)
	const valid_exclude = [ ...exclude ]

	for (const q_term of include) {
		const poss = []
		const cands = []

		if (HAS_PROP(terms, q_term)) {
			cands.push([ terms[q_term], score ])
		} else if (q_term.length > 2) {
			const re_term = ESCAPE(q_term)
			const matches = Object.keys(terms).filter(term =>
				term.match(re_term))

			matches.forEach(term =>
				cands.push([ terms[term], score_partial ]))
		}

		if (!cands.length)
			continue

		for (const cand of cands) {
			/*
			 * lib/sphinx/search.js:45
			 */
			if (!Array.isArray(cand[0]))
				cand[0] = [ cand[0] ]

			poss.push(...cand[0])

			for (const pos of cand[0]) {
				if (!scores_map.has(pos))
					scores_map.set(pos, new Map())

				scores_map.get(pos).set(q_term, cand[1])
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
		if (q_terms.length == include.size ||
		    q_terms.length == valid_include.length) {
			const skip = valid_exclude.some(term =>
				IS_ARR(terms[term]) ? terms[term] == pos :
						      terms[term].includes(pos))

			if (!skip) {
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

function evaluate_titles(ctx, query, include, exclude)
{
	const cands = scan_terms(ctx, ctx.index.titleterms, TITLE_SCORE,
				 TITLE_PARTIAL_SCORE, 'title', include, exclude)
	const __include = [ ...include ]

	for (const cand of cands) {
		const score = cand[2]
		const title = NORMALIZE(cand[3])
		const title_words = split_query(title)

		const match_all = __include.every(term =>
			title.includes(term))
		const match_query = title.includes(query)
		const match_order = words_in_order(include, title_words)

		if (!match_all && !match_query)
			continue

		if (!HAS_PROP(ctx.index.titleterms, query)) {
			if (match_all)
				cand[2] += 30
			if (match_query)
				cand[2] += 15
			if (match_order)
				cand[2] += 5
		}

		ctx.res.push(cand)
	}
}

function evaluate_indexes(ctx, query)
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

function evaluate_object(ctx, q_terms, q_term, prefix,
			 doc_pos, type_pos, prio_pos, anchor, name)
{
	const __fullname = (prefix ? prefix + '.' : '') + name
	const fullname = __fullname.toLowerCase()

	if (!fullname.includes(q_term))
		return

	let score = 0
	const names = fullname.split('.')

	if (fullname == q_term || names[names.length - 1] == q_term)
		score += OBJECT_SCORE
	else if (names[names.length - 1].includes(q_term))
		score += OBJECT_PARTIAL_SCORE

	const [ domain, type, label ] = ctx.index.objnames[type_pos]
	const title = ctx.index.titles[doc_pos]

	if (q_terms.size > 1) {
		const o_terms = new Set(q_terms)

		o_terms.delete(q_term)

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

function evaluate_objects(ctx, q_words)
{
	const q_terms = new Set(q_words)
	const objects = Object.entries(ctx.index.objects)
	const __evaluate_object = BIND(evaluate_object, ctx, q_terms)

	for (const q_term of q_terms) {
		for (const [ prefix, infos ] of objects) {
			for (const info of infos)
				__evaluate_object(q_term, prefix, ...info)
		}
	}
}

function evaluate_terms(ctx, include, exclude)
{
	const cands = scan_terms(ctx, ctx.index.terms, TERM_SCORE,
				 TERM_PARTIAL_SCORE, 'text', include, exclude)

	ctx.res.push(...cands)
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

export default function search(__query, index)
{
	const query = NORMALIZE(__query)
	const q_words = split_query(query)
	const [ include, exclude ] = parse_query(q_words)

	const ctx = { res: [], res_aux: [], index }

	evaluate_titles(ctx, query, include, exclude)
	evaluate_indexes(ctx, query)
	evaluate_objects(ctx, q_words)
	evaluate_terms(ctx, include, exclude)

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

	return [ include, out ]
}
