import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api'; 
import './ManageEvents.css'; 
const ManageEvents = () => {
    return (

        <div className="manage-events">
        <h1>Manage Events</h1>
        <p>This page will allow admins to manage events.</p>
        </div>

    );
    }

export default ManageEvents;