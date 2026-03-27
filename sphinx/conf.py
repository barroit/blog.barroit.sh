#!/usr/bin/python3

from os.path import dirname
import sys
from sys import path

sphinx = dirname(__file__)
sys.dont_write_bytecode = 1

path.append(sphinx)

root_doc = 'index'

extensions = [
	'post',
	'wrap',
	'sphinx.ext.imgmath',
	'sphinxcontrib.video',
]

html_theme = 'basic'
html_sidebars = { '**': [] }
html_use_index = 0
html_copy_source = 0

html_math_renderer = 'imgmath'
imgmath_image_format = 'svg'
