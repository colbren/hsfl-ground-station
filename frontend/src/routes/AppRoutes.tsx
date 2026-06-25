import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardPage from "../pages/DashboardPage";
import SatellitesPage from "../pages/SatellitesPage";
import GroundStationsPage from "../pages/GroundStationsPage";
import SchedulerPage from "../pages/SchedulerPage";
import PassHistoryPage from "../pages/PassHistoryPage";
import PassThroughPage from "../pages/PassThroughPage";
import SatelliteTracking from "../pages/SatelliteTracking";

export default function AppRoutes() {

    return (
        <BrowserRouter>

            <DashboardLayout>

                <Routes>
                    <Route path="/" element={<DashboardPage />} />

                    <Route
                        path="/satellites"
                        element={<SatellitesPage />}
                    />

                    <Route
                        path="/groundstations"
                        element={<GroundStationsPage />}
                    />

                    <Route
                        path="/scheduler"
                        element={<SchedulerPage />}
                    />

                    <Route
                        path="/history"
                        element={<PassHistoryPage />}
                    />

                    <Route
                        path="/passthrough"
                        element={<PassThroughPage />}
                    />

                    <Route
                        path="/tracking"
                        element={<SatelliteTracking />}
                    />
                </Routes>

            </DashboardLayout>

        </BrowserRouter>
    );
}