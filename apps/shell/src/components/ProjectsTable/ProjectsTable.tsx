'use client';

import { Fragment, useState, type KeyboardEvent } from 'react';
import { ExpandArrow } from '@/components/ExpandArrow/ExpandArrow';
import { ProjectOverview } from '@/components/ProjectOverview/ProjectOverview';
import type { Project } from '@/data/projects';
import styles from './ProjectsTable.module.scss';

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(' ');

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  function toggle(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleRowKeyDown(event: KeyboardEvent, id: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle(id);
    }
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <colgroup>
          <col className={styles.colTitle} />
          <col className={styles.colType} />
          <col className={styles.colYear} />
          <col className={styles.colMore} />
        </colgroup>
        <thead>
          <tr className={styles.row}>
            <th className={styles.headerCell}>title</th>
            <th className={styles.headerCell}>type</th>
            <th className={cx(styles.headerCell, styles.year)}>year</th>
            <td />
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const expanded = expandedIds.has(project.id);
            const detailsId = `${project.id}-details`;
            return (
              <Fragment key={project.id}>
                <tr
                  tabIndex={0}
                  aria-expanded={expanded}
                  aria-controls={detailsId}
                  className={cx(
                    styles.row,
                    styles.indexRow,
                    expanded && styles.expanded
                  )}
                  onClick={() => toggle(project.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, project.id)}
                  onPointerEnter={() => setHoveredId(project.id)}
                  onPointerLeave={() => setHoveredId(null)}
                >
                  <td className={styles.cell}>
                    {project.title}
                    {project.professional && (
                      <span className={styles.asterisk}>*</span>
                    )}
                  </td>
                  <td className={styles.cell}>{project.type}</td>
                  <td className={cx(styles.cell, styles.year)}>
                    {project.year}
                  </td>
                  <td className={cx(styles.cell, styles.more)}>
                    <ExpandArrow
                      expanded={expanded}
                      hovered={hoveredId === project.id}
                      className={cx(styles.arrow, expanded && styles.expanded)}
                    />
                  </td>
                </tr>
                <tr
                  id={detailsId}
                  className={cx(
                    styles.row,
                    styles.detailsRow,
                    expanded && styles.expanded
                  )}
                >
                  <td colSpan={4} className={styles.detailsCell}>
                    <div
                      className={cx(styles.slide, expanded && styles.expanded)}
                    >
                      <div className={styles.slideInner} inert={!expanded}>
                        <div className={styles.details}>
                          <ProjectOverview project={project} />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <p className={styles.footnote}>
        * indicates work done as part of my full-time job
      </p>
    </div>
  );
}
