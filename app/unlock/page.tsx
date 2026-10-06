import type { Metadata } from 'next';
import { safeNext } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Private',
};

export default async function UnlockPage(props: PageProps<'/unlock'>) {
  const params = await props.searchParams;
  const next = safeNext(params.next);
  const failed = params.error === '1';

  return (
    <main className="cb-unlock">
      <form className="cb-unlock-card" method="post" action="/api/unlock">
        <img className="cb-unlock-mark" src="/brand/circleback-mark.png" alt="" width={49} height={40} />
        <p className="cb-eyebrow">Design audit</p>
        <h1 className="cb-display">This audit is private</h1>
        <p className="cb-unlock-text">Enter the password you received to continue.</p>
        <input type="hidden" name="next" value={next} />
        <label className="cb-unlock-field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            autoFocus
            aria-invalid={failed || undefined}
            aria-describedby={failed ? 'unlock-error' : undefined}
          />
        </label>
        {failed ? (
          <p id="unlock-error" className="cb-unlock-error" role="alert">
            That password didn’t work. Check it and try again.
          </p>
        ) : null}
        <button type="submit" className="cb-home-btn" data-variant="primary">
          Continue
        </button>
      </form>
    </main>
  );
}
