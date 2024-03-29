import { enDash } from 'src/app/core/constants/text.constants';
import { Field } from './art-history-fields.model';

export const artHistoryJobsColors = {
  brightBlue: '#0088FF', // bright blue
  powderPink: '#eda4ba', //powder pink
  brightMint: '#38f0ac', //bright mint
  darkGreen: '#40655e', //dark green
  brightRed: '#eb1138', //bright red
  maroon: '#832522', // maroon
  gold: 'gold',
  slateBlueGray: '#63a3b7', //slate blue gray
  dustyPurple: '#91799c', //dusty purple
  grassGreen: '#88dc40', // grass green
  darkVioletBlue: '#60409b', // dark violet blue
  paleChartreuse: '#d6da7d', //pale chartreuse
  brightPurple: '#9620fc', //bright purple
  pineGreen: '#178535', //pine green
  brightMagenta: '#ed2bb1', // bright pink -magenta
  lightOrange: '#ef972d', //light orange
  brightSkyBlue: '#20d8fd', //bright sky blue
  redOrange: '#ff5f23', //red orange
  poopBrown: '#8d630a', //poop brown
};

export const artHistoryFields: Field[] = [
  {
    name: { full: 'All', short: 'All' },
    color: artHistoryJobsColors.brightBlue,
    selected: true,
    sort: 0,
  },
  {
    name: {
      full: 'African / African Diaspora Art',
      short: 'Afr. / Afr. Dias. Art',
    },
    color: artHistoryJobsColors.powderPink,
    selected: false,
    sort: 1,
  },
  {
    name: { full: 'Ancient Art', short: 'Ancient Art' },
    color: artHistoryJobsColors.darkGreen,
    selected: false,
    sort: 2,
  },
  {
    name: { full: 'Architecture', short: 'Architecture' },
    color: artHistoryJobsColors.brightRed,
    selected: false,
    sort: 3,
  },
  {
    name: {
      full: 'Asian / Asian Diaspora Art',
      short: 'Asian / Asian Dias. Art',
    },
    color: artHistoryJobsColors.pineGreen,
    selected: false,
    sort: 4,
  },
  {
    name: {
      full: 'Byzantine / Medieval Art',
      short: 'Byz. / Medieval Art',
    },
    color: artHistoryJobsColors.slateBlueGray,
    selected: false,
    sort: 5,
  },
  {
    name: {
      full: 'Curatorial Studies / Arts Administration',
      short: 'Curation / Arts Admin',
    },
    color: artHistoryJobsColors.maroon,
    selected: false,
    sort: 6,
  },
  {
    name: {
      full: 'Design',
      short: 'Design',
    },
    color: artHistoryJobsColors.dustyPurple,
    selected: false,
    sort: 7,
  },
  {
    name: {
      full: 'Digital Art History',
      short: 'Digital Art History',
    },
    color: artHistoryJobsColors.darkVioletBlue,
    selected: false,
    sort: 8,
  },
  {
    name: {
      full: 'Early Modern / Renaissance / Eighteenth & Nineteenth Century Art',
      short: `Early Mod. ${enDash} 19th C. Art`,
    },
    color: artHistoryJobsColors.grassGreen,
    selected: false,
    sort: 9,
  },
  {
    name: {
      full: 'Film / Photography',
      short: 'Film / Photo',
    },
    color: artHistoryJobsColors.paleChartreuse,
    selected: false,
    sort: 10,
  },
  {
    name: {
      full: 'Gender and Sexuality Studies',
      short: 'Gender / Sex. Studies',
    },
    color: artHistoryJobsColors.brightPurple,
    selected: false,
    sort: 11,
  },
  {
    name: { full: 'General / Open', short: 'General / Open' },
    color: artHistoryJobsColors.gold,
    selected: false,
    sort: 12,
  },
  {
    name: {
      full: 'Global / Non-Western Art',
      short: 'Global / Non-Western Art',
    },
    color: artHistoryJobsColors.brightMagenta,
    selected: false,
    sort: 13,
  },
  {
    name: {
      full: 'Latin American Art',
      short: 'Lat. American Art',
    },
    color: artHistoryJobsColors.lightOrange,
    selected: false,
    sort: 14,
  },
  {
    name: {
      full: 'Middle Eastern / Islamic Art',
      short: 'Middle Eastern / Islamic Art',
    },
    color: artHistoryJobsColors.brightSkyBlue,
    selected: false,
    sort: 15,
  },
  {
    name: {
      full: 'Modern / Contemporary Art',
      short: 'Mod. / Contemp. Art',
    },
    color: artHistoryJobsColors.redOrange,
    selected: false,
    sort: 16,
  },
  {
    name: {
      full: 'North American Art',
      short: 'N. American Art',
    },
    color: artHistoryJobsColors.brightMint,
    selected: false,
    sort: 17,
  },
  {
    name: {
      full: 'Visual Studies / Visual Culture',
      short: 'Visual Studies',
    },
    color: artHistoryJobsColors.poopBrown,
    selected: false,
    sort: 18,
  },
];

export enum Tenure {
  tt = 'tt',
  nonTt = 'nonTt',
  unknown = 'unknown',
}

export enum Rank {
  assistant = 'assistant',
  associate = 'associate',
  full = 'full',
  chair = 'chair',
  open = 'open',
  vap = 'vap',
  lecturer = 'lecturer',
  unknown = 'unknown',
}

export const tenureOptions: { value: keyof typeof Tenure; label: string }[] = [
  {
    value: Tenure.tt,
    label: 'Tenure track',
  },
  {
    value: Tenure.nonTt,
    label: 'Non-tenure track',
  },
  {
    value: Tenure.unknown,
    label: 'Unknown',
  },
];

export const rankOptions: { value: keyof typeof Rank; label: string }[] = [
  {
    value: Rank.assistant,
    label: 'Assistant professor',
  },
  {
    value: Rank.associate,
    label: 'Associate professor',
  },
  {
    value: Rank.full,
    label: 'Full professor',
  },
  {
    value: Rank.chair,
    label: 'Chair',
  },
  {
    value: Rank.open,
    label: 'Open rank',
  },
  {
    value: Rank.vap,
    label: 'Visiting assistant professor',
  },
  {
    value: Rank.lecturer,
    label: 'Lecturer',
  },
  {
    value: Rank.unknown,
    label: 'Unknown',
  },
];
