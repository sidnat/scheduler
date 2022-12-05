export function getAppointmentsForDay(state, day) {
  const scheduleDay = state.days.find(elem => elem.name === day);

  if (state.days.length === 0 || !scheduleDay) {
    return [];
  }

  const arr = scheduleDay.appointments.map(appt => {
    return state.appointments[appt];
  });

  return arr;
}