import { Project } from './../models/project.model';

export const PROJECTS: Project[] = [
    {
        title: 'Leaving Academia FAQ',
        type: ['Text'],
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
        title: 'GeoPreciser',
        type: ['Map interface prototype'],
        year: 2018,
        technologies: ['Deck.gl', 'React'],
        description: ``
    },
    {
        title: 'Data and Data Visualizations: Recommended Readings',
        type: ['Resource list'],
        year: 2020,
        technologies: ['Angular'],
        description: ``
    }
]

export const PROJECTS_METADATA: string[] = [
    'Title', 'Type', 'Year', 'Technologies'
]