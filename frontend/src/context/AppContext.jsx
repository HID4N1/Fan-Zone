import React, { createContext, useContext, useReducer } from 'react';
import api from '../admin/services/api'; 

const AppContext = createContext();

const initialState = {
  event: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_EVENT':
      return {
        ...state,
        event: action.payload,
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getEvent = async (id) => {
    try {
      const response = await api.get(`events/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch event:', error);
      return null;
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      const payload = {
        name: eventData.title,
        description: eventData.description,
        date: eventData.date,
        start_time: `${eventData.date}T${eventData.time}:00Z`,
        fanzone: eventData.fanzoneId, // Send selected fanzone ID
        qr_code_id: `event-${id}`,    // optional: reuse or keep original
      };
  
      await api.put(`events/${id}/`, payload);
      return true;
    } catch (error) {
      console.error('Failed to update event:', error);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, getEvent, updateEvent }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
