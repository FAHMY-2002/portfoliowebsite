import { useEffect, useState } from 'react';
import { useBuild } from '../lib/build.js';
import { useEnv } from '../lib/env.js';
import { GENERATE } from '../lib/generate.config.js';
import './BuildStatus.css';

const pad = (n) => String(n).padStart(2, '0');

// Fixed "building 03 / 05" indicator. Shows while the page builds, says "built" when
// every section is done, then fades away. Hidden when nothing is left to build.
export default function BuildStatus() {
  const { total, done, current, active } = useBuild();
  const reduced = useEnv((e) => e.reduced);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      return;
    }
    const id = setTimeout(() => setVisible(false), GENERATE.progress.hideAfter * 1000);
    return () => clearTimeout(id);
  }, [active]);

  // With reduced motion there is no build to watch: sections simply fade in.
  if (!total || reduced) return null;
  const complete = done >= total;
  return (
    <div className={`build-status label${visible ? ' is-visible' : ''}`} aria-hidden="true">
      <span className="build-status__bar">
        <span className="build-status__fill" style={{ transform: `scaleX(${done / total})` }} />
      </span>
      <span className="num">
        {complete ? 'built' : 'building'} {pad(complete ? total : Math.min(current, total))} / {pad(total)}
        {complete ? ' ✓' : ''}
      </span>
    </div>
  );
}
