export class Project {
    id: string;
    title: string;
    type: string[];
    year: string | number;
    technologies: string[];
    description?: string[];
    show?: boolean;
    images?: string[];
    url?: string;
    routerLink?: string;
    linkName?: string;
}

export enum ProjectType {
    dataViz = 'Interactive data visualization',
    text = 'Text',
    list = 'Reference List',
    webApp = 'Web application',
    website = 'Website',
    prototype = 'Prototype',
    notebook = 'Notebook',
}

export enum TechTool {
    D3 = 'D3',
    REACT = 'React',
    ANGULAR = 'Angular',
    JAVASCRIPT = 'JavaScript',
    TYPESCRIPT = 'TypeScript',
    MARKDOWN = 'Markdown',
    DECKGL = 'Deck.gl',
}