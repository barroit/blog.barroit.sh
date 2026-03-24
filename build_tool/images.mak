# SPDX-License-Identifier: GPL-3.0-or-later

images-in  := $(shell find images -type f | grep -vE '\.aseprite$$')
images-dir := $(sort $(dir $(images-in)))
images-y   := $(addprefix $(objtree)/,$(images-in))

images-prefix := $(addprefix $(objtree)/,$(images-dir))
static-images-prefix := $(addprefix $(pubdir)/,$(images-dir))

prefix-y += $(images-prefix) $(static-images-prefix)
onchange-in += images/**/*

$(images-y): $(objtree)/%: % | $(images-prefix) $(static-images-prefix)
	cp $< $@
	$(ln-unique) $@ $(subst $(objtree),$(pubdir),$(@D))

images-asmap-y := $(objtree)/images_asmap.m4

$(images-asmap-y): $(images-y)
	find $(static-images-prefix) -maxdepth 1 -type f | \
	sed s,$(pubdir),, | $(gen-asmap) s,^/images/,, IMAGES >$@

clean-y += clean-images
distclean-y += distclean-images

.PHONY: clean-images distclean-images

clean-images:
	rm -f $(images-asmap-y)

distclean-images: clean-images
	find $(images-prefix) $(static-images-prefix) \
	     -exec rm {} + 2>/dev/null || true
