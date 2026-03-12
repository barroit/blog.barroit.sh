/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

const WEEKDAYS = [
	'Sun',
	'Mon',
	'Tue',
	'Wed',
	'Thu',
	'Fri',
	'Sat',
]

const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
]

const dt_name_map = {
	yr: 'year',
	mo: 'month',
	d:  'day',
	hr: 'hour',
	m:  'minute',
}

const clock_fmt = new Intl.DateTimeFormat('en-US', {
	timeZone: 'Asia/Tokyo',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
	timeZoneName: 'longOffset',
})

export function time_span(begin, end)
{
	let yr = end.getFullYear() - begin.getFullYear()
	let mo = end.getMonth() - begin.getMonth()
	let d = end.getDate() - begin.getDate()
	let hr = end.getHours() - begin.getHours()
	let m = end.getMinutes() - begin.getMinutes()

	if (m < 0) {
		m += 60
		hr--
	}

	if (hr < 0) {
		hr += 24
		d--
	}

	if (d < 0) {
		const prev = new Date(end.getFullYear(), end.getMonth(), 0)

		d += prev.getDate()
		mo--
	}

	if (mo < 0) {
		mo += 12
		yr--
	}

	return { yr, mo, d, hr, m }
}

export function time_span_now(begin)
{
	const now = new Date()

	return time_span(begin, now)
}

function dt_to_str(name, time)
{
	const suffix = time > 1 ? 's' : ''

	return `${time} ${name}${suffix}`
}

export function time_to_str(time, stop_at)
{
	const strs = []
	let cnt = 0

	for (const memb in dt_name_map) {
		if (memb == stop_at)
			break

		const str = dt_to_str(dt_name_map[memb], time[memb])

		strs.push(str)
		cnt++
	}

	return strs.join(', ')
}

export function time_to_approx(time)
{
	for (const memb in dt_name_map) {
		if (time[memb])
			return [ memb, time[memb] ]
	}
}

export function time_to_clock(time)
{
	const parts = clock_fmt.formatToParts(time)
	const { value: hr } = parts.find(({ type }) => type == 'hour')
	const { value: m } = parts.find(({ type }) => type == 'minute')

	const { value: tz } = parts.find(({ type }) => type == 'timeZoneName')
	const offset = tz.replace(/^GMT/, '')

	return { hr, m, offset }
}
