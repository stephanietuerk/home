export interface JobDatum {
  year: Date;
  field: string;
  isTt: string;
  rank: string[] | string;
  count: number;
  percent?: number;
}

// export interface JobDatumTimeRangeChart {
//   year: Date;
//   field: string;
//   isTt: string;
//   rank: string;
//   count: number;
//   percent?: number;
// }

// export interface JobDatumChangeChart {
//   field: string;
//   isTt: string;
//   rank: string;
//   count: number;
//   percent?: number;
// }

export interface JobTableDatum {
  field: string;
  avg: number;
  current: number;
}

export interface LineDef {
  field: string;
  isTt: string;
  rank: string;
}

export interface JobsBySchoolDatum {
  id: string;
  isTt: string;
  rank: string;
  field: string[];
}

export interface JobsByCountry {
  country: string;
  jobsBySchool: JobsBySchool[];
}

export interface JobsBySchool {
  school: string;
  jobsByYear: JobsByYear[];
}

export interface JobsByYear {
  year: string;
  jobs: JobsBySchoolDatum[];
}
