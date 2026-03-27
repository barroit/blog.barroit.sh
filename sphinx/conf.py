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
]

html_theme = 'basic'
html_sidebars = { '**': [] }

html_math_renderer = 'imgmath'
imgmath_image_format = 'svg'
