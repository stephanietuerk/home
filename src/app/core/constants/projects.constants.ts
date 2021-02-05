import { Project, ProjectType } from './../models/project.model';

export const PROJECTS: Project[] = [
    // {
    //   id: 6,
    //   title: 'Leaving Academia FAQ',
    //   type: ['Writing'],
    //   year: 2020,
    //   technologies: ['Angular'],
    //   description: [`In 2017, I finished a humanities post-doc and decided to leave both my field of history of architecture and academia.
    //       I am both profoundly thankful for all of the experiences I gained through my PhD and postdoc and very happy and intellectually
    //       fulfilled with my new work. I have spoken with a number of people about this transition -- who I hope have found it helpful --
    //       and thought that I would share my thoughts with a wider audience by putting them here.`],
    //   show: true
    // },
    {
        id: 'art-history-jobs',
        title: 'Art History Jobs, 2011 - 2020',
        type: [ProjectType.dataViz],
        year: 2020,
        technologies: ['Observable Notebook'],
        description: [
            'This is an exploratory set of interactive visualizations that helps people understand changes in the art history academic job market from 2012-2020, based on data I scraped from the Academic Jobs Wiki.',
        ],
        show: true,
        images: ['assets/artHistoryJobsSelects.png', 'assets/artHistoryJobsMain.png'],
        url: 'observablehq.com/@stephanietuerk/art-history-jobs-2011-2020',
        linkName: ProjectType.notebook,
    },
    {
        id: 'scsar',
        title: 'Severn Community Standing Against Racism',
        type: [ProjectType.website],
        year: 2020,
        technologies: ['Angular, Marked.js'],
        description: [
            'In June 2020, I started a campaign to encourage my high school to address issues of racism at the school and develop a strong anti-racism culture. The campaign took off but was dispersed across various media -- letters from the school sent to personal email addresses, Medium posts, articles in newspapers, PDF memos, and more. This made it difficult for the larger community to keep abreast of the campaign and understand what was being said by whom.',
            'To catalog our efforts as an group and to centralize media relating to our work, I quickly created a website. All site functionality and styling was done over the course of a weekend. Additional content was added throughout the summer.',
        ],
        show: true,
        images: ['assets/severnAgainstRacism_embed2.png', 'assets/severnAgainstRacism_embed.png'],
        url: 'www.severncommunityagainstracism.com',
        linkName: ProjectType.website,
    },
    {
        id: 'dq-atlas',
        title: 'DQ Atlas',
        type: [ProjectType.webApp],
        year: '2019 — 2020',
        technologies: ['Angular, D3'],
        description: [
            'DQ Atlas is a public-facing website hosted on Medicaid.gov that I designed/developed as part of my job at Mathematica. The site provides researchers and policy makers who use synthesized Medicaid use/claims data (TAF, or T-MSIS Analytic Files) with information about data quality for various topics.',
            'I designed the website via interactive prototype and was the design lead for frontend development. However, the project at large was executed by a large, wonderful team at Mathematica, which included health policy researchers who created measures for assessing data quality, statistical programmers, project managers, and full-stack developers.',
            'This was the first public-facing true web application at Mathematica, and we all learned a ton in the process of making it. The content is extremely wonky and intended only for specialist users, but we are proud of the extent to which we were able to make a ton of information available in an organized and easily-navigable fashion.',
            'The site is fully 508 compliant and supports IE11, in addition to modern browsers.',
            'Special shout-out to Keanan, Brian, Peter, Max, William, Anna, and Paloma for their hard work, cameraderie, and LOLs.',
        ],
        show: true,
        images: ['assets/atlasWelcome.png', 'assets/atlasTopics.png'],
        url: 'www.medicaid.gov/dq-atlas/welcome',
        linkName: ProjectType.website,
    },
    {
        id: 'beyond-the-county-line',
        title: 'Beyond the County Line',
        type: [ProjectType.dataViz],
        year: 2017,
        technologies: ['JavaScript', 'D3'],
        description: ['This project came out of auditing MIT DUSP 11.S941 in spring 2017.'],
        show: true,
        routerLink: '/projects/beyondthecountyline',
        linkName: 'visualization',
    },
    {
        id: 'flip-the-district',
        title: 'Flip the District',
        type: [ProjectType.dataViz],
        year: 2017,
        technologies: ['JavaScript, D3'],
        description: [
            'This was my first data visualization project!',
            "I did this when I audited MIT DUSP's 11.S947, Big Data, Visualization, and Society. Everything here is svg and made with D3 because...I learned D3 before learning almost anything about JavaScript, HTML, CSS, code splitting...the list goes on.",
            "The original code was like 1500 lines inside a single d3.csv() call, haha, but I had such a blast figuring out how to do all of this and am still proud of having made it with zero background in D3 or JS. I think it's telling that what is most novel here is the interactivity, which is still one of my favorite things to design and build.",
        ],
        show: true,
        routerLink: '/projects/flipthedistrict',
        linkName: 'visualization',
    },
];

export const PROJECTS_METADATA: ProjectMetaData[] = [
    {
        colName: 'title',
        colTitle: 'Title',
        colAlignment: 'left',
    },
    {
        colName: 'type',
        colTitle: 'Type',
        colAlignment: 'left',
    },
    {
        colName: 'year',
        colTitle: 'Year',
        colAlignment: 'right',
    },
    // {
    //   colName: 'technologies',
    //   colTitle: 'Technologies',
    //   colAlignment: 'left'
    // }
];

export class ProjectMetaData {
    colName: string;
    colTitle: string;
    colAlignment: string;
}
