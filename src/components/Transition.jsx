import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { DUR, gsap, ScrollTrigger } from '../lib/gsap.js';
import { env } from '../lib/env.js';
import { scrollTo } from '../lib/scroll.js';
import { stage } from '../lib/stage.js';
import './Transition.css';

// Route transitions: a full-screen "div" rises to cover the page, the route
// changes underneath it, then it lifts away and the new page's intro plays.
const TransitionContext = createContext({ go: () => {}, pageMounted: () => {} });
export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = useRef(location.pathname);
  const panel = useRef(null);
  const label = useRef(null);
  const busy = useRef(false);
  const pending = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    pathname.current = location.pathname;
  }, [location.pathname]);

  const go = useCallback(
    (to, { label: text = '' } = {}) => {
      const [path, hash] = to.split('#');
      const target = path || pathname.current;
      if (target === pathname.current) {
        scrollTo(hash ? `#${hash}` : 0);
        return;
      }
      if (busy.current) return;
      if (env.get().reduced) {
        pending.current = { hash, instant: true };
        navigate(target);
        return;
      }
      busy.current = true;
      label.current.textContent = text;
      gsap
        .timeline()
        .set(panel.current, { visibility: 'visible', transformOrigin: '50% 100%' })
        .fromTo(panel.current, { scaleY: 0 }, { scaleY: 1, duration: DUR.fast * 1.3 })
        .fromTo(label.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: DUR.fast }, 0.15)
        .call(() => {
          stage.set({ shown: false });
          pending.current = { hash };
          navigate(target);
        });
    },
    [navigate],
  );

  // Called by <Page> once the new route's content is in the DOM.
  const pageMounted = useCallback(() => {
    const job = pending.current;
    pending.current = null;
    if (first.current) {
      first.current = false;
      return;
    }
    scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
    if (job?.hash) scrollTo(`#${job.hash}`, { immediate: true });
    if (!job || job.instant) return;
    stage.set({ shown: true });
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
          gsap.set(panel.current, { visibility: 'hidden' });
        },
      })
      .to(label.current, { autoAlpha: 0, y: -16, duration: DUR.fast * 0.6 })
      .set(panel.current, { transformOrigin: '50% 0%' })
      .to(panel.current, { scaleY: 0, duration: DUR.base * 0.9 }, '<0.1');
  }, []);

  const value = useMemo(() => ({ go, pageMounted }), [go, pageMounted]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div className="transition" ref={panel} aria-hidden="true">
        <span className="transition__label label" ref={label} />
      </div>
    </TransitionContext.Provider>
  );
}

// Internal link that runs the transition. Renders a real <a href> for SEO and keyboard use.
export function TLink({ to, label, onClick, children, ...rest }) {
  const { go } = useTransition();
  const handle = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(to, { label });
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
