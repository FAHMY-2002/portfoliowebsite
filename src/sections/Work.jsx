import { useEffect, useRef, useState } from 'react';
import { copy } from '../data/copy.js';
import { categories, projects } from '../data/projects.js';
import { projectImage } from '../lib/images.js';
import { ScrollTrigger } from '../lib/gsap.js';
import { scene } from '../three/sceneState.js';
import Generate from '../components/Generate.jsx';
import Media from '../components/Media.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { TLink } from '../components/Transition.jsx';
import './Work.css';

const images = projects.map((p) => projectImage(p.image));

// Project list. With a mouse, hovering a row shows its screenshot on a WebGL plane
// that follows the cursor (see three/PreviewPlane.jsx). On touch devices, without
// WebGL, or with reduced motion, each row shows its screenshot inline instead.
export default function Work() {
  const [filter, setFilter] = useState('All');
  const mounted = useRef(false);

  useEffect(() => {
    scene.preview.sources = images.map((img) => img.small);
    scene.preview.ratios = projects.map((p) => p.ratio);
    return () => {
      scene.preview.visible = false;
    };
  }, []);

  // The list height changes with the filter, so scroll positions must be re-measured.
  useEffect(() => {
    if (mounted.current) ScrollTrigger.refresh();
    mounted.current = true;
  }, [filter]);

  const show = (index) => {
    scene.preview.index = index;
    scene.preview.visible = true;
    scene.wake();
  };
  const hide = () => {
    scene.preview.visible = false;
    scene.wake();
  };
  const count = (c) => (c === 'All' ? projects.length : projects.filter((p) => p.category === c).length);

  return (
    <Generate as="section" index={4} name="projects" id="work" className="work section">
      <div className="wrap">
        <SectionHead num="04" label={copy.work.label}>
          <ul className="work__filters" aria-label="Filter projects">
            {categories.map((c) => (
              <li key={c}>
                <button type="button" className="work__filter label" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                  {c} <span className="num">({count(c)})</span>
                </button>
              </li>
            ))}
          </ul>
        </SectionHead>

        <h2 className="work__title display" data-gen="heading">
          {copy.work.title}
        </h2>

        <ul className="work__list" onMouseLeave={hide}>
          {projects.map((p, i) => (
            <li key={p.slug} className="work__item" hidden={filter !== 'All' && p.category !== filter} data-gen-box="">
              <TLink to={`/work/${p.slug}`} label={p.name} className="work__row" data-cursor="View" onMouseEnter={() => show(i)}>
                <span className="work__num num label" data-gen="component">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="work__media">
                  <Media
                    image={images[i]}
                    alt={`${p.name} website`}
                    ratio={p.ratio}
                    sizes="(min-width: 768px) 38vw, 92vw"
                    parallax={false}
                  />
                </div>
                <span className="work__name display" data-gen="heading">
                  {p.name}
                </span>
                <span className="work__desc" data-gen="text">
                  {p.description}
                </span>
                <span className="work__cat label label--muted" data-gen="component">
                  {p.category}
                </span>
                <span className="work__arrow" aria-hidden="true" data-gen="component">
                  ↗
                </span>
              </TLink>
            </li>
          ))}
        </ul>
      </div>
    </Generate>
  );
}
