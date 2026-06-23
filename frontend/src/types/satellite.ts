export interface Satellite {
    id: number;
    name: string;
    noradId: number;
    uplinkFreq?: number;
    downlinkFreq?: number;
    mode?: string;
    owner?: string;
}