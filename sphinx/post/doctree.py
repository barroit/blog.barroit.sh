#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

from docutils import nodes
import json
import os
from os.path import dirname
from sphinx import addnodes

EMITS = (
	nodes.paragraph,
	nodes.title,
	nodes.rubric,
	nodes.caption,
	nodes.term,
	nodes.literal_block,
	nodes.line,
	nodes.entry,
	addnodes.desc_signature,
	addnodes.desc_signature_line,
)

SKIPS = (
	nodes.comment,
	nodes.system_message,
	nodes.raw,
	nodes.target,
)

ANCHORS = (
	nodes.target,
	nodes.title,
	nodes.rubric,
	addnodes.desc_signature,
	addnodes.desc_signature_line,
)

def dump_plaintext(app, doctree, docname):
	blocks = []
	texts = []

	stack = [ ( doctree, None ) ]
	offset = 0

	while len(stack) != 0:
		node, anchor = stack.pop()

		attr = getattr(node, 'attributes', {})
		ids = attr.get('ids')

		if ids:
			anchor = ids[0]

		if isinstance(node, SKIPS):
			continue
		elif not isinstance(node, EMITS):
			children = getattr(node, 'children', ())
			next_anchor = anchor
			idx = 0
			queue = []

			while idx < len(children):
				child = children[idx]
				attr = getattr(child, 'attributes', {})
				ids = attr.get('ids')

				if ids and isinstance(child, ANCHORS):
					next_anchor = ids[0]

				queue.append(( child, next_anchor ))
				idx += 1

			idx = len(queue) - 1

			while idx >= 0:
				stack.append(queue[idx])
				idx -= 1

			continue

		raw_text = node.astext()

		if isinstance(node, nodes.literal_block):
			text = raw_text.strip('\n')
		else:
			words = raw_text.split()
			text = ' '.join(words)

		if text != '':
			if len(texts) != 0:
				texts.append('\n')
				offset += 1

			blocks.append({
				'off': offset,
				'len': len(text),
				'anchor': anchor,
				'class': node.tagname,
			})

			texts.append(text)
			offset += len(text)

	docname = docname.split('.')[0]

	text = ''.join(texts)
	seps = ( ',', ':' )

	text_dst = f'{app.outdir}/{docname}.text'
	text_dir = dirname(text_dst)

	block_dst = f'{app.outdir}/{docname}.block'
	block_dir = dirname(block_dst)

	os.makedirs(text_dir, exist_ok = True)
	os.makedirs(block_dir, exist_ok = True)

	text_file = open(text_dst, 'w', encoding = 'utf-8')
	block_file = open(block_dst, 'w', encoding = 'utf-8')

	text_file.write(text)
	text_file.close()

	json.dump(blocks, block_file, ensure_ascii = False, separators = seps)
	block_file.close()
