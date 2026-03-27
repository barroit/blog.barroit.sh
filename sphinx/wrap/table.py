#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

from docutils import nodes

def wrap_table(document):
	for table in list(document.findall(nodes.table)):
		box = nodes.container(classes = [ 'table-wrapper' ])

		table.parent.replace(table, box)
		box.append(table)
