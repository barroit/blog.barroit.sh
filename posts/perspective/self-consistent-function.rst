.. SPDX-License-Identifier: CC-BY-NC-4.0

.. tag:: programming, maintainability, srp

==================================
Function should be self-consistent
==================================

I've been maintaining vsc-spdxheader.git recently. It's been about four months
since I last touched it. However, I found it's hard to add new features or fix
bugs.

The reason is simple: user input checking and the part that does core tasks are
mixed together. Mixing them can reduce some loops and regex matches, thus
increasing performance.

But this also makes the function no longer self-consistent. That's problematic.
When this happens, it breaks two parts:

* the problematic function itself
* the functions that call that problematic function

For the problematic function, you need to do extra things to make the whole part
work correctly, and you must do it every time you call that function. That's
annoying and causes a higher chance of human error.

For the caller, it must contain code that doesn't belong to its responsibility.
This makes the caller messy and will confuse you when you forget the
implementation details.

**One fault fucks up two parts.**

So for non-hot paths and not performance-critical parts, maintainability should
take precedence over optimization. Make functions self-consistent, and write
easy-to-understand code. That's the right thing to do in this case.
