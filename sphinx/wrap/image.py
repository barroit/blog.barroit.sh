#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

from docutils import nodes

def wrap_image(document):
	for image in list(document.findall(nodes.image)):
		if not isinstance(image.parent, nodes.figure):
			box = nodes.container(classes = [ 'image-wrapper' ])

			image.parent.replace(image, box)
			box.append(image)
