import * as satellite from "satellite.js";

/**
 * Generate ground track positions from TLE using satellite.js
 */
export function generateGroundTrack(
    tleLine1: string,
    tleLine2: string,
    startTime = new Date(),
    minutesAhead = 90,
    stepSeconds = 10
) {
    const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

    const positions: { lat: number; lng: number; timestamp: Date }[] = [];

    for (let t = 0; t <= minutesAhead * 60; t += stepSeconds) {
        const time = new Date(startTime.getTime() + t * 1000);

        const posVel = satellite.propagate(satrec, time);
        if (!posVel.position) continue;

        const gmst = satellite.gstime(time);
        const geodetic = satellite.eciToGeodetic(posVel.position, gmst);

        const lat = satellite.degreesLat(geodetic.latitude);
        const lng = satellite.degreesLong(geodetic.longitude);

        positions.push({ lat, lng, timestamp: time });
    }

    return positions;
}