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

gen-asmap    := ./scripts/gen-asmap.sh
lan-ip       := ./scripts/lan-ip.py
ln-unique    := ./scripts/ln-unique.sh

prefix := build
m4-prefix := $(prefix)/m4
static-prefix := $(prefix)/static

define def-target
	$1-glob := $2 $4
	$1-in   := $$(wildcard $$($1-glob))
	$1-m4-y := $$(addprefix $$(m4-prefix)/,$$($1-in))
	$1-y    := $$(prefix)/$3
endef

ifneq ($(minimize),)
	minimize := -terser
endif

clean-y :=
distclean-y :=

onchange-in :=
deploy-ready-y :=

prefix-y := $(m4-prefix) $(static-prefix)

.PHONY: deploy-ready

deploy-ready:

include build_tool/images.mak

include build_tool/fonts.mak

include build_tool/notice.mak

include build_tool/license.mak

include build_tool/lib.mak

include build_tool/page.mak

include build_tool/css.mak

include build_tool/html.mak

include build_tool/headers.mak

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
