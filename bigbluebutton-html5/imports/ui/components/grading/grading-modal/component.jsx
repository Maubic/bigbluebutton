import React, { useState } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Modal from '/imports/ui/components/modal/simple/component';
import Button from '/imports/ui/components/button/component';
import { styles } from './styles';

const intlMessages = defineMessages({
  attendanceLabel: {
    id: 'app.scola.grading.modal.attendance',
    description: 'attendance label',
  },
  markLabel: {
    id: 'app.scola.grading.modal.mark',
    description: 'mark label',
  },
  feedbackLabel: {
    id: 'app.scola.grading.modal.feedback',
    description: 'feedback label',
  },
  dismissLabel: {
    id: 'app.scola.grading.modal.dismissLabel',
    description: 'dismiss label button',
  },
  saveLabel: {
    id: 'app.scola.grading.modal.saveLabel',
    description: 'saveLabel label button',
  },
});

const GradingModal = (props) => {
  const {
    student, onRequestClose, onSubmit, intl,
  } = props;
  const {
    fullName, mark, feedback, attendance,
  } = student;

  const [grading, setGrading] = useState({
    mark: mark || 0,
    feedback,
    attendance,
  });

  const onChangeMark = (event) => {
    setGrading({
      ...grading,
      mark: Number.parseFloat(event.target.value, 10) || '',
    });
  };
  const onBlurMark = (event) => {
    const value = Number.parseFloat(event.target.value, 10);
    setGrading({ ...grading, mark: value > 0 ? value : 0 });
  };

  const onChangeAttendace = () => {
    setGrading({
      ...grading,
      attendance: !grading.attendance,
    });
  };

  const onChangeFeedback = (event) => {
    setGrading({
      ...grading,
      feedback: event.target.value,
    });
  };

  return (
    <Modal
      title={fullName}
      onRequestClose={onRequestClose}
      hideBorder
    >
      <div className={styles.content}>
        <div>
          <label htmlFor="student-grading-attendance" className={styles.split}>
            {intl.formatMessage(intlMessages.attendanceLabel)}
            <input
              type="checkbox"
              className={styles.attendance}
              id="student-grading-attendance"
              onChange={onChangeAttendace}
              checked={grading.attendance}
              aria-label={intl.formatMessage(intlMessages.attendanceLabel)}
            />
          </label>
          <label htmlFor="student-grading-mark" className={styles.split}>
            {intl.formatMessage(intlMessages.markLabel)}
            <input
              type="number"
              className={styles.mark}
              id="student-grading-mark"
              min="0"
              max="10"
              step="0.01"
              value={grading.mark}
              onChange={onChangeMark}
              onBlur={onBlurMark}
              aria-label={intl.formatMessage(intlMessages.markLabel)}
            />
          </label>
        </div>
        <div className={styles.feedback}>
          <label htmlFor="student-grading-feedback">
            {intl.formatMessage(intlMessages.feedbackLabel)}
            <textarea
              rows="5"
              className={styles.textarea}
              id="student-grading-feedback"
              value={grading.feedback}
              onChange={onChangeFeedback}
              aria-label={intl.formatMessage(intlMessages.feedbackLabel)}
            />
          </label>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.actions}>
          <Button
            color="primary"
            className={styles.button}
            label={intl.formatMessage(intlMessages.saveLabel)}
            onClick={() => onSubmit({ ...student, ...grading })}
          />
          <Button
            label={intl.formatMessage(intlMessages.dismissLabel)}
            className={styles.button}
            onClick={onRequestClose}
          />
        </div>
      </div>
    </Modal>
  );
};


GradingModal.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  student: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    mark: PropTypes.number,
    feedback: PropTypes.string,
    attendance: PropTypes.bool.isRequired,
  }).isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default injectIntl(GradingModal);
