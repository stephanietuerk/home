import { ProjectPageLink } from '@/components/ProjectPageLink';
import { projects, type Project, type ProjectLink } from '@/data/projects';

export default function Home() {
  return (
    <main className="landing">
      <header>
        <h1>Stephanie Tuerk</h1>
      </header>

      <section id="about">
        <h2>about</h2>
        <p>
          I am a product engineer / designer-developer hybrid who builds
          interfaces that prioritize intelligibility, utility, and delight and
          solve real-world needs. I love translating between quantitative data,
          language, and visual representation, and developing systematic
          solutions to both engineering and design challenges. My approach to
          this work draws significantly on my training as an architect and
          historian.
        </p>
      </section>

      <section id="projects">
        <h2>project log</h2>
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.id}>
              <h3>
                {project.title}
                {project.professional && '*'}
              </h3>
              <p className="project-meta">
                {project.type} · {project.year}
              </p>
              <ul className="project-links">
                {project.links.map((link) => (
                  <li key={link.name}>
                    <ProjectLinkItem project={project} link={link} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p>* indicates work done as part of my full-time job</p>
      </section>

      <section id="contact">
        <h2>contact</h2>
        <p>email: stephanie dot tuerk at gmail</p>
        <p>
          <a
            href="https://bsky.app/profile/stephanietuerk.net"
            target="_blank"
            rel="noopener"
          >
            Bluesky
          </a>{' '}
          ·{' '}
          <a
            href="https://www.linkedin.com/in/stephanie-tuerk/"
            target="_blank"
            rel="noopener"
          >
            LinkedIn
          </a>
        </p>
      </section>
    </main>
  );
}

function ProjectLinkItem({
  project,
  link,
}: {
  project: Project;
  link: ProjectLink;
}) {
  const label = `View ${link.name.toLowerCase()}`;

  if (link.disabled) {
    return <span className="disabled">{label} (disabled)</span>;
  }
  if (link.kind === 'page') {
    return <ProjectPageLink project={project}>{label}</ProjectPageLink>;
  }
  return (
    <a href={link.url} target="_blank" rel="noopener">
      {label}
    </a>
  );
}
