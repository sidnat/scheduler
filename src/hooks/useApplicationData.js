import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const updateSpots = function(state, appointments, id) {
    const foundDay = state.days.find(d => d.appointments.includes(id));
  
    const spots = foundDay.appointments.filter(apptID => appointments[apptID].interview === null).length;
  
    const updatedDays = state.days.map(d => d.name === foundDay.name ? { ...foundDay, spots } : d);
  
    return updatedDays;
  };

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  async function bookInterview(id, interview) {
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then((response) => {
        if (response.status === 204) {
          const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
          };
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
          setState({ ...state, appointments, days: updateSpots(state, appointments, id) });
        }
      });
  }

  async function cancelInterview(id) {
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then((response) => {
        console.log("test");
        const appointment = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        setState({ ...state, appointments, days:updateSpots(state, appointments, id) });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}