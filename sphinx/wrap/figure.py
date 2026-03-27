#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

from docutils import nodes

def wrap_figure(document):
	for figure in list(document.findall(nodes.figure)):
		box = nodes.container(classes = [ 'figure-wrapper' ])

		figure.parent.replace(figure, box)
		box.append(figure)
