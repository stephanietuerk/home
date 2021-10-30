export class Project {
    id: string;
    title: string;
    type: string;
    year: string | number;
    technologies?: string[];
    description?: string[];
    show?: Visibility;
    images?: Image[];
    url?: string;
    routerLink?: string;
    linkName?: string;
    allowComments?: boolean;
    professional?: boolean;
    postConfig?: Post;
}

export enum Environment {
    local = 'local',
    production = 'production',
}

export type EnvironmentOption = keyof typeof Environment;

export class Visibility {
    [Environment.local]: boolean;
    [Environment.production]: boolean;
}

export class Image {
    path: string;
    altText: string;
}

export class Post {
    postedDate: Date;
    updatedDate?: Date;
    title?: string;
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
