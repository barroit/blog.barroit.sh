# SPDX-License-Identifier: GPL-3.0-or-later

fonts-in  := $(shell find fonts -type f)
fonts-dir := $(sort $(dir $(fonts-in)))
fonts-y   := $(addprefix $(objtree)/,$(fonts-in))

fonts-prefix := $(addprefix $(objtree)/,$(fonts-dir))
static-fonts-prefix := $(addprefix $(pubdir)/,$(fonts-dir))

prefix-y += $(fonts-prefix) $(static-fonts-prefix)
onchange-in += fonts/**/*

$(fonts-y): $(objtree)/%: % | $(fonts-prefix) $(static-fonts-prefix)
	cp $< $@
	$(ln-unique) $@ $(subst $(objtree),$(pubdir),$(@D))

fonts-asmap-y := $(objtree)/fonts_asmap.m4

$(fonts-asmap-y): $(fonts-y)
	find $(static-fonts-prefix) -maxdepth 1 -type f | \
	sed s,$(pubdir),, | $(gen-asmap) s,^/fonts/,, FONTS >$@

clean-y += clean-fonts
distclean-y += distclean-fonts

.PHONY: clean-fonts distclean-fonts

clean-fonts:
	rm -f $(fonts-asmap-y)

distclean-fonts: clean-fonts
	find $(fonts-prefix) $(static-fonts-prefix) \
	     -exec rm {} + 2>/dev/null || true
