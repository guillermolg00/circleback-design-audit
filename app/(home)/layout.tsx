import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions, sectionLinks } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()} links={sectionLinks}>
      {children}
    </HomeLayout>
  );
}
