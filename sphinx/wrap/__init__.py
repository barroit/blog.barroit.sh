#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later

from docutils.transforms import Transform

from .image import wrap_image
from .table import wrap_table
from .figure import wrap_figure

wraps = [
	wrap_image,
	wrap_table,
	wrap_figure,
]

class wrapper(Transform):
	default_priority = 750

	def apply(self):
		for wrap in wraps:
			wrap(self.document)

def setup(app):
	app.add_post_transform(wrapper)

	return {
		'parallel_read_safe': 1,
		'parallel_write_safe': 1,
	}
