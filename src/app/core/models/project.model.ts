export class Project {
  title: string;
  type: string[];
  year: string | number;
  technologies: string[];
  description?: string;
}

export enum ProjectType {
  'Interactive visualization',
  'FAQ',
  'Text',
  'Reference List',
  'Web application',
  'Prototype'
}

export enum TechTool {
  'D3',
  'React',
  'Angular',
  'JavaScript',
  'TypeScript',
  'Markdown',
  'Deck.gl'
}
