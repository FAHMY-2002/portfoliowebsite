import { useParams } from 'react-router';
import { copy } from '../data/copy.js';
import { getNextProject, getProject, projects } from '../data/projects.js';
import { projectImage } from '../lib/images.js';
import Generate from '../components/Generate.jsx';
import Media from '../components/Media.jsx';
import Page from '../components/Page.jsx';
import RoundButton from '../components/RoundButton.jsx';
import { TLink } from '../components/Transition.jsx';
import NotFound from './NotFound.jsx';
import './Project.css';

const pad = (n) => String(n).padStart(2, '0');
// Longest word, in characters: lets CSS shrink long names so no word is wider than the screen.
const fit = (name) => ({ '--fit': Math.max(...name.split(/\s+/).map((w) => w.length)) });

export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;

  const index = projects.indexOf(project);
  const next = getNextProject(slug);
  const { fields } = copy.project;
  const meta = [
    [fields.type, project.description],
    [fields.role, project.role],
    [fields.year, project.year],
    [fields.category, project.category],
  ].filter(([, value]) => value);
  // Build order of this page's sections (the summary section is optional).
  const at = project.summary ? { about: 3, stack: 4, next: 5, footer: 6 } : { stack: 3, next: 4, footer: 5 };

  return (
    <Page sceneMode="off" footer="full" footerIndex={at.footer} className="project">
      <Generate as="header" index={1} name="project" className="project__head section wrap">
        <div className="project__bar">
          <p data-gen="component">
            <TLink to="/#work" label={copy.work.label} className="label link">
              <span aria-hidden="true">←</span> {copy.project.back}
            </TLink>
          </p>
          <p className="label num" data-gen="component">
            {pad(index + 1)} / {pad(projects.length)}
          </p>
        </div>

        <h1 className="project__name display" data-gen="heading" style={fit(project.name)}>
          {project.name}
        </h1>

        <div className="project__info grid">
          <dl className="project__meta">
            {meta.map(([label, value]) => (
              <div key={label} className="project__field" data-gen="component">
                <dt className="label label--muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="project__visit" data-gen="component">
            <RoundButton href={project.url} variant="ink">
              {copy.project.visit}
            </RoundButton>
          </div>
        </div>
      </Generate>

      <Generate as="div" index={2} name="preview" className="project__visual section wrap">
        <Media
          image={projectImage(project.image)}
          alt={`${project.name} website`}
          ratio={project.ratio}
          sizes="96vw"
          eager
          parallax={false}
        />
      </Generate>

      {project.summary && (
        <Generate
          as="section"
          index={at.about}
          name="about"
          className="project__about section wrap"
          aria-labelledby="project-about"
        >
          <div className="section-head" data-gen="component">
            <h2 id="project-about" className="label">
              {fields.about}
            </h2>
          </div>
          <p className="project__summary lead" data-gen="text">
            {project.summary}
          </p>
        </Generate>
      )}

      <Generate
        as="section"
        index={at.stack}
        name="stack"
        className="project__stack section wrap"
        aria-labelledby="project-stack"
      >
        <div className="section-head" data-gen="component">
          <h2 id="project-stack" className="label">
            {fields.stack}
          </h2>
          <p className="label num label--muted">({pad(project.stack.length)})</p>
        </div>
        <ul className="project__stack-list">
          {project.stack.map((tech, i) => (
            <li key={tech} className="project__tech" data-gen-box="">
              <span className="num label label--muted" data-gen="component">
                {pad(i + 1)}
              </span>
              <span className="display" data-gen="heading">
                {tech}
              </span>
            </li>
          ))}
        </ul>
      </Generate>

      <Generate as="div" index={at.next} name="next">
        <TLink to={`/work/${next.slug}`} label={next.name} className="project__next section wrap" data-cursor="Next">
          <span className="section-head" data-gen="component">
            <span className="label">{copy.project.next}</span>
            <span className="label num label--muted">
              {pad(projects.indexOf(next) + 1)} / {pad(projects.length)}
            </span>
          </span>
          <span className="project__next-row">
            <span className="project__next-name display" data-gen="heading" style={fit(next.name)}>
              {next.name}
            </span>
            <span className="project__next-media">
              <Media image={projectImage(next.image)} alt="" ratio={next.ratio} sizes="(min-width: 768px) 30vw, 92vw" />
            </span>
          </span>
        </TLink>
      </Generate>
    </Page>
  );
}
