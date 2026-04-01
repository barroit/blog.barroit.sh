/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import Flick from '../lib/flick.jsx'

function Field({ icon, children })
{ 

RETURN_JSX_BEGIN
<div class='flex items-center gap-x-3'>
  <div class='size-6 bg-zinc-800 mask-cover mask-(--mask)'
       style={ { '--mask': `url(${icon})` } }></div>
  <p>{ children }</p>
</div>
RETURN_JSX_END
}

function List({ title, children, ...props })
{

RETURN_JSX_BEGIN
<div { ...props }>
  <p>{ title }</p>
  <div class='ml-1.5 mt-3 flex gap-x-2 text-sm'>
    <div class='border-l-2 border-zinc-300'></div>
    { children }
  </div>
</div>
RETURN_JSX_END
}

function FieldList({ children, ...props })
{
	APPEND_CLASS(props, 'px-5 mx-auto space-y-2')

RETURN_JSX_BEGIN
<div { ...props }>
  { children }
</div>
RETURN_JSX_END
}

function fmt_notice([ path, href ])
{

RETURN_JSX_BEGIN
<>
  <p>{ path }</p>
  <a class='px-1' { ...{ href } }>
    <Flick>README</Flick>
  </a>
</>
RETURN_JSX_END
}

function fmt_license([ path, href ])
{

RETURN_JSX_BEGIN
<div>
  <a class='text-indigo-700' { ...{ href } }>
    <Flick>{ path }</Flick>
  </a>
</div>
RETURN_JSX_END
}

export default function Credit()
{
	const notices = notice_map.map(fmt_notice)
	const licenses = license_map.map(fmt_license)

RETURN_JSX_BEGIN
<div class='mt-10'>
  <div class='w-full h-[2px] select-none bg-zinc-300'></div>
  <div class='mt-5 mx-auto p-5 w-fit flex flex-col xl:flex-row
              items-center xl:items-start gap-y-10 gap-x-20 text-zinc-700'>
    <div class='space-y-5'>
      <FieldList>
        <Field icon='IMAGES_GOOGLE_LICENSE_SVG'>GPL-3.0-or-later</Field>
        <Field icon='IMAGES_GOOGLE_COPYRIGHT_SVG'>2026 Jiamu Sun</Field>
      </FieldList>
      <div class='w-full h-[2px] select-none bg-zinc-300'></div>
      <FieldList>
        <Field icon='IMAGES_GOOGLE_HOME_REPAIR_SERVICE_SVG'>
          preact & tailwind
        </Field>
        <Field icon='IMAGES_GOOGLE_BUILD_SVG'>make & m4</Field>
        <Field icon='IMAGES_GOOGLE_ARTICLE_SVG'>sphinx</Field>
        <Field icon='IMAGES_GOOGLE_DNS_SVG'>cloudflare workers</Field>
      </FieldList>
      <div class='w-full h-[2px] select-none bg-zinc-300'></div>
    </div>
    <div class='space-y-10 xl:flex gap-y-10 gap-x-20'>
      <List title='Resources'>
        <div class='grid grid-cols-[auto_1fr] gap-x-6 gap-y-5'>
          { notices }
        </div>
      </List>
      <List title='Licenses'>
        <div class='space-y-5'>
          { licenses }
        </div>
      </List>
    </div>
  </div>
</div>
RETURN_JSX_END
}
