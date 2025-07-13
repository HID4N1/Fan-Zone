import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminSideBar.css';

const AdminSidebar = () => {
      const navigate = useNavigate();
    
      const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('isAdminAuth');
        navigate('/admin/login');
      };
    
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className="sidebar-link">
          <FaTachometerAlt className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/events" className="sidebar-link">
          <FaTachometerAlt className="sidebar-icon" />
          <span>Manage Events</span>
        </NavLink>
        <NavLink to="/admin/fanzones" className="sidebar-link">
          <FaTachometerAlt className="sidebar-icon" />
          <span>Manage Fanzones</span>
        </NavLink>
      </nav>
      <button onClick={handleLogout}>Logout</button>

    </aside>
  );
};

export default AdminSidebar;
