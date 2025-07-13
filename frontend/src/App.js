import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import AdminDashboard from './admin/Pages/AdminDashboard';
import ManageEvents from './admin/Pages/ManageEvents';
import AdminLogin from './admin/Pages/AdminLogin';
import AdminProtectedRoute from './admin/AdminProtectedRoute';


import Home from './pages/Home';
import Fanzones from './pages/Fanzones';
import Tickets from './pages/Tickets';
import Contact from './pages/contact';
import About from './pages/About';

import EventDetails from "./pages/EventDetails";
import TransportChoice from "./pages/TransportChoice";
import StationNavigation from "./pages/StationNavigation";
import LiveRoute from "./pages/LiveRoute";
import FanZoneWalk from "./pages/FanZoneWalk";


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
            <Route path="/transport-choice" element={<TransportChoice />} />
            <Route path="/station-navigation" element={<StationNavigation />} />
            <Route path="/live-route" element={<LiveRoute />} />
            <Route path="/fanzone-walk" element={<FanZoneWalk />} />
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
            <Route path="events" element={
              <AdminProtectedRoute>
                <ManageEvents />
              </AdminProtectedRoute>
            } />
            
          </Route>


        </Routes>
      </Router>
    </div>
  );
}

export default App;


