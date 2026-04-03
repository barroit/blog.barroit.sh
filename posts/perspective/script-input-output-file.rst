.. SPDX-License-Identifier: CC-BY-NC-4.0

.. tag:: programming, maintainability, coding-style, srp, script

==========================================
Script input/output should be stdin/stdout
==========================================

Most of the time, when we write a script, the input/output files are specified
through arguments/flags. However, in practice, this is inflexible and makes the
argument position weak.

Script Definition
-----------------

In this topic, we focus on scripts that **do not rely on input/output
filenames**.

A script here is a helper that helps you finish small tasks. These tasks should
be simple, clear, and strictly stream-oriented. Whether a file or a bunch of
files can be considered a script is independent of the language being used, it
only depends on its purpose and the task it's doing.

A test framework written in shell language is not a script. An executable
compiled and linked by gcc and bfd can be treated as a script if it behaves
exactly like a script, though this is much heavier than writing a script in
shell.

Benefits of using stdin and stdout
----------------------------------

Passing input/output files through arguments/flags has several problems:

* lose the ability to utilize the pipe [#]_
* script must handle the input/output path components properly

By taking the input from stdin and output to stdout, you can fully utilize the
pipe. For example, you can:

1. ensure the input/output path components exist in directory entries
2. ``grep(1)`` or ``find(1)`` something
3. pipe the output lines to ``sed(1)`` or ``awk(1)`` to sanitize or transform
   them
4. pipe the ready-to-use lines to script and process them
5. output to stdout then redirect output to file

Doing so makes your script no longer need to:

* check if the input file exists or is valid
* make the input lines a good shape
* ensure the output directory exists

This drops lots of noise, it makes your script smaller, more predictable, and
more SRP compliant. Furthermore, you can continue to transform the lines after
the script output and before the redirection. This can even make the script more
generic, since its output now becomes the intersection of two expected outputs.

.. [#] unless you pass /dev/stdin or /dev/stdout, but that's redundant for a
       script
