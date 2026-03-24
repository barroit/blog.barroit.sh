# SPDX-License-Identifier: GPL-3.0-or-later

css-in := index.html index.jsx style/*.css
css-glob := $(realpath index.css) $(css-in)
css-in   := $(wildcard $(css-glob))
css-m4-y := $(addprefix $(m4-prefix)/,$(css-in))
css-y    := $(prefix)/index.css
css-m4-y := $(m4-prefix)/index.css

onchange-in += index.css style/*.css

$(css-y)1: $(css-in) $(page-m4-y) $(lib-m4-y) | $(prefix)
	$(tailwindcss) --cwd $(m4-prefix) --input $< >$@

$(css-m4-y): $(m4-prefix)/%: $(fonts-asmap-y) $(images-asmap-y) $(prefix)/%1 | \
			     $(m4-prefix)
	$(m4) $^ >$@

$(css-y): $(css-m4-y) | $(static-prefix)
	$(esbuild) --external:/fonts/* --external:/images/* \
		   --minify $< --outfile=$@
	$(ln-unique) $@ $(static-prefix)

clean-y += clean-css

.PHONY: clean-css

clean-css:
	rm -f $(css-m4-y) $(css-y)* $(static-prefix)/index-*.css
