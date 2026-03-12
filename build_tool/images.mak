# SPDX-License-Identifier: GPL-3.0-or-later

images-in  := $(shell find images -type f | grep -vE '\.aseprite$$')
images-dir := $(sort $(dir $(images-in)))
images-y   := $(addprefix $(prefix)/,$(images-in))

images-prefix := $(addprefix $(prefix)/,$(images-dir))
static-images-prefix := $(addprefix $(static-prefix)/,$(images-dir))

prefix-y += $(images-prefix) $(static-images-prefix)
onchange-in += images/**/*

$(images-y): $(prefix)/%: % | $(images-prefix) $(static-images-prefix)
	cp $< $@
	$(ln-unique) $@ $(subst $(prefix),$(static-prefix),$(@D))

images-asmap-y := $(prefix)/images_asmap.m4

$(images-asmap-y): $(images-y)
	find $(static-images-prefix) -maxdepth 1 -type f | \
	sed s,$(static-prefix),, | $(gen-asmap) s,^/images/,, IMAGES >$@

clean-y += clean-images
distclean-y += distclean-images

.PHONY: clean-images distclean-images

clean-images:
	rm -f $(images-asmap-y)

distclean-images: clean-images
	find $(images-prefix) $(static-images-prefix) \
	     -exec rm {} + 2>/dev/null || true
