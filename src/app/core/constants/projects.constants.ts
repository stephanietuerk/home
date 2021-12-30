import { Project, ProjectType } from './../models/project.model';
import { artHistoryJobsPath, beyondPath, blogPath, flipPath, leavingPath, projectsPath } from './routing.constants';

export const PROJECTS: Project[] = [
    {
        id: 'leaving-academia-faq',
        title: 'Leaving Academia FAQ',
        type: ProjectType.blogPost,
        year: 2021,
        show: {
            local: true,
            production: true,
        },
        description: [
            "Before I got into interactive data / design / coding, I did a Ph.D and a postdoc in architectural history. I learned a lot from that experience, and also from the process of moving on from it into a very different field. I've talked to a number of people about how I left academia and create a new, very satisfying-to-me career who all seemed to find it useful, and thought I'd write something up to further share my experiences / thoughts / opinions on this matter.",
        ],
        links: [
            {
                name: 'Post',
                routerLink: `${blogPath}/${leavingPath}`,
            },
        ],
        allowComments: false,
        postConfig: {
            postedDate: new Date(2021, 5, 15),
        },
    },
    {
        id: 'covid-school-testing',
        title: 'COVID School Testing Tool',
        type: ProjectType.dataViz,
        year: 2021,
        show: {
            local: true,
            production: true,
        },
        description: [
            'How can we display data to help people choose among options, each with a unique set of benefits and trade-offs?',
            "This is what three of us from Mathematica's web development group asked when people from our data science team asked us to build an interface for the results of their agent-based model that simulated the effects of various COVID testing strategies in K-12 schools. (Project undertaken in conjunction with the Rockefeller Foundation.) For each testing strategy, comprise of a combination of a test population (students only, adults only, students and adults), a test frequency, and a test type, the model predicted various metrics such as infections detected and transmissions reduced, but also days of school missed by students (whether due to infections or needing to quarantine from exposure or false positives) and number of tests administered (which has a cost implication).",
            'We came up with a solution that allowed users to select a metric of highest priority to them, and then to see all other outcomes that corresponded to the best outcome for the prioritized metric, the second best, and so forth. This was a very quick project for us, taking about a month (with all of us on other projects at the same time) for both design and development.',
        ],
        images: [
            {
                path: 'assets/covid_testing.png',
                altText: 'a screen capture of bar charts from this project',
            },
        ],
        links: [
            {
                name: ProjectType.website,
                url: 'covid-school-testing.mathematica.org/start',
            },
        ],
        professional: true,
    },
    {
        id: 'art-history-jobs',
        title: 'Art History Jobs, 2011—2021',
        type: ProjectType.dataViz,
        year: '2020—2021',
        description: [
            'This is an exploratory set of interactive visualizations that helps people understand changes in the art history academic job market from 2012-2020, based on data I scraped from the Academic Jobs Wiki. Data scraping/cleaning were done with Python, visualizations were built in an Observable notebook.',
        ],
        show: {
            local: true,
            production: true,
        },
        images: [
            {
                path: 'assets/artHistoryJobsSelects.png',
                altText: 'a screen capture of form controls from this project',
            },
            {
                path: 'assets/artHistoryJobsMain.png',
                altText: 'a screen capture of a stacked line chart data visualization from this project',
            },
        ],
        links: [
            {
                name: 'visualization (2021)',
                routerLink: `${projectsPath}/${artHistoryJobsPath}`,
            },
            {
                name: 'notebook (2020)',
                url: 'observablehq.com/@stephanietuerk/art-history-jobs-2011-2020',
            },
        ],
    },
    {
        id: 'scsar',
        title: 'Severn Community Standing Against Racism',
        type: ProjectType.website,
        year: 2020,
        description: [
            'In June 2020, I started a campaign to encourage my high school to address issues of racism at the school and develop a strong anti-racism culture. The campaign took off but was dispersed across various media -- letters from the school sent to personal email addresses, Medium posts, articles in newspapers, PDF memos, and more. This made it difficult for the larger community to keep abreast of the campaign and understand what was being said by whom.',
            'To catalog our efforts as an group and to centralize media relating to our work, I quickly created a website. All site functionality and styling was done over the course of a weekend. Additional content was added throughout the summer.',
        ],
        show: {
            local: true,
            production: true,
        },
        images: [
            {
                path: 'assets/severnAgainstRacism_embed2.png',
                altText: 'a screen capture of the landing page of this project',
            },
            {
                path: 'assets/severnAgainstRacism_embed.png',
                altText: 'a screen capture of the correspondence feature of this project',
            },
        ],
        links: [
            {
                name: ProjectType.website,
                url: 'www.severncommunityagainstracism.com',
            },
        ],
    },
    {
        id: 'dq-atlas',
        title: 'DQ Atlas',
        type: ProjectType.webApp,
        year: '2019—2020',
        description: [
            'DQ Atlas is a public-facing website hosted on Medicaid.gov that I designed/developed as part of my job at Mathematica. The site provides researchers and policy makers who use synthesized Medicaid use/claims data (TAF, or T-MSIS Analytic Files) with information about data quality for various topics.',
            'I designed the website via interactive prototype and was the design lead for frontend development. However, the project at large was executed by a wonderful team of health policy researchers, who created measures for assessing data quality, statistical programmers, project and product managers, and front- and back-end developers.',
            'This was the first public-facing true web application at Mathematica, and we all learned a ton in the process of making it. The content will seem extremely wonky to non-specialist users, but has been very well received by policy researchers. We are proud of the extent to which we were able to make a ton of information available in an organized and easily-navigable fashion.',
            'The site is fully 508 compliant and supports IE11, in addition to modern browsers.',
        ],
        show: {
            local: true,
            production: true,
        },
        images: [
            { path: 'assets/atlasWelcome.png', altText: 'a screen capture of the landing page of this project' },
            {
                path: 'assets/atlasTopics.png',
                altText: 'a screen capture of the explore by topic pathway for this project',
            },
        ],
        links: [
            {
                name: ProjectType.website,
                url: 'www.medicaid.gov/dq-atlas/welcome',
            },
        ],
        professional: true,
    },
    {
        id: 'beyond-the-county-line',
        title: 'Beyond the County Line',
        type: ProjectType.dataViz,
        year: 2017,
        technologies: ['JavaScript', 'D3'],
        description: [
            "This project also came out of MIT DUSP 11.S941 in spring 2017. I started it during the course and then took a few weeks after the course to finish it. (We only needed to do one final project, this was my second :).)  Like Flip the District, the code on this was a mess, it definitely is not scaled for mobile, and even on desktop, there are certainly some issues, but I'm still proud to have done this with only a month or two of d3/JS experience.",
            'This project mapped Pennsylvania precinct level election results for 2012 and 2016 national elections onto census tracts, allowing for a granular analysis of the much hypothesized relationship between demographic characteristics (using census tract-level ACS data) and election results. The project page gives additional details about how correspondences were made between these two different administrative systems.',
        ],
        show: {
            local: true,
            production: true,
        },
        images: [
            { path: 'assets/beyond_map.png', altText: 'a screen capture of the map feature in this project' },
            { path: 'assets/beyond_bar.png', altText: 'a screen capture of the bar chart feature of this project' },
        ],
        links: [
            {
                name: 'visualization',
                routerLink: `${projectsPath}/${beyondPath}`,
            },
        ],
    },
    {
        id: 'flip-the-district',
        title: 'Flip the District',
        type: ProjectType.dataViz,
        year: 2017,
        technologies: ['JavaScript', 'D3'],
        description: [
            'This was my first data visualization project!',
            "I did this when I audited MIT DUSP's 11.S947, Big Data, Visualization, and Society. Everything here is svg and made with D3 because...I learned D3 before learning almost anything about JavaScript, HTML, CSS, code splitting...the list goes on.",
            "The original code was like 1500 lines inside a single d3.csv() call, haha, but I had such a blast figuring out how to do all of this and am still proud of having made it with zero background in D3 or JS. I think it's telling that what is most novel here is the interactivity, which is still one of my favorite things to design and build. This is not scaled for mobile and it would be a waste of time to go back and retrofit, so, consider yourself warned.",
        ],
        show: {
            local: true,
            production: true,
        },
        images: [
            {
                path: 'assets/flip.gif',
                altText: 'an animated gif showing a user manipulating the interface of this project',
            },
        ],
        links: [
            {
                name: 'visualization',
                routerLink: `${projectsPath}/${flipPath}`,
            },
        ],
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
];

export class ProjectMetaData {
    colName: string;
    colTitle: string;
    colAlignment: string;
}
