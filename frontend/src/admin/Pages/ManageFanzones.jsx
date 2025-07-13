import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../services/api'; 
import './ManageFanzones.css'; 
const ManageEvents = () => {
    return (

        <div className="manage-Fanzones">
        <h1>Manage Fanzones</h1>
        <p>This page will allow admins to manage Fanzones.</p>
        </div>

    );
    }

export default ManageEvents;