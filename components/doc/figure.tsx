import type { ReactNode } from 'react';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';

export interface FigureProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: ReactNode;
  /** Keep the image at its natural size (for small crops). */
  fit?: boolean;
  /** Load right away: set on the first screenshot of a page, which is usually the LCP element. */
  eager?: boolean;
}

export function Figure({ src, alt, width, height, caption, fit, eager }: FigureProps) {
  return (
    <figure className="cb-figure not-prose">
      <div className="cb-shot" data-fit={fit ? 'true' : undefined}>
        {/* never upscale a screenshot past its natural width: annotations turn soft */}
        <ImageZoom src={src} alt={alt} width={width} height={height} loading={eager ? 'eager' : undefined} style={{ maxWidth: `min(100%, ${width}px)` }} />
      </div>
      {caption ? <figcaption className="cb-caption">{caption}</figcaption> : null}
    </figure>
  );
}

export function Compare({ cols = 2, children }: { cols?: 2 | 3; children: ReactNode }) {
  return (
    <div className="cb-compare not-prose" data-cols={cols}>
      {children}
    </div>
  );
}
