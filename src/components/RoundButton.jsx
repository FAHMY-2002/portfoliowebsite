import { useRef } from 'react';
import { useMagnetic } from '../hooks/useMagnetic.js';
import { TLink } from './Transition.jsx';
import './RoundButton.css';

// The large magnetic call-to-action. Renders an internal link, an external link or a button.
export default function RoundButton({ to, href, type, children, variant = 'accent', label, ...rest }) {
  const ref = useRef(null);
  useMagnetic(ref, 0.3);
  const className = `round-btn round-btn--${variant}`;
  const content = (
    <>
      <span className="round-btn__text label">{children}</span>
      <span className="round-btn__arrow" aria-hidden="true">
        ↗
      </span>
    </>
  );
  return (
    <span className="round-btn__wrap" ref={ref}>
      {to ? (
        <TLink to={to} label={label} className={className} {...rest}>
          {content}
        </TLink>
      ) : href ? (
        <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
          {content}
        </a>
      ) : (
        <button type={type || 'button'} className={className} {...rest}>
          {content}
        </button>
      )}
    </span>
  );
}
