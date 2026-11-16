import { useCallback, useRef } from 'react';
import { useGenerate } from '../hooks/useGenerate.js';

// Wraps one section so it "generates" the first time it scrolls into view.
//   <Generate as="section" index={3} name="stack" className="stack section">…</Generate>
// Options: index (build order on the page, 1-based), name (shown in the status label),
// order (content phases, e.g. ['text', 'heading', 'image', 'components']),
// speed (multiplies every duration: 0.8 is faster, 1.2 slower),
// innerRef (lets the section keep its own ref, e.g. for its own ScrollTrigger).
export default function Generate({ as: Tag = 'section', index, name, order, speed, innerRef, children, ...rest }) {
  const ref = useRef(null);
  const setRef = useCallback(
    (el) => {
      ref.current = el;
      if (innerRef) innerRef.current = el;
    },
    [innerRef],
  );
  useGenerate(ref, { index, name, order, speed });
  return (
    <Tag ref={setRef} data-generate={name} {...rest}>
      {children}
    </Tag>
  );
}
