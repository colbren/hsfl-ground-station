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

function generateOrbitPath(
    tle1: string,
    tle2: string,
    minutesPast = 90,
    minutesFuture = 90,
    stepSeconds = 30
) {
    const satrec = satellite.twoline2satrec(tle1, tle2);

    const now = new Date();

    const past: [number, number][] = [];
    const future: [number, number][] = [];

    // ---------------- PAST ----------------
    for (let t = -minutesPast * 60; t <= 0; t += stepSeconds) {
        const time = new Date(now.getTime() + t * 1000);

        const pv = satellite.propagate(satrec, time);
        if (!pv.position) continue;

        const gmst = satellite.gstime(time);
        const geo = satellite.eciToGeodetic(pv.position, gmst);

        past.push([
            satellite.degreesLat(geo.latitude),
            satellite.degreesLong(geo.longitude),
        ]);
    }

    // ---------------- FUTURE ----------------
    for (let t = 0; t <= minutesFuture * 60; t += stepSeconds) {
        const time = new Date(now.getTime() + t * 1000);

        const pv = satellite.propagate(satrec, time);
        if (!pv.position) continue;

        const gmst = satellite.gstime(time);
        const geo = satellite.eciToGeodetic(pv.position, gmst);

        future.push([
            satellite.degreesLat(geo.latitude),
            satellite.degreesLong(geo.longitude),
        ]);
    }

    return { past, future };
}