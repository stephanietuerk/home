import { PROJECTS } from '../../projects/projects.constants';
import { Project } from '../models/project.model';

export function getLastPathFragmentFromURL(url: string): string {
  const parsed = url.split('/');
  return parsed[parsed.length - 1];
}

export function getProjectFromURL(url: string): Project {
  return PROJECTS.find((x) => x.links.map((x) => x.routerLink).includes(url));
}
