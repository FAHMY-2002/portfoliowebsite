import { copy } from '../data/copy.js';
import Page from '../components/Page.jsx';
import { TLink } from '../components/Transition.jsx';
import './Simple.css';

export default function NotFound() {
  const { notFound } = copy;
  return (
    <Page sceneMode="idle" footer="compact" className="simple">
      <section className="simple__section section wrap">
        <p className="label" data-intro="fade" data-at="0.5">
          <span className="dot" aria-hidden="true" /> {notFound.label}
        </p>
        <h1 className="simple__title display" data-intro="lines" data-at="0">
          {notFound.title}
        </h1>
        <p data-intro="fade" data-at="0.7">
          <TLink to="/" label="Home" className="label link">
            <span aria-hidden="true">←</span> {notFound.cta}
          </TLink>
        </p>
      </section>
    </Page>
  );
}
