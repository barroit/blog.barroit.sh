.. SPDX-License-Identifier: CC-BY-NC-4.0

.. tag:: programming, maintainability, coding-style, pragmatism

========================================
You don't need to check every error path
========================================

As I read more and more other people's code, I found that lots of people are
happy to check every error path. However, most of these checks are redundant and
cause confusion for people reading them for the first time. And even worse, they
hide the real thing the function does.

Error Path
----------

So what's an error path? Functions and methods can fail, like ``open(3)``, which
is perfect to return -1 if the path component is missing in the directory entry.
Variables can be in an illegal state, such as NULL, or be expected to hold a
natural number but receive a negative value. To be more precise, any values that
are not within the function domain. These are error paths.

Error paths are very common in a program. The user input validations, syscalls,
external APIs, function input, and the data being processed inside a function,
all contain error paths. It's important to handle them properly to make your
program function correctly.

Trade-off of Error Path Handling
--------------------------------

Although error path handling is important, that doesn't mean you, as a
developer, need to handle every error here.

The error path you must handle:

* user inputs validation
* external API calls

The error path you should skip:

* function input
* data that comes from trusted sources

Basically, to keep the code easier to follow for other people, you only check
the data that can be mutated by someone other than you (untrusted sources). The
*you* here means the code of your program.

Data from untrusted sources cancan really contain bad values. On the other hand,
the data comes from trusted sources is predictable, so you can just skip the
checking on that with confidence.

Function Input
--------------

Functions and methods always have an input, whether it's passed through a
parameter or accessed via a global variable. We only discuss parameter one here
because the other is less predictable and less common in a call stack.

You might see this::

	const char *str_dup(const char *in)
	{
		if (!in)
			return NULL;
		// ...
	}

But think of it, is this really meaningful? You pass string to this function to
duplicate it, there's no reason that you pass NULL or dangling pointer to it.
Thus it shouldn't handle such case.

Instead of checking such a condition in ``str_dup()``, it's the caller's
responsibility to check the value **before** calling it. This is much better
than checking the input inside the function.

By doing so, ``str_dup()`` can now focus on duplicating a string. It doesn't
care about whether the value holds a string or the string is valid. This makes
it more SRP [#srp_wiki]_ compliant.

Any invalid input to this function is considered a human fault. Therefore, an
undefined behavior is the correct one there. This also makes the function domain
clearer and more linear.

Keep in mind: **Validate at the boundaries, trust the core**.

.. [#srp_wiki] https://en.wikipedia.org/wiki/Single-responsibility_principle
