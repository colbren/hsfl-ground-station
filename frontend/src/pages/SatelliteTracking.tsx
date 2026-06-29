import { useEffect, useMemo, useState } from "react";

import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
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

type Satellite = {
    id: number;
    name: string;
    norad_id: number;
    tle_line1: string;
    tle_line2: string;
};

type PropagatedPos = {
    lat: number;
    lon: number;
    alt_km: number;
};

const HSFL_GS = {
    name: "HSFL Ground Station",
    lat: 21.3167,
    lon: -157.9431,
};

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

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
        lon: satellite.degreesLong(geo.longitude),
        alt_km: geo.height,
    };
}

// ----------------------------
function WrappedMarker({
    lat,
    lon,
    children,
}: {
    lat: number;
    lon: number;
    children: React.ReactNode;
}) {
    const longitudes = [lon - 360, lon, lon + 360];

    return (
        <>
            {longitudes.map((wrappedLon) => (
                <Marker
                    key={`${lat}-${wrappedLon}`}
                    position={[lat, wrappedLon]}
                    icon={defaultIcon}
                >
                    <Popup>{children}</Popup>
                </Marker>
            ))}
        </>
    );
}

export default function SatelliteTracking() {
    const [satellites, setSatellites] = useState<Satellite[]>([]);
    const [selectedId, setSelectedId] = useState<number | "">("");

    const [position, setPosition] = useState<PropagatedPos | null>(null);

    // LOAD SATELLITES
    useEffect(() => {
        fetch("http://localhost:8000/api/satellites/")
            .then((res) => res.json())
            .then((data) => {
                setSatellites(data);

                // auto select first satellite
                if (data.length > 0) {
                    setSelectedId(data[0].id);
                }
            });
    }, []);

    const selectedSat = useMemo(
        () => satellites.find((s) => s.id === selectedId),
        [satellites, selectedId]
    );

    // LIVE PROPAGATION
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
        };

        update();
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [selectedSat]);

    return (
        <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
            {/* ---------------- LEFT PANEL ---------------- */}
            <Paper
                elevation={3}
                sx={{
                    width: 320,
                    p: 2,
                    borderRadius: 0,
                    overflowY: "auto",
                }}
            >
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
                    <MenuItem value="" disabled>
                        Select Satellite
                    </MenuItem>

                    {satellites.map((sat) => (
                        <MenuItem key={sat.id} value={sat.id}>
                            {sat.name}
                        </MenuItem>
                    ))}
                </Select>

                {selectedSat && (
                    <Box sx={{ mt: 2, fontSize: 13 }}>
                        <div>
                            <b>{selectedSat.name}</b>
                        </div>
                        <div>NORAD: {selectedSat.norad_id}</div>

                        <Box sx={{ mt: 1, fontSize: 11, opacity: 0.7 }}>
                            <div>TLE Line 1:</div>
                            <div>{selectedSat.tle_line1}</div>
                            <div style={{ marginTop: 6 }}>TLE Line 2:</div>
                            <div>{selectedSat.tle_line2}</div>
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* ---------------- MAP AREA ---------------- */}
            <Box sx={{ flex: 1 }}>
                <MapContainer
                    center={[20, -157]}
                    zoom={3}
                    minZoom={3}
                    maxZoom={15}
                    worldCopyJump={true}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Ground Station */}
                    <WrappedMarker
                        lat={HSFL_GS.lat}
                        lon={HSFL_GS.lon}
                    >
                        <>
                            <strong>{HSFL_GS.name}</strong>
                            <br />
                            Honolulu, Hawaii
                        </>
                    </WrappedMarker>

                    {/* Satellite */}
                    {position && selectedSat && (
                        <WrappedMarker
                            lat={position.lat}
                            lon={position.lon}
                        >
                            <>
                                <strong>{selectedSat.name}</strong>
                                <br />
                                Lat: {position.lat.toFixed(2)}°
                                <br />
                                Lon: {position.lon.toFixed(2)}°
                                <br />
                                Alt: {position.alt_km.toFixed(1)} km
                            </>
                        </WrappedMarker>
                    )}
                </MapContainer>
            </Box>
        </Box>
    );
}