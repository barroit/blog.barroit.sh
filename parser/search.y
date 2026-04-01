/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

%%

query
:	words EOF		{ return [ $1 ] }
|	filter EOF		{ return [ undefined, $1 ] }
|	words filter EOF	{ return [ $1, $2 ] }
;

filter
:	filter_term
|	filter filter_term	{ $$ = [ 'and', $1, $2 ] }
|	filter OR filter_term	{ $$ = [ $2.slice(1), $1, $3 ] }
;

filter_term
:	filter_item
|	NOT filter_item		{ $$ = [ $1.slice(1), $2 ] }
;

filter_item
:	FILTER_TYPE words	{ $$ = [ $1.slice(1), $2 ] }
|	'(' filter ')'		{ $$ = $2 }
;

words
:	WORD
|	words WORD		{ $$ = `${$1} ${$2}` }
;
