export class DistrictVotes {
    district: number;
    dVotes: number;
    rVotes: number;
    oVotes: number;
    totalVotes?: number;
    dPercent?: number;
    rPercent?: number;
    oPercent?: number;
    dCand?: string;
    rCand?: string;
    oCand?: string;
}

export class StateVotes {
    dVotes: number;
    rVotes: number;
    oVotes: number;
    totalVotes: number;
    dPercent?: number;
    rPercent?: number;
    oPercent?: number;
    dDistricts: number;
    rDistricts: number;
    oDistricts: number;
}

export enum Party {
    D = 'DEM',
    R = 'REP',
    O = 'OTH'
}