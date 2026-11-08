import { ProjectsTable } from '@/components/ProjectsTable/ProjectsTable';
import type { Project } from '@/data/projects';
import styles from './ProjectsSection.module.scss';

interface ProjectsSectionProps {
  id: string;
  projects: Project[];
}

export function ProjectsSection({ id, projects }: ProjectsSectionProps) {
  return (
    <section id={id} className={styles.projects}>
      <h2 className={styles.header}>project log</h2>
      <p className={styles.instructions}>
        click any row to see details and view project
      </p>
      <div className={styles.table}>
        <ProjectsTable projects={projects} />
      </div>
    </section>
  );
}
