# SPDX-License-Identifier: GPL-3.0-or-later

page-glob := index.jsx page/*.jsx
page-in   := $(wildcard $(page-glob))
page-m4-y := $(addprefix $(m4-prefix)/,$(page-in))
page-y    := $(prefix)/index.js

page-generic-filter-out := %/gallery.jsx %/log.jsx %/credit.jsx
page-generic-m4-y := $(filter-out $(page-generic-filter-out),$(page-m4-y))
page-credit-m4-y  := $(filter %/credit.jsx, $(page-m4-y))

page-m4-prefix := $(m4-prefix)/page

prefix-y += $(page-m4-prefix)
terser-in += $(page-y)
onchange-in += $(page-glob)

$(page-credit-m4-y): $(m4-prefix)/%: % $(fonts-asmap-y) $(images-asmap-y) \
				     $(jsx-helper-y) $(notice-map-y) \
				     $(license-map-y) $(lib-m4-y) | \
				     $(page-m4-prefix)
	$(m4) $(fonts-asmap-y) $(images-asmap-y) \
	      $(jsx-helper-y) $(notice-map-y) $(license-map-y) $< >$@

$(page-generic-m4-y): $(m4-prefix)/%: % $(images-asmap-y) $(jsx-helper-y) \
				      $(lib-m4-y) | $(page-m4-prefix)
	$(m4) $(images-asmap-y) $(jsx-helper-y) $< >$@

$(page-y)1: $(page-m4-y) | $(prefix)
	$(esbuild) --jsx-import-source=preact --jsx=automatic \
		   --sourcemap=inline --outfile=$@ $<

$(page-y): %: %1$(minimize) | $(static-prefix)
	cp $< $@
	$(ln-unique) $@ $(static-prefix)

clean-y += clean-page

.PHONY: clean-page

clean-page:
	rm -f $(page-m4-y) $(page-y)* $(static-prefix)/index-*.js
