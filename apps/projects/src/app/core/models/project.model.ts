export class Project {
  id: string;
  title: string;
  type: string;
  theme: Theme;
}

export enum Environment {
  local = 'local',
  production = 'production',
}

export type EnvironmentOption = keyof typeof Environment;

export enum ProjectType {
  caseStudy = 'Case study',
  dataViz = 'Interactive data visualization',
  writing = 'Writing',
  webApp = 'Web application',
  website = 'Website',
}

export enum Theme {
  professional = 'professional',
  personal = 'personal',
  designDev = 'design-dev',
}
