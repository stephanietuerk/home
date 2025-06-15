import { PROJECTS } from '../../projects/projects.constants';
import { Project } from '../models/project.model';

export function getLastPathFragmentFromURL(url: string): string {
  const parsed = url.split('/');
  return parsed[parsed.length - 1];
}

export function getProjectFromURL(url: string): Project {
  console.log('getProjectFromURL', url);
  const id = url.split('/')[2];
  console.log('getProjectFromURL id', id);
  return PROJECTS.find((x) => x.id === id);
}
