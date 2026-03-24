# SPDX-License-Identifier: GPL-3.0-or-later

headers-in := _headers
headers-y  := $(pubdir)/$(headers-in)

onchange-in += $(headers-in)
deploy-ready-y += $(headers-y)

$(headers-y): $(headers-in) | $(pubdir)
	m4 $${DEV:+-DDEV} $< >$@

clean-y += clean-headers

.PHONY: clean-headers

clean-headers:
	rm -f $(headers-y)
