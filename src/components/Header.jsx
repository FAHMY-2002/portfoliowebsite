import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { site } from '../data/site.js';
import { lockScroll } from '../lib/scroll.js';
import { TLink } from './Transition.jsx';
import './Header.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="header" data-gen-header="">
        <TLink
          to="/"
          data-gen="component"
          className="header__brand label"
          aria-label={`${site.brand}, home`}
          onClick={() => setOpen(false)}
        >
          <span className="box" aria-hidden="true" />
          {site.brand}
        </TLink>
        <nav className="header__nav" aria-label="Primary">
          <ul>
            {site.nav.map((item) => (
              <li key={item.to} data-gen="component">
                <TLink to={item.to} label={item.label} className="header__link label">
                  {item.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="header__toggle label"
          data-gen="component"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      <div id="menu" className={`menu${open ? ' is-open' : ''}`} inert={!open}>
        <nav aria-label="Mobile">
          <ul className="menu__list">
            {site.nav.map((item, i) => (
              <li key={item.to} style={{ '--i': i }}>
                <TLink to={item.to} label={item.label} className="menu__link" onClick={() => setOpen(false)}>
                  <span className="num label">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display">{item.label}</span>
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="menu__social">
          {site.social.map((s) => (
            <li key={s.label}>
              <a className="label link" href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
