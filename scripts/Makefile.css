# SPDX-License-Identifier: GPL-3.0-or-later

css-in := index.html index.jsx style/*.css
css-glob := $(realpath index.css) $(css-in)
css-in   := $(wildcard $(css-glob))
css-m4-y := $(addprefix $(m4dir)/,$(css-in))
css-y    := $(objtree)/index.css
css-m4-y := $(m4dir)/index.css

onchange-in += index.css style/*.css

$(css-y)1: $(css-in) $(page-m4-y) $(lib-m4-y) | $(objtree)
	$(tailwindcss) --cwd $(m4dir) --input $< >$@

$(css-m4-y): $(m4dir)/%: $(fonts-asmap-y) $(images-asmap-y) $(objtree)/%1 | \
			     $(m4dir)
	$(m4) $^ >$@

$(css-y): $(css-m4-y) | $(pubdir)
	$(esbuild) --external:/fonts/* --external:/images/* \
		   --minify $< --outfile=$@
	$(ln-unique) $@ $(pubdir)

clean-y += clean-css

.PHONY: clean-css

clean-css:
	rm -f $(css-m4-y) $(css-y)* $(pubdir)/index-*.css
