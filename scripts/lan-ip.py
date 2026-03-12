#!/usr/bin/python3
# SPDX-License-Identifier: GPL-3.0-or-later
#

import socket

conn = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

conn.connect(('3.9.3.9', 39))

port = conn.getsockname()

print(port[0])
