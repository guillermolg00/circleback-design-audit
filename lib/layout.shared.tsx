import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const sectionLinks: NonNullable<BaseLayoutProps['links']> = [
  { text: 'Foundations', url: '/docs/foundations/scale', active: 'nested-url' },
  { text: 'Components', url: '/docs/components/page-header', active: 'nested-url' },
  { text: 'User experience', url: '/docs/ux', active: 'nested-url' },
  { text: 'Proposal', url: '/docs/proposal/tokens', active: 'nested-url' },
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="cb-brand">
          {/* Official Circleback wordmark, served from circleback.ai/logos/circleback.svg */}
          <img src="/brand/circleback-wordmark.svg" alt="Circleback" width={95} height={13} />
          <span className="cb-brand-sep" aria-hidden="true" />
          <span className="cb-brand-label">Design audit</span>
        </span>
      ),
    },
    themeSwitch: { enabled: false },
  };
}
