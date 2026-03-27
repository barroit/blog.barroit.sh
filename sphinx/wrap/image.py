#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

from docutils import nodes

expand_html = """
<button class="image-expand">
  <div class="image-expand-canvas">
    <div class="image-expand-icon"></div>
  </div>
</button>
"""

def wrap_image(document):
	__expand = nodes.raw('', expand_html, format='html')
	__box = nodes.container(classes = [ 'image-wrapper', 'group' ])

	for image in list(document.findall(nodes.image)):
		expand = __expand.deepcopy()
		box = __box.copy()

		image.parent.replace(image, box)
		box.append(image)
		box.append(expand)
