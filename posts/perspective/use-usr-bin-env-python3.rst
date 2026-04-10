.. SPDX-License-Identifier: CC-BY-NC-4.0

.. tag:: programming, script

==========================
Use #!/usr/bin/env python3
==========================

Python 3, Unlike other historical shell utilities, the binary position of it can
vary on different platforms, as different OSs and distributions have their own
design purposes and strategies for bin directories.

Thus a :file:`/bin/python3` which exists on Ubuntu, doesn't exist on macOS. And
a :file:`/usr/bin/python3`, which exists on most Unix-like OSs, is missing on
FreeBSD.

In an even worse case, like I encountered recently, the MSYS2 CLANG64 has a
Windows python3, which is located at :file:`/clang64/bin/python3`, and a Unix
python3, which lives in :file:`/usr/bin/python3`. My script is designed to work
on both platforms, if and only if it's run by the native python3. However, since
I used :code:`#!/usr/bin/python3` in the script, the script started by the wrong
python3, and the logic gets confused by environments.

There has been some discussion on avoiding using :file:`/usr/bin/env` as the
PATH is unpredictable. I agree with this and I already practice that a lot. But
in our case, using it is the best approach. It works, and :file:`/usr/bin/env`
is relatively portable.
