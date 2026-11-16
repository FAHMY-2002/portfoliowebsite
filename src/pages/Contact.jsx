import { useEffect, useState } from 'react';
import { copy } from '../data/copy.js';
import { site } from '../data/site.js';
import Generate from '../components/Generate.jsx';
import Page from '../components/Page.jsx';
import RoundButton from '../components/RoundButton.jsx';
import './Contact.css';

export default function Contact() {
  const { contact } = copy;
  const [next, setNext] = useState('');

  // FormSubmit redirects back to this absolute URL after a successful send.
  useEffect(() => setNext(window.location.origin + site.form.successPath), []);

  return (
    <Page sceneMode="idle" footer="compact" footerIndex={2} className="contact">
      <Generate as="section" index={1} name="contact" className="contact__section section wrap">
        <div className="contact__top">
          <p className="label" data-gen="component">
            {contact.label}
          </p>
          <p className="label status" data-gen="component">
            <span className="dot" aria-hidden="true" />
            {site.availability}
          </p>
        </div>

        <h1 className="contact__title display" data-gen="heading">
          {contact.title}
        </h1>

        <div className="contact__grid grid">
          <div className="contact__aside" data-gen="component">
            <p className="label label--muted">{contact.kicker}</p>
            <ul className="contact__links">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a className="link lead" href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}{' '}
                    <span className="arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form className="form" action={site.form.action} method="POST" data-gen-box="">
            <div className="form__field" data-gen="component">
              <label className="label label--muted" htmlFor="name">
                01 / {contact.fields.name.label}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder={contact.fields.name.placeholder}
              />
            </div>
            <div className="form__field" data-gen="component">
              <label className="label label--muted" htmlFor="email">
                02 / {contact.fields.email.label}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={contact.fields.email.placeholder}
              />
            </div>
            <div className="form__field" data-gen="component">
              <label className="label label--muted" htmlFor="message">
                03 / {contact.fields.message.label}
              </label>
              <textarea id="message" name="message" rows={4} required placeholder={contact.fields.message.placeholder} />
            </div>
            <input type="hidden" name="_next" value={next} />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" hidden />
            <div className="form__submit" data-gen="component">
              <RoundButton type="submit" variant="ink">
                {contact.submit}
              </RoundButton>
            </div>
          </form>
        </div>
      </Generate>
    </Page>
  );
}
