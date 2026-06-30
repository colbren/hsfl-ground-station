import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Typography, LinearProgress } from "@mui/material";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";

export default function ScheduledPassDetail() {
  const { id } = useParams();
  const [pass, setPass] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch(`/api/scheduled-passes/${id}/`)
      .then((res) => res.json())
      .then((data) => setPass(data));
  }, [id]);

  useEffect(() => {
    if (!pass) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const start = new Date(pass.start_time).getTime();
      const end = new Date(pass.end_time).getTime();

      const pct = ((now - start) / (end - start)) * 100;
      setProgress(Math.max(0, Math.min(100, pct)));
    }, 1000);

    return () => clearInterval(interval);
  }, [pass]);

  if (!pass) return <div>Loading...</div>;

  return (
    <Box p={2}>
      {/* HEADER */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5">
          {pass.satellite.name}
        </Typography>

        <Typography>
          Ground Station: {pass.ground_station.name}
        </Typography>

        <Typography>
          Max Elevation: {pass.max_elevation}°
        </Typography>

        <Typography>
          Duration: {Math.round(pass.duration_seconds / 60)} min
        </Typography>

        <Typography variant="caption">
          TLE used: {pass.tle_line1?.slice(0, 30)}...
        </Typography>
      </Paper>

      {/* MAP */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <MapContainer
          center={[
            pass.ground_station.latitude,
            pass.ground_station.longitude,
          ]}
          zoom={2}
          style={{ height: "400px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker
            position={[
              pass.ground_station.latitude,
              pass.ground_station.longitude,
            ]}
          />

          {pass.orbit_path?.samples && (
            <Polyline
              positions={pass.orbit_path.samples.map((p: any) => [
                p.lat,
                p.lon,
              ])}
            />
          )}
        </MapContainer>
      </Paper>

      {/* PROGRESS */}
      <Paper sx={{ p: 2 }}>
        <Typography>Pass Progress</Typography>
        <LinearProgress variant="determinate" value={progress} />
        <Typography>
          {progress.toFixed(0)}%
        </Typography>
      </Paper>
    </Box>
  );
}