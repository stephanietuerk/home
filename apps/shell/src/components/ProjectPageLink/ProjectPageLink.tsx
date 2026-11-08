import Link from 'next/link';
import type { ReactNode } from 'react';
import { projectPath, type Project } from '@/data/projects';

interface ProjectPageLinkProps {
  project: Project;
  className?: string;
  children: ReactNode;
}

export function ProjectPageLink({
  project,
  className,
  children,
}: ProjectPageLinkProps) {
  const href = projectPath(project.id);

  // Angular pages are a separate app, so they need a full page load; a
  // client-side <Link> would look for a Next page and 404.
  if (project.page === 'angular') {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
