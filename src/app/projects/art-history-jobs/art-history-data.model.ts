export interface JobDatum {
  year: Date;
  field: string;
  isTt: string;
  rank: string[];
  count: number;
  percent?: number;
}

export interface JobDatumTimeRangeChart {
  year: Date;
  field: string;
  isTt: string;
  rank: string;
  count: number;
  percent?: number;
}

export interface JobDatumChangeChart {
  field: string;
  isTt: string;
  rank: string;
  count: number;
  percent?: number;
}

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

export interface JobBySchoolDatum {
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
  jobsByYear: JobBySchoolDatum[];
}

export interface JobsByYear {
  year: Date;
  jobs: JobBySchoolDatum[];
}
