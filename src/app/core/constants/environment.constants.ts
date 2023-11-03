import { Environments as EnvironmentOptions } from '../models/environments.model';
import { Environment } from '../models/project.model';

export const environmentConstants: EnvironmentOptions = {
  [Environment.local]: {
    comments: 'comments-dev',
  },
  [Environment.production]: {
    comments: 'comments-prod',
  },
};
