/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import Flick from '../lib/flick.jsx'
import SVG from '../lib/svg.jsx'

export function Field({ icon, children })
{ 

RETURN_JSX_BEGIN
<div class='flex items-center gap-x-3'>
  <SVG class='size-6 bg-zinc-800 dark:bg-zinc-200' { ...{ icon } }/>
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
    <div class='border-l-2 border-zinc-300 dark:border-neutral-400'></div>
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

function Link({ path, href })
{

RETURN_JSX_BEGIN
<a { ...{ href } } target='_blank'
   class='w-fit block text-indigo-700 dark:text-blue-400
          underline transition decoration-transparent
          HOT(decoration-black) HOT(decoration-white, dark:)'>
  <Flick>{ path }</Flick>
</a>
RETURN_JSX_END
}

export default function Credit()
{

RETURN_JSX_BEGIN
<div class='mt-10'>
  <div class='w-full h-[2px] select-none bg-zinc-300 dark:bg-neutral-400'></div>
  <div class='mt-5 mx-auto p-5 w-fit flex flex-col xl:flex-row
              items-center xl:items-start gap-y-10 gap-x-20
              text-zinc-700 dark:text-zinc-200'>
    <div class='space-y-5'>
      <FieldList>
        <Field icon='IMAGES_GOOGLE_LICENSE_SVG'>GPL-3.0-or-later</Field>
        <Field icon='IMAGES_GOOGLE_COPYRIGHT_SVG'>2026 Jiamu Sun</Field>
      </FieldList>
      <div class='w-full h-[2px] select-none bg-zinc-300 dark:bg-neutral-400'>
      </div>
      <FieldList>
        <Field icon='IMAGES_GOOGLE_HOME_REPAIR_SERVICE_SVG'>
          preact & tailwind
        </Field>
        <Field icon='IMAGES_GOOGLE_BUILD_SVG'>make & m4</Field>
        <Field icon='IMAGES_GOOGLE_ARTICLE_SVG'>sphinx</Field>
        <Field icon='IMAGES_GOOGLE_DATABASE_SVG'>sqlite3</Field>
        <Field icon='IMAGES_GOOGLE_DNS_SVG'>cloudflare workers</Field>
      </FieldList>
      <div class='w-full h-[2px] select-none bg-zinc-300 dark:bg-neutral-400'>
      </div>
    </div>
    <div class='space-y-10 xl:flex gap-y-10 gap-x-20'>
      <List title='Resources'>
        <div class='space-y-5'>
        { notice_map.map(([ path, href ]) => (
          <Link { ...{ path, href } }/>
        )) }
        </div>
      </List>
      <List title='Licenses'>
        <div class='space-y-5'>
        { license_map.map(([ path, href ]) => (
          <Link { ...{ path, href } }/>
        )) }
        </div>
      </List>
    </div>
  </div>
</div>
RETURN_JSX_END
}
