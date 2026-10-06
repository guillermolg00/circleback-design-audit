import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { generateOGImage } from 'fumadocs-ui/og';
import { appName, getPageImageUrl } from '@/lib/shared';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  // The OG renderer has no glyph for ⌘ and fails to fetch one, so spell it out.
  const og = (text?: string) => text?.replace(/⌘\s?/g, 'Cmd+');

  // Circleback's "C." mark and brand orange instead of the Fumadocs defaults.
  const mark = await readFile(join(process.cwd(), 'public/brand/circleback-mark.png'));

  return generateOGImage({
    title: og(page.data.title),
    description: og(page.data.description),
    site: appName,
    primaryColor: 'rgba(242, 78, 29, 0.35)',
    primaryTextColor: '#f24e1d',
    icon: <img src={`data:image/png;base64,${mark.toString('base64')}`} width={70} height={56} alt="" />,
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
