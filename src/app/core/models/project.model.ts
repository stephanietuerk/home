export class Project {
  id: string;
  title: string;
  type: string;
  year: string | number;
  technologies?: string[];
  description?: string[];
  images?: Image[];
  links: Link[];
  allowComments?: boolean;
  professional?: boolean;
  postConfig?: Post;
}

export enum Environment {
  local = 'local',
  production = 'production',
}

export type EnvironmentOption = keyof typeof Environment;

export class Image {
  path: string;
  altText: string;
}

export class Post {
  postedDate: Date;
  updatedDate?: Date;
  title?: string;
}

export class Link {
  url?: string;
  routerLink?: string;
  name: string;
  disabled?: boolean;
}

export enum ProjectType {
  dataViz = 'Interactive data visualization',
  writing = 'Writing',
  list = 'Reference List',
  webApp = 'Web application',
  website = 'Website',
  prototype = 'Prototype',
  notebook = 'Notebook',
  blogPost = 'Blog post',
}
