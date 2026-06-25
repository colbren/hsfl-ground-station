import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardPage from "../pages/DashboardPage";
import SatellitesPage from "../pages/SatellitesPage";
import GroundStationsPage from "../pages/GroundStationsPage";
import SchedulerPage from "../pages/SchedulerPage";
import PassHistoryPage from "../pages/PassHistoryPage";
import PassThroughPage from "../pages/PassThroughPage";
import SatelliteTracking from "../pages/SatelliteTracking";

import LoginPage from "../auth/LoginPage";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/"
                        element={<DashboardPage />}
                    />

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
                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}