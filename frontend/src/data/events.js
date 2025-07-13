const events = [
  {
    id: "event123",
    name: "Morocco vs France - Final Match",
    date: "2025-08-15",
    time: "20:00",
    location: "Fan Zone Morroco Mall",
    description: "Experience the final match with live commentary, food trucks, and giant screens.",
    image: "/assets/images/Morocco_mall.jpg",
  },
  {
    id: "event456",
    name: "Morocco vs Spain - Viewing Party",
    date: "2025-08-20",
    time: "18:00",
    location: "Fan Zone NIVADA",
    description: "Join thousands of fans cheering for the Atlas Lions!",
    image: "/assets/images/nivada.jpeg",
  },
  {
    id: "event789",
    name: "Opening Ceremony CAN 2025",
    date: "2025-08-10",
    time: "17:30",
    location:"FanZone Anfa Park",
    description: "Music, lights, fireworks, and guest performers at the FanZone by the sea.",
    image: "/assets/images/anfa-park.png",
  },
];



export default events;

export const getEventById = (id) => {
  return events.find(event => event.id === id);
};
export const getAllEvents = () => {
  return events;
};
export const getEventsByLocation = (location) => {
  return events.filter(event => event.location.name === location);
};
export const getEventsByDate = (date) => {
  return events.filter(event => event.date === date);
};
export const getEventsByName = (name) => {
  return events.filter(event => event.name.toLowerCase().includes(name.toLowerCase()));
};
