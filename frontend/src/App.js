import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminLogin from './admin/Pages/AdminLogin';
import AdminProtectedRoute from './admin/AdminProtectedRoute';
import AdminDashboard from './admin/Pages/AdminDashboard';

import ManageEvents from './admin/Pages/ManageEvents';
import CreateEvent from './admin/Pages/CreateEvent';
import EditEvent from './admin/Pages/EditEvent';

import ManageFanzones from './admin/Pages/ManageFanzones';
import CreateFanZone from './admin/Pages/CreateFanZone';
import EditFanZone from './admin/Pages/EditFanZone';

import Home from './pages/Home';
import Fanzones from './pages/Fanzones';
import Tickets from './pages/Tickets';
import Contact from './pages/contact';
import About from './pages/About';

import EventDetails from "./pages/EventDetails";
import TransportSelection from './pages/TransportSelection';
import WalkingRoute from './pages/WalkingRoute';

import './App.css';

import AdminLayout from './admin/AdminLayout';
import UserLayout from './components/UserLayout';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* User routes wrapped in UserLayout */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/Fanzone" element={<Fanzones />} />
            <Route path="/Tickets" element={<Tickets />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/About" element={<About />} />

            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/transport-selection" element={<TransportSelection />} />
            <Route path="/walking-route" element={<WalkingRoute />} />
          </Route>

          {/* Admin login route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin routes wrapped in AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            {/* events routing */}
            <Route path="events" element={
              <AdminProtectedRoute>
                <ManageEvents />
              </AdminProtectedRoute>
            } />
            <Route path="events/create" element={
              <AdminProtectedRoute>
                <CreateEvent />
              </AdminProtectedRoute>
            } />
            <Route path="events/:id/edit" element={
              <AdminProtectedRoute>
                <EditEvent />
              </AdminProtectedRoute>
            } />

            {/* fanzones routing */}
            <Route path="fanzones" element={
              <AdminProtectedRoute>
                <ManageFanzones />
              </AdminProtectedRoute>
            } />
            <Route path="fanzones/create" element={
              <AdminProtectedRoute>
                <CreateFanZone />
              </AdminProtectedRoute>
            } />
            <Route path="fanzones/:id/edit" element={
              <AdminProtectedRoute>
                <EditFanZone />
              </AdminProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
