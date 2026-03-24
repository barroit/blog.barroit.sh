# SPDX-License-Identifier: GPL-3.0-or-later

jsx-helper-y := lib/jsx.m4

lib-glob := lib/*.jsx lib/*.js
lib-in   := $(wildcard $(lib-glob))
lib-m4-y := $(addprefix $(m4dir)/,$(lib-in))

lib-m4-prefix := $(m4dir)/lib

prefix-y += $(lib-m4-prefix)
onchange-in += $(lib-glob) $(jsx-helper-y)

$(lib-m4-y): $(m4dir)/%: $(images-asmap-y) $(jsx-helper-y) % | \
			     $(lib-m4-prefix)
	$(m4) $^ >$@

clean-y += clean-lib

.PHONY: clean-lib

clean-lib:
	rm -f $(lib-m4-y)
