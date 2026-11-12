import { useEffect, useState } from 'react';
import { copy } from '../data/copy.js';
import { site } from '../data/site.js';
import Page from '../components/Page.jsx';
import RoundButton from '../components/RoundButton.jsx';
import './Contact.css';

export default function Contact() {
  const { contact } = copy;
  const [next, setNext] = useState('');

  // FormSubmit redirects back to this absolute URL after a successful send.
  useEffect(() => setNext(window.location.origin + site.form.successPath), []);

  return (
    <Page sceneMode="idle" footer="compact" className="contact">
      <section className="contact__section section wrap">
        <div className="contact__top">
          <p className="label" data-intro="fade" data-at="0.5">
            {contact.label}
          </p>
          <p className="label status" data-intro="fade" data-at="0.6">
            <span className="dot" aria-hidden="true" />
            {site.availability}
          </p>
        </div>

        <h1 className="contact__title display" data-intro="lines" data-at="0">
          {contact.title}
        </h1>

        <div className="contact__grid grid">
          <div className="contact__aside" data-intro="fade" data-at="0.6">
            <p className="label label--muted">{contact.kicker}</p>
            <ul className="contact__links">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a className="link lead" href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label} <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form className="form" action={site.form.action} method="POST" data-intro="fade" data-at="0.7">
            <div className="form__field">
              <label className="label label--muted" htmlFor="name">
                01 / {contact.fields.name.label}
              </label>
              <input id="name" name="name" type="text" autoComplete="name" required placeholder={contact.fields.name.placeholder} />
            </div>
            <div className="form__field">
              <label className="label label--muted" htmlFor="email">
                02 / {contact.fields.email.label}
              </label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder={contact.fields.email.placeholder} />
            </div>
            <div className="form__field">
              <label className="label label--muted" htmlFor="message">
                03 / {contact.fields.message.label}
              </label>
              <textarea id="message" name="message" rows={4} required placeholder={contact.fields.message.placeholder} />
            </div>
            <input type="hidden" name="_next" value={next} />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" hidden />
            <div className="form__submit">
              <RoundButton type="submit" variant="ink">
                {contact.submit}
              </RoundButton>
            </div>
          </form>
        </div>
      </section>
    </Page>
  );
}
