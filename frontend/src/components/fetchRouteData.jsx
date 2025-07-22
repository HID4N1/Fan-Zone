import axios from 'axios';

const fetchRouteData = async (routeId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/routes/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching route data:", error);
    if (error.response && error.response.status === 500) {
      alert("Server error occurred while fetching route data. Please try again later.");
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
    return null;
  }
};

export default fetchRouteData;
