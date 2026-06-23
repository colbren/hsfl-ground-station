import type { Pass } from "../types/pass";

export const mockPasses: Pass[] = [
    {
        id: 1,
        satelliteId: 1,
        satelliteName: "AO-91",
        groundStationId: 1,
        groundStationName: "UH Manoa GS",
        startTime: "2026-06-15T18:10:00Z",
        endTime: "2026-06-15T18:22:00Z",
        maxElevationDeg: 68,
    },
    {
        id: 2,
        satelliteId: 2,
        satelliteName: "ISS",
        groundStationId: 1,
        groundStationName: "UH Manoa GS",
        startTime: "2026-06-15T19:05:00Z",
        endTime: "2026-06-15T19:15:00Z",
        maxElevationDeg: 42,
    },
    {
        id: 3,
        satelliteId: 3,
        satelliteName: "NOAA-19",
        groundStationId: 2,
        groundStationName: "Cal Poly GS",
        startTime: "2026-06-15T20:30:00Z",
        endTime: "2026-06-15T20:42:00Z",
        maxElevationDeg: 55,
    },
];