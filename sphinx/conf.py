#!/usr/bin/python3

from os.path import dirname
import sys
from sys import path

sphinx = dirname(__file__)
sys.dont_write_bytecode = 1

path.append(sphinx)

html_theme = 'basic'
root_doc = 'index'
html_sidebars = { '**': [] }

html_use_index = 0
html_copy_source = 0

extensions = [
	'post',
	'wrap',
]
