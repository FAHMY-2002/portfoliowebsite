// One place that registers GSAP plugins and sets the site-wide easing and durations.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import { bezier, seconds } from './tokens.js';

export const EASE = 'site';
export const DUR = { fast: 0.5, base: 1, slow: 1.4 };

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
  CustomEase.create(EASE, bezier('--ease', '0.16,1,0.3,1'));
  DUR.fast = seconds('--dur-fast', DUR.fast);
  DUR.base = seconds('--dur-base', DUR.base);
  DUR.slow = seconds('--dur-slow', DUR.slow);
  gsap.defaults({ ease: EASE, duration: DUR.base });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
