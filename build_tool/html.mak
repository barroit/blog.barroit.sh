# SPDX-License-Identifier: GPL-3.0-or-later

html-glob := index.html
html-in   := $(wildcard $(html-glob))
html-m4-y := $(addprefix $(m4dir)/,$(html-in))
html-y    := $(objtree)/index.html
index-asmap-y := $(objtree)/index_asmap.m4

onchange-in += $(html-glob)
deploy-ready-y += $(html-y)

$(html-m4-y): $(m4dir)/%: $(images-asmap-y) $(html-in) | $(m4dir)
	$(m4) $^ >$@

$(index-asmap-y): $(css-y) $(page-y)
	ls $(pubdir)/index-* | grep -E '\.(css|js)$$' | \
	sed s,$(pubdir),, | $(gen-asmap) s,/,, AS >$@

$(html-y): $(objtree)/%: $(index-asmap-y) $(html-m4-y)
	$(m4) $^ >$@
	ln -f $@ $(pubdir)/$*

clean-y += clean-html

.PHONY: clean-html

clean-html:
	rm -f $(html-y) $(html-m4-y) $(index-asmap-y) \
	      $(pubdir)/index.html
