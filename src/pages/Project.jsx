import { useParams } from 'react-router';
import { copy } from '../data/copy.js';
import { getNextProject, getProject, projects } from '../data/projects.js';
import { projectImage } from '../lib/images.js';
import Media from '../components/Media.jsx';
import Page from '../components/Page.jsx';
import RoundButton from '../components/RoundButton.jsx';
import { TLink } from '../components/Transition.jsx';
import NotFound from './NotFound.jsx';
import './Project.css';

const pad = (n) => String(n).padStart(2, '0');

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

  return (
    <Page sceneMode="off" footer="full" className="project">
      <header className="project__head section wrap">
        <div className="project__bar">
          <p data-intro="fade" data-at="0.5">
            <TLink to="/#work" label={copy.work.label} className="label link">
              <span aria-hidden="true">←</span> {copy.project.back}
            </TLink>
          </p>
          <p className="label num" data-intro="fade" data-at="0.6">
            {pad(index + 1)} / {pad(projects.length)}
          </p>
        </div>

        <h1 className="project__name display" data-intro="chars" data-at="0">
          {project.name}
        </h1>

        <div className="project__info grid">
          <dl className="project__meta">
            {meta.map(([label, value], i) => (
              <div key={label} className="project__field" data-intro="fade" data-at={0.55 + i * 0.07}>
                <dt className="label label--muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="project__visit" data-intro="fade" data-at="0.9">
            <RoundButton href={project.url} variant="ink">
              {copy.project.visit}
            </RoundButton>
          </div>
        </div>
      </header>

      <div className="project__visual section wrap">
        <Media image={projectImage(project.image)} alt={`${project.name} website`} ratio={project.ratio} sizes="96vw" eager parallax={false} />
      </div>

      <section className="project__stack section wrap" aria-labelledby="project-stack">
        <div className="section-head" data-reveal="fade">
          <h2 id="project-stack" className="label">
            {fields.stack}
          </h2>
          <p className="label num label--muted">({pad(project.stack.length)})</p>
        </div>
        <ul className="project__stack-list">
          {project.stack.map((tech, i) => (
            <li key={tech} className="project__tech">
              <span className="num label label--muted">{pad(i + 1)}</span>
              <span className="display" data-reveal="lines">
                {tech}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <TLink to={`/work/${next.slug}`} label={next.name} className="project__next section wrap" data-cursor="Next">
        <span className="section-head">
          <span className="label">{copy.project.next}</span>
          <span className="label num label--muted">
            {pad(projects.indexOf(next) + 1)} / {pad(projects.length)}
          </span>
        </span>
        <span className="project__next-row">
          <span className="project__next-name display" data-reveal="lines">
            {next.name}
          </span>
          <span className="project__next-media">
            <Media image={projectImage(next.image)} alt="" ratio={next.ratio} sizes="(min-width: 768px) 30vw, 92vw" />
          </span>
        </span>
      </TLink>
    </Page>
  );
}
