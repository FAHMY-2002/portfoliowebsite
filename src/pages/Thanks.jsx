import { copy } from '../data/copy.js';
import Page from '../components/Page.jsx';
import { TLink } from '../components/Transition.jsx';
import './Simple.css';

export default function Thanks() {
  const { thanks } = copy;
  return (
    <Page sceneMode="idle" footer="compact" className="simple">
      <section className="simple__section section wrap">
        <p className="label" data-intro="fade" data-at="0.5">
          <span className="dot" aria-hidden="true" /> {thanks.label}
        </p>
        <h1 className="simple__title display" data-intro="lines" data-at="0">
          {thanks.title}
        </h1>
        <p className="simple__body lead" data-intro="lines" data-at="0.5">
          {thanks.body}
        </p>
        <p data-intro="fade" data-at="0.8">
          <TLink to="/" label="Home" className="label link">
            <span aria-hidden="true">←</span> {thanks.cta}
          </TLink>
        </p>
      </section>
    </Page>
  );
}
