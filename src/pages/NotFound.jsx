import { copy } from '../data/copy.js';
import Generate from '../components/Generate.jsx';
import Page from '../components/Page.jsx';
import { TLink } from '../components/Transition.jsx';
import './Simple.css';

export default function NotFound() {
  const { notFound } = copy;
  return (
    <Page sceneMode="idle" footer="compact" footerIndex={2} className="simple">
      <Generate as="section" index={1} name="not-found" className="simple__section section wrap">
        <p className="label" data-gen="component">
          <span className="dot" aria-hidden="true" /> {notFound.label}
        </p>
        <h1 className="simple__title display" data-gen="heading">
          {notFound.title}
        </h1>
        <p data-gen="component">
          <TLink to="/" label="Home" className="label link">
            <span aria-hidden="true">←</span> {notFound.cta}
          </TLink>
        </p>
      </Generate>
    </Page>
  );
}
