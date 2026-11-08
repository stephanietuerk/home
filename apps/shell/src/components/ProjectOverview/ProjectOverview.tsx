'use client';

import { useState } from 'react';
import { ProjectArrow } from '@/components/ProjectArrow/ProjectArrow';
import { ProjectPageLink } from '@/components/ProjectPageLink/ProjectPageLink';
import type { Project, ProjectLink } from '@/data/projects';
import styles from './ProjectOverview.module.scss';

export function ProjectOverview({ project }: { project: Project }) {
  const images = project.images ?? [];

  return (
    <div className={styles.overview}>
      {project.description.map((text, i) => (
        <p key={i} className={styles.text}>
          {text}
        </p>
      ))}
      <div className={styles.links}>
        {project.links.map((link) => (
          <OverviewLink key={link.name} project={project} link={link} />
        ))}
      </div>
      {images.length > 0 && (
        <div
          className={[styles.images, images.length > 1 && styles.multi]
            .filter(Boolean)
            .join(' ')}
        >
          {images.map((image, i) => (
            <div key={image.path} className={styles.imageContainer}>
              <img
                className={styles.image}
                src={image.path}
                alt={`screenshot ${i + 1} of ${project.title}: ${image.altText}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OverviewLink({
  project,
  link,
}: {
  project: Project;
  link: ProjectLink;
}) {
  const [hovered, setHovered] = useState(false);
  const label = `View ${link.name.toLowerCase()}`;

  if (link.disabled) {
    return (
      <span
        className={`${styles.link} ${styles.disabled}`}
        aria-disabled="true"
      >
        {label}
        <ProjectArrow hovered={false} className={styles.arrow} />
        <span className={styles.disabledLabel}>(disabled)</span>
      </span>
    );
  }

  const linkProps = {
    className: styles.link,
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    children: (
      <>
        {label}
        <ProjectArrow hovered={hovered} className={styles.arrow} />
      </>
    ),
  };

  if (link.kind === 'page') {
    return <ProjectPageLink project={project} {...linkProps} />;
  }
  return <a href={link.url} target="_blank" rel="noopener" {...linkProps} />;
}
