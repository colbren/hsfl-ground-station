import { useEffect, useState } from "react";

import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

type Satellite = {
    name: string;
    lat: number;
    lon: number;
    alt_km: number;
};

const HSFL_GS = {
    name: "HSFL Ground Station",
    lat: 21.3167,
    lon: -157.9431,
};

function WrappedMarker({
    lat,
    lon,
    children,
}: {
    lat: number;
    lon: number;
    children: React.ReactNode;
}) {
    const longitudes = [
        lon - 360,
        lon,
        lon + 360,
    ];

    return (
        <>
            {longitudes.map((wrappedLon) => (
                <Marker
                    key={`${lat}-${wrappedLon}`}
                    position={[lat, wrappedLon]}
                >
                    <Popup>{children}</Popup>
                </Marker>
            ))}
        </>
    );
}

export default function SatelliteTracking() {
    const [satellite, setSatellite] =
        useState<Satellite | null>(null);

    useEffect(() => {
        const fetchSatellite = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/tracking/position/"
                );

                const data = await response.json();

                setSatellite(data);
            } catch (error) {
                console.error(
                    "Failed to fetch satellite position:",
                    error
                );
            }
        };

        fetchSatellite();

        const interval = setInterval(
            fetchSatellite,
            5000
        );

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                height: "calc(100vh - 64px)",
                width: "100%",
            }}
        >
            <MapContainer
                center={[20, -157]}
                zoom={3}
                minZoom={3}
                maxZoom={15}
                worldCopyJump={true}
                zoomControl={true}
                style={{
                    height: "100%",
                    width: "100%",
                }}
            >
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <WrappedMarker
                    lat={HSFL_GS.lat}
                    lon={HSFL_GS.lon}
                >
                    <>
                        <strong>
                            {HSFL_GS.name}
                        </strong>

                        <br />

                        Honolulu, Hawaii
                    </>
                </WrappedMarker>

                {satellite && (
                    <WrappedMarker
                        lat={satellite.lat}
                        lon={satellite.lon}
                    >
                        <>
                            <strong>
                                {satellite.name}
                            </strong>

                            <br />

                            Latitude:
                            {" "}
                            {satellite.lat.toFixed(2)}°

                            <br />

                            Longitude:
                            {" "}
                            {satellite.lon.toFixed(2)}°

                            <br />

                            Altitude:
                            {" "}
                            {satellite.alt_km.toFixed(1)}
                            {" "}
                            km
                        </>
                    </WrappedMarker>
                )}
            </MapContainer>
        </div>
    );
}