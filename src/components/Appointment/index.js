import React from 'react';
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';
import "./styles.scss";
import Status from './Status';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";

export default function Appointment(props) {
  const {
    id,
    time,
    interview,
    interviewers,
    bookInterview
  } = props;

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    if (!name && !interviewer) {
      alert('Please fill out the information before saving')
      return
    } else if (!name) {
      alert('Please enter student name')
      return
    } else if (!interviewer) {
      alert('Please select interviewer')
      return
    }

    transition(SAVING)
    const interview = {
      student: name,
      interviewer
    };

    bookInterview(id, interview)
      .then(() => {
        transition(SHOW)
        });
  }

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer.name}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={interviewers}
          onCancel={() => back(EMPTY)}
          onSave={save}
        // onSave={() => save(interview.student, interview.interviewer.id)}
        />)}
      {mode === SAVING && <Status message='Saving'/>}
    </article>
  );
}