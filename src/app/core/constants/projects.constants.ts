import { Project } from './../models/project.model';

export const PROJECTS: Project[] = [
  {
    title: 'Leaving Academia FAQ',
    type: ['Thoughts / text'],
    year: 2020,
    technologies: ['Angular'],
    description: `In 2017, I finished a humanities post-doc and decided to leave both my field of history of architecture and academia. 
        I am both profoundly thankful for all of the experiences I gained through my PhD and postdoc and very happy and intellectually 
        fulfilled with my new work. I have spoken with a number of people about this transition -- who I hope have found it helpful -- 
        and thought that I would share my thoughts with a wider audience by putting them here.`
  },
  {
    title: 'Beyond the County Line',
    type: ['Interactive data visualization'],
    year: 2017,
    technologies: ['D3', 'vanilla JavaScript'],
    description: ``
  },
  {
    title: 'Flip the District',
    type: ['Interactive data visualization'],
    year: 2017,
    technologies: ['D3', 'vanilla JavaScript'],
    description: ``
  },
  {
    title: 'More or Less Precise',
    type: ['Map interface prototype'],
    year: 2018,
    technologies: ['Deck.gl', 'React'],
    description: ``
  },
  {
    title: 'Recommended Readings: Data and Data Visualization',
    type: ['Resource list'],
    year: 2020,
    technologies: ['Angular'],
    description: ``
  },
  {
    title: 'Bookmarked Tweets',
    type: ['Archive'],
    year: 'ongoing',
    technologies: ['Angular', 'Twitter API']
  }
];

export const PROJECTS_METADATA: ProjectMetaData[] = [
  {
    colName: 'title',
    colTitle: 'Title',
    colAlignment: 'left'
  },
  {
    colName: 'type',
    colTitle: 'Type',
    colAlignment: 'left'
  },
  {
    colName: 'year',
    colTitle: 'Year',
    colAlignment: 'center'
  },
  {
    colName: 'technologies',
    colTitle: 'Technologies',
    colAlignment: 'left'
  }
];

export class ProjectMetaData {
  colName: string;
  colTitle: string;
  colAlignment: string;
}
