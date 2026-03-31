.. SPDX-License-Identifier: GPL-3.0-or-later

===========================
Query Format and Evaluation
===========================

A query has two parts:

1. leading plain terms
2. filter expression

Leading plain terms build initial candidate set with full-text search.

Filter expression is applied after that and only narrows candidate set. It
doesn't add new results.

Leading plain terms
===================

Plain terms are normal words at start of query.

For example::

    random query

searches full text for ``random`` and ``query``.

Plain terms are only recognized at start of query. Once first filter appears,
remaining input is parsed as filter expression.

Filters
=======

Filters match specific fields or properties.

Supported filters are:

``-title <value>``
    Match title against ``<value>``.

``-tag <value>``
    Match tags against ``<value>``.

``-during <start>-<end>``
    Match results whose date is within given range.

    Date format is flexible, as long as both sides of ``-`` are accepted
    by ``new Date()``.

Operators
=========

Filter expression supports these operators:

``-not``
    Negate next filter expression.

``-or``
    Require either side to match.

Adjacent filters are combined with implicit AND.

Operator precedence is:

1. ``-not``
2. adjacent filters
3. ``-or``

Use parentheses when grouping matters.

Parentheses
===========

Parentheses group filter expressions.

For example::

    -title miku ( -tag vocaloid -or -tag event )

matches title ``miku`` and also requires either tag ``vocaloid`` or tag
``event``.

Operand parsing
===============

Filter values are parsed greedily.

After a filter starts, following words belong to that filter value until
next operator, next filter, or parenthesis appears.

For example::

    -title random query -tag miku

is parsed as:

1. ``-title random query``
2. ``-tag miku``

Evaluation order
================

Query is evaluated like this:

1. read leading plain terms, if any
2. build candidate set from full-text search
3. parse remaining input as filter expression
4. apply filter expression to candidate set

A query that starts with a filter skips full-text search and applies that
filter to all documents.

Examples
========

Full-text search only::

    random query

Title match only::

    -title random query

Full-text search, then title filter::

    random query -title release note

Title or tag match::

    -title miku -or -tag vocaloid

Full-text search, then date filter::

    random query -during 3/9/2026-8/31/2026

Full-text search, then combined filters::

    random query -title release note -not -tag draft

Grouped filter expression::

    random query -title release note ( -tag blog -or -tag note )
