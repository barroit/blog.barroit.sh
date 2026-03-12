# SPDX-License-Identifier: GPL-3.0-or-later

$(eval $(call def-target,html,index.html,index.html))
index-asmap-y := $(prefix)/index_asmap.m4

onchange-in += $(html-glob)
deploy-ready-y += $(html-y)

$(html-m4-y): $(m4-prefix)/%: $(images-asmap-y) $(html-in) | $(m4-prefix)
	$(m4) $^ >$@

$(index-asmap-y): $(css-y) $(page-y)
	ls $(static-prefix)/index-* | grep -E '\.(css|js)$$' | \
	sed s,$(static-prefix),, | $(gen-asmap) s,/,, AS >$@

$(html-y): $(prefix)/%: $(index-asmap-y) $(html-m4-y)
	$(m4) $^ >$@
	ln -f $@ $(static-prefix)/$*

clean-y += clean-html

.PHONY: clean-html

clean-html:
	rm -f $(html-y) $(html-m4-y) $(index-asmap-y) \
	      $(static-prefix)/index.html
