# SPDX-License-Identifier: GPL-3.0-or-later

jsx-helper-y := lib/jsx.m4

lib-glob := lib/*.jsx lib/*.js
lib-in   := $(wildcard $(lib-glob))
lib-m4-y := $(addprefix $(m4-prefix)/,$(lib-in))

lib-m4-prefix := $(m4-prefix)/lib

prefix-y += $(lib-m4-prefix)
onchange-in += $(lib-glob) $(jsx-helper-y)

$(lib-m4-y): $(m4-prefix)/%: $(images-asmap-y) $(jsx-helper-y) % | \
			     $(lib-m4-prefix)
	$(m4) $^ >$@

clean-y += clean-lib

.PHONY: clean-lib

clean-lib:
	rm -f $(lib-m4-y)
