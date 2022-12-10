import React from 'react';
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';
import "./styles.scss";
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = 'CONFIRM';
const DELETING = 'DELETING';
const EDIT = "EDIT";
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';

export default function Appointment(props) {
  const {
    id,
    time,
    interview,
    interviewers,
    bookInterview,
    cancelInterview
  } = props;
  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    
    transition(SAVING);

    bookInterview(id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  function destroy(id) {
    transition(DELETING, true);

    cancelInterview(id)
      .then(() => { transition(EMPTY); })
      .catch(error => transition(ERROR_DELETE, true));
  };

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer.name}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
        />)}
      {mode === SAVING && <Status message='Saving' />}
      {mode === CONFIRM && <Confirm
        message='Delete the appointment?'
        onCancel={() => back()}
        onConfirm={() => destroy(id)}
      />}
      {mode === DELETING && <Status message='Deleting' />}
      {mode === EDIT && <Form
        interviewers={interviewers}
        onCancel={() => back()}
        onSave={save}
        student={interview.student}
        interviewer={interview?.interviewer?.name}
      />}
      {mode === ERROR_SAVE && <Error
        message='Could not save appointment'
        onClose={() => transition(EMPTY)}
      />}
      {mode === ERROR_DELETE && <Error
        message='Could not delete appointment'
        onClose={() => transition(SHOW)}
      />}
    </article>
  );
}