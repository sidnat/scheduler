import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  const setDay = day => setState({ ...state, day });

  const updateSpots = function(state, appointments) {
    const foundDay = state.days.find(elem => elem.name === state.day);

    let spots = 0;

    for (let id of foundDay.appointments) {
      const appointment = appointments[id];

      if (appointment.interview === null) {
        spots++;
      }
    };

    const updatedDays = state.days.map(elem => elem.name === state.day ? { ...foundDay, spots } : elem);

    return updatedDays;
  };

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(state, appointments);

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState({ ...state, appointments, days });
      });
  };

  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(state, appointments);

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState({ ...state, appointments, days });
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
};