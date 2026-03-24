# SPDX-License-Identifier: GPL-3.0-or-later

m4 ?= m4
m4 := printf 'changequote([[, ]])' | $(m4) - -Uformat

esbuild ?= esbuild
esbuild += --bundle --format=esm

terser ?= terser
terser += --module --ecma 2020 --mangle --comments false \
	  --compress 'passes=3,pure_getters=true,unsafe=true'

tailwindcss ?= tailwindcss
tailwindcss += --optimize

magick ?= magick

ffmpeg ?= ffmpeg
ffmpeg += -v error

onchange ?= onchange
concurrently ?= concurrently
wrangler ?= wrangler

gen-asmap := ./scripts/gen-asmap.sh
lan-ip    := ./scripts/lan-ip.py
ln-unique := ./scripts/ln-unique.sh

objtree := build
m4dir := $(objtree)/m4
pubdir := $(objtree)/static

ifneq ($(minimize),)
	minimize := -terser
endif

clean-y :=
distclean-y :=

onchange-in :=
deploy-ready-y :=

prefix-y := $(m4dir) $(pubdir)

.PHONY: deploy-ready

deploy-ready:

include scripts/Makefile.images

include scripts/Makefile.fonts

include scripts/Makefile.notice

include scripts/Makefile.license

include scripts/Makefile.lib

include scripts/Makefile.page

include scripts/Makefile.css

include scripts/Makefile.html

include scripts/Makefile.headers

$(prefix-y):
	mkdir -p $@

terser-y := $(addsuffix 1-terser,$(terser-in))

$(terser-y): %1-terser: %1
	$(terser) <$< >$@

deploy-ready: $(deploy-ready-y)

.PHONY: clean distclean

clean: $(clean-y)

distclean: clean $(distclean-y)

.PHONY: hot-build hot-host hot-dev host deploy

hot-build: deploy-ready
	$(onchange) $(patsubst %,'%',$(onchange-in)) -- $(MAKE) deploy-ready

hot-host:
	$(wrangler) dev --live-reload --ip=$(shell $(lan-ip))

hot-dev: deploy-ready
	$(concurrently) '$(MAKE) hot-build' '$(MAKE) hot-host'

host:
	$(wrangler) dev --ip=$(shell $(lan-ip))

deploy:
	$(wrangler) deploy
	$(wrangler) secret bulk .dev.vars
