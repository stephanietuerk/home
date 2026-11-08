import Link from 'next/link';
import type { ComponentProps } from 'react';
import { projectPath, type Project } from '@/data/projects';

type ProjectPageLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  project: Project;
};

export function ProjectPageLink({
  project,
  ...anchorProps
}: ProjectPageLinkProps) {
  const href = projectPath(project.id);

  // Angular pages are a separate app, so they need a full page load; a
  // client-side <Link> would look for a Next page and 404.
  if (project.page === 'angular') {
    return <a href={href} {...anchorProps} />;
  }

  return <Link href={href} {...anchorProps} />;
}
