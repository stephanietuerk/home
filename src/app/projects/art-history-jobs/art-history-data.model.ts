export enum JobProperty {
  year = 'year',
  field = 'field',
  tenure = 'tenure',
  rank = 'rank',
}

export interface JobDatum {
  [JobProperty.year]: Date;
  [JobProperty.field]: string;
  [JobProperty.tenure]: string;
  [JobProperty.rank]: string[] | string;
  count: number;
  percent?: number;
}

export interface JobTableDatum {
  [JobProperty.field]: string;
  avg: number;
  current: number;
}

export interface LineDef {
  [JobProperty.field]: string;
  [JobProperty.tenure]: string;
  [JobProperty.rank]: string;
}

export interface JobsBySchoolDatum {
  id: string;
  [JobProperty.tenure]: string;
  [JobProperty.rank]: string[];
  [JobProperty.field]: string[];
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
  [JobProperty.year]: string;
  jobs: JobsBySchoolDatum[];
}
