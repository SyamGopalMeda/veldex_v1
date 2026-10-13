import type { ReactNode } from 'react';
import { Reveal, Lines } from '../Reveal';

interface SectionHeadProps {
  /** Two-digit section number, e.g. "01" (optional) */
  num?: string;
  kicker: string;
  /** Title lines (each rises from a mask) */
  title: ReactNode[];
  /** Right-hand column: lead text or a link */
  aside?: ReactNode;
  className?: string;
}

/** Section header used on every page: numbered kicker, masked title, optional aside. */
export function SectionHead({ num, kicker, title, aside, className = '' }: SectionHeadProps) {
  return (
    <div className={`vx-head ${className}`}>
      <div>
        <Reveal mode="fade">
          <span className="vx-kicker">{num && <b>{num}</b>}{num && <i />}{kicker}</span>
        </Reveal>
        <Reveal as="h2" mode="lines" className="vx-h2" style={{ marginTop: '1.25rem' }}>
          <Lines lines={title} />
        </Reveal>
      </div>
      {aside && <Reveal delay={150} className="vx-head-aside">{aside}</Reveal>}
    </div>
  );
}
