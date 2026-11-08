import {
  artHistoryJobsId,
  beyondId,
  composableVizId,
  federalDataPlatformId,
  flipId,
  leavingId,
} from '../core/constants/routing.constants';
import { Project, ProjectType, Theme } from '../core/models/project.model';

// Only the projects rendered by this app. The full project log (descriptions,
// images, links) lives in the React shell: apps/shell/src/data/projects.ts.
export const PROJECTS: Project[] = [
  {
    id: federalDataPlatformId,
    title: 'Federal Healthcare Data Platform',
    type: ProjectType.caseStudy,
    theme: Theme.professional,
  },
  {
    id: composableVizId,
    title: 'Composable Data Visualization Components Library',
    type: ProjectType.caseStudy,
    theme: Theme.professional,
  },
  {
    id: artHistoryJobsId,
    title: 'Art History Jobs, 2011—2023',
    type: ProjectType.dataViz,
    theme: Theme.designDev,
  },
  {
    id: leavingId,
    title: 'Leaving Academia FAQ',
    type: ProjectType.writing,
    theme: Theme.personal,
  },
  {
    id: beyondId,
    title: 'Beyond the County Line',
    type: ProjectType.dataViz,
    theme: Theme.designDev,
  },
  {
    id: flipId,
    title: 'Flip the District',
    type: ProjectType.dataViz,
    theme: Theme.designDev,
  },
];
