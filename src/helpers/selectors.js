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

export function getInterviewersForDay(state, day) {
  const scheduleDay = state.days.find(elem => elem.name === day);

  if (state.days.length === 0 || !scheduleDay) {
    return [];
  }

  const arr = []

  for (let i = 0; i < scheduleDay.appointments.length; i++) {
    if (state.appointments[scheduleDay.appointments[i]].interview) {
    const interviewerID = state.appointments[scheduleDay.appointments[i]].interview.interviewer;
    arr.push(state.interviewers[interviewerID]);
    }
  }

  return arr;
}

export function getInterview(state, interview) {
  if (interview === null) {
    return null;
  }

  const interviewer = Object.values(state.interviewers).find(elem => elem.id === interview.interviewer);

  return {
    "student": interview.student,
    "interviewer": interviewer
  };
}
