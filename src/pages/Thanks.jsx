import { copy } from '../data/copy.js';
import Generate from '../components/Generate.jsx';
import Page from '../components/Page.jsx';
import { TLink } from '../components/Transition.jsx';
import './Simple.css';

export default function Thanks() {
  const { thanks } = copy;
  return (
    <Page sceneMode="idle" footer="compact" footerIndex={2} className="simple">
      <Generate as="section" index={1} name="thanks" className="simple__section section wrap">
        <p className="label" data-gen="component">
          <span className="dot" aria-hidden="true" /> {thanks.label}
        </p>
        <h1 className="simple__title display" data-gen="heading">
          {thanks.title}
        </h1>
        <p className="simple__body lead" data-gen="text">
          {thanks.body}
        </p>
        <p data-gen="component">
          <TLink to="/" label="Home" className="label link">
            <span aria-hidden="true">←</span> {thanks.cta}
          </TLink>
        </p>
      </Generate>
    </Page>
  );
}
