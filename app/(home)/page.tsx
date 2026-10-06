import Link from 'next/link';
import { ArrowRight, BookOpen, Compass, Component, Shapes, Sparkles, Table } from 'lucide-react';

const sections = [
  {
    href: '/docs',
    icon: BookOpen,
    title: 'Overview and method',
    text: 'What was measured, how, and the five conclusions that matter.',
  },
  {
    href: '/docs/foundations/scale',
    icon: Shapes,
    title: 'Foundations',
    text: 'Radius, heights, type, borders, icons and spacing: the real scale against the proposed one.',
  },
  {
    href: '/docs/components/page-header',
    icon: Component,
    title: 'Components',
    text: 'Fourteen components documented as stories: current state, measurements, proposal and rule.',
  },
  {
    href: '/docs/ux',
    icon: Compass,
    title: 'User experience',
    text: 'Ten findings, each with a priority, evidence and a concrete proposal.',
  },
  {
    href: '/docs/proposal/tokens',
    icon: Sparkles,
    title: 'Proposal',
    text: 'Tokens, rules per component and a roadmap of fifteen changes in three stages.',
  },
  {
    href: '/docs/appendix',
    icon: Table,
    title: 'Appendix',
    text: 'Every measured value, screen by screen.',
  },
];

const stats = [
  ['8', 'radii', '4–16px, plus pill'],
  ['12', 'control heights', '20–40px'],
  ['9', 'icon sizes', '9–18px'],
  ['5', 'font weights', '450–700'],
  ['4', 'border grays', 'in 3 widths'],
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 flex-1">
      <section className="cb-home-hero">
        <img className="cb-home-mark" src="/brand/circleback-mark.png" alt="" width={49} height={40} />
        <p className="cb-eyebrow">Design audit · Web app · Dark mode</p>
        <h1 className="cb-display">Circleback: visual consistency and user experience</h1>
        <p>
          A review of the app, measured live and documented as a design system: every component with its current
          state, its measurements, the proposal and the rule behind it. With Linear as the reference and
          thirty-four annotated screenshots.
        </p>
        <div className="cb-home-actions">
          <Link href="/docs" className="cb-home-btn" data-variant="primary">
            Read the audit
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link href="/docs/proposal/roadmap" className="cb-home-btn">
            See the roadmap
          </Link>
        </div>
      </section>

      <div className="cb-stats-wrap">
        <div className="cb-stats" role="list">
          {stats.map(([n, label, detail]) => (
            <div className="cb-stat" role="listitem" key={label}>
              <b>{n}</b>
              <span>{label}</span>
              <small>{detail}</small>
            </div>
          ))}
        </div>
      </div>

      <nav className="cb-home-grid" aria-label="Sections">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="cb-home-card">
            <span className="cb-home-icon" aria-hidden="true">
              <s.icon />
            </span>
            <span className="cb-home-card-text">
              <b>{s.title}</b>
              <span>{s.text}</span>
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
