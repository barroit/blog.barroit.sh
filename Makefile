# SPDX-License-Identifier: GPL-3.0-or-later

m4 ?= m4
m4 := printf 'changequote([[, ]])' | $(m4) - -Uformat

# export DEV=http://$(./scripts/lan-ip.py):3939
m4 += $${DEV:+-DDEV=$$DEV}

esbuild ?= esbuild
esbuild += --bundle --format=esm

terser ?= terser
terser += --module --ecma 2020 --mangle --comments false \
	  --compress 'passes=3,pure_getters=true,unsafe=true'

tailwindcss ?= tailwindcss
tailwindcss += --optimize

sphinx ?= sphinx-build
sphinx := $(sphinx) --builder post

magick ?= magick

ffmpeg ?= ffmpeg
ffmpeg += -v error

onchange ?= onchange
concurrently ?= concurrently
wrangler ?= wrangler

lan-ip      := ./scripts/lan-ip.py
ln-unique   := ./scripts/ln-unique.sh
map-asset   := ./scripts/map-asset.sh
map-license := ./scripts/map-license.sh
map-notice  := ./scripts/map-notice.sh
list-posts  := ./scripts/list-posts.sh

objtree := build
m4dir := $(objtree)/m4
pubdir := $(objtree)/static

ifneq ($(MINIMIZE),)
	MINIMIZE := -min
endif

clean :=
distclean :=

onchange-src :=
deploy-ready-y :=

.PHONY: deploy-ready

deploy-ready:

include scripts/Makefile.media

include scripts/Makefile.images

include scripts/Makefile.fonts

include scripts/Makefile.notice

include scripts/Makefile.license

include scripts/Makefile.lib

include scripts/Makefile.page

include scripts/Makefile.script

include scripts/Makefile.style

include scripts/Makefile.posts

include scripts/Makefile.asset

include scripts/Makefile.html

include scripts/Makefile.headers

$(pubdir)/%.stamp: %
	mkdir -p $(@D)
	$(ln-unique) $< $(@D)
	touch $@

%_asmap.m4: %_asmap.sed
	printf '%s\n' \
	       $(addsuffix -*,$(basename $(basename $(filter-out $<,$^)))) | \
	sed s,$(pubdir),, | sort | uniq | $(map-asset) $$(cat $<) >$@

$(m4dir)/%: %
	mkdir -p $(@D)
	$(m4) $(filter-out $<,$^) $< >$@

deploy-ready: $(deploy-ready-y)

.PHONY: clean distclean

clean:
	rm -f $(clean)

distclean: clean
	rm -f $(distclean)

.PHONY: hot-build hot-host hot-dev host deploy

hot-build: deploy-ready
	$(onchange) $(patsubst %,'%',$(onchange-src)) -- $(MAKE) deploy-ready

hot-host:
	$(wrangler) dev --live-reload --ip=$$($(lan-ip)) --port=3939

hot-dev: deploy-ready
	$(concurrently) '$(MAKE) hot-build' '$(MAKE) hot-host'

host:
	$(wrangler) dev --ip=$$($(lan-ip)) --port=3939

deploy:
	$(wrangler) deploy
	$(wrangler) secret bulk .dev.vars
