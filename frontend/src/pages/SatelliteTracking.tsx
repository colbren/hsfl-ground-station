import { useEffect, useMemo, useState } from "react";

import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    Polyline,
} from "react-leaflet";

import {
    Paper,
    Typography,
    Select,
    MenuItem,
    Box,
} from "@mui/material";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import * as satellite from "satellite.js";

// ---------------- TYPES ----------------

type Satellite = {
    id: number;
    name: string;
    norad_id: number;
    tle_line1: string;
    tle_line2: string;
};

type GroundStation = {
    id: number;
    name: string;
    status: string;
    latitude: number;
    longitude: number;
    altitudeM: number;
};

type PropagatedPos = {
    lat: number;
    lon: number;
    alt_km: number;
};

// ---------------- ICON ----------------

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// ---------------- NORMALIZE LONGITUDE (IMPORTANT FIX) ----------------

function normalizeLon(lon: number) {
    return ((lon + 180) % 360) - 180;
}

// ---------------- SGP4 ----------------

function propagateFromTLE(
    tle1: string,
    tle2: string,
    date: Date
): PropagatedPos | null {
    const satrec = satellite.twoline2satrec(tle1, tle2);

    const pv = satellite.propagate(satrec, date);
    if (!pv.position) return null;

    const gmst = satellite.gstime(date);
    const geo = satellite.eciToGeodetic(pv.position, gmst);

    return {
        lat: satellite.degreesLat(geo.latitude),
        lon: normalizeLon(
            satellite.degreesLong(geo.longitude)
        ),
        alt_km: geo.height,
    };
}

// ---------------- ORBIT PATH ----------------

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

    for (let t = -minutesPast * 60; t <= 0; t += stepSeconds) {
        const time = new Date(now.getTime() + t * 1000);

        const pv = satellite.propagate(satrec, time);
        if (!pv.position) continue;

        const gmst = satellite.gstime(time);
        const geo = satellite.eciToGeodetic(pv.position, gmst);

        past.push([
            satellite.degreesLat(geo.latitude),
            normalizeLon(
                satellite.degreesLong(geo.longitude)
            ),
        ]);
    }

    for (let t = 0; t <= minutesFuture * 60; t += stepSeconds) {
        const time = new Date(now.getTime() + t * 1000);

        const pv = satellite.propagate(satrec, time);
        if (!pv.position) continue;

        const gmst = satellite.gstime(time);
        const geo = satellite.eciToGeodetic(pv.position, gmst);

        future.push([
            satellite.degreesLat(geo.latitude),
            normalizeLon(
                satellite.degreesLong(geo.longitude)
            ),
        ]);
    }

    return { past, future };
}

// ---------------- DATELINE SAFE SPLIT ----------------

function splitDateline(points: [number, number][]) {
    const segments: [number, number][][] = [];
    let current: [number, number][] = [];

    for (let i = 0; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];

        if (prev) {
            const lonDiff = Math.abs(curr[1] - prev[1]);
            if (lonDiff > 180) {
                segments.push(current);
                current = [];
            }
        }

        current.push(curr);
    }

    if (current.length) segments.push(current);

    return segments;
}

// ---------------- MAIN ----------------

export default function SatelliteTracking() {
    const [satellites, setSatellites] = useState<Satellite[]>([]);
    const [groundStations, setGroundStations] = useState<GroundStation[]>([]);
    const [selectedId, setSelectedId] = useState<number | "">("");

    const [position, setPosition] =
        useState<PropagatedPos | null>(null);

    const [pastPath, setPastPath] = useState<[number, number][]>([]);
    const [futurePath, setFuturePath] = useState<[number, number][]>([]);

    // LOAD SATELLITES
    useEffect(() => {
        fetch("http://192.168.150.104:8000/api/satellites/")
            .then((res) => res.json())
            .then((data) => {
                setSatellites(data);
                if (data.length > 0) setSelectedId(data[0].id);
            });
    }, []);

    // LOAD GROUND STATIONS
    useEffect(() => {
        fetch("http://192.168.150.104:8000/api/groundstations/")
            .then((res) => res.json())
            .then((data) => setGroundStations(data));
    }, []);

    const selectedSat = useMemo(
        () =>
            satellites.find((s) => s.id === selectedId),
        [satellites, selectedId]
    );

    // LIVE UPDATE
    useEffect(() => {
        if (!selectedSat) return;

        const update = () => {
            const now = new Date();

            const pos = propagateFromTLE(
                selectedSat.tle_line1,
                selectedSat.tle_line2,
                now
            );

            if (pos) setPosition(pos);

            const { past, future } = generateOrbitPath(
                selectedSat.tle_line1,
                selectedSat.tle_line2
            );

            setPastPath(past);
            setFuturePath(future);
        };

        update();
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [selectedSat]);

    return (
        <Box
            sx={{
                display: "flex",
                height: "calc(100vh - 64px)",
            }}
        >
            {/* LEFT PANEL */}
            <Paper sx={{ width: 320, p: 2 }}>
                <Typography variant="h6">
                    Satellite Tracking
                </Typography>

                <Select
                    fullWidth
                    size="small"
                    value={selectedId}
                    onChange={(e) =>
                        setSelectedId(Number(e.target.value))
                    }
                    sx={{ mt: 2 }}
                >
                    {satellites.map((sat) => (
                        <MenuItem
                            key={sat.id}
                            value={sat.id}
                        >
                            {sat.name}
                        </MenuItem>
                    ))}
                </Select>

                {selectedSat && (
                    <Box sx={{ mt: 2 }}>
                        <b>{selectedSat.name}</b>
                    </Box>
                )}
            </Paper>

            {/* MAP */}
            <Box sx={{ flex: 1 }}>
                <MapContainer
                    center={[20, -157]}
                    zoom={3}
                    minZoom={3}
                    maxZoom={15}
                    worldCopyJump={false} // IMPORTANT
                    maxBounds={[
                        [-90, -180],
                        [90, 180],
                    ]}
                    maxBoundsViscosity={1.0}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* GROUND STATIONS */}
                    {groundStations.map((gs) => (
                        <Marker
                            key={gs.id}
                            position={[
                                gs.latitude,
                                normalizeLon(
                                    gs.longitude
                                ),
                            ]}
                            icon={defaultIcon}
                        >
                            <Popup>
                                <b>{gs.name}</b>
                                <br />
                                Status: {gs.status}
                            </Popup>
                        </Marker>
                    ))}

                    {/* SATELLITE */}
                    {position && selectedSat && (
                        <Marker
                            position={[
                                position.lat,
                                position.lon,
                            ]}
                            icon={defaultIcon}
                        >
                            <Popup>
                                <b>{selectedSat.name}</b>
                            </Popup>
                        </Marker>
                    )}

                    {/* ORBIT */}
                    {splitDateline(pastPath).map(
                        (seg, i) => (
                            <Polyline
                                key={`past-${i}`}
                                positions={seg}
                                pathOptions={{
                                    color: "cyan",
                                    weight: 2,
                                }}
                            />
                        )
                    )}

                    {splitDateline(futurePath).map(
                        (seg, i) => (
                            <Polyline
                                key={`future-${i}`}
                                positions={seg}
                                pathOptions={{
                                    color: "orange",
                                    weight: 2,
                                    dashArray: "6 8",
                                }}
                            />
                        )
                    )}
                </MapContainer>
            </Box>
        </Box>
    );
}