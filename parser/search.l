/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <39@barroit.sh>
 */

%%

\s+		;

\-or\b		return 'OR'
\-not\b		return 'NOT'

\-[a-zA-Z0-9_]+	return 'FILTER_TYPE'

"("		return '('
")"		return ')'

[^\s\(\)]+	return 'WORD'

<<EOF>>		return 'EOF'
