import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import { withModalMounter } from '/imports/ui/components/modal/service';
import { Session } from 'meteor/session';
import GradingModal from './grading-modal/component';
import Button from '/imports/ui/components/button/component';
import { fetchStudents, updateStudentInfo } from './service';
import { styles } from './styles';

const intlMessages = defineMessages({
  panelTitle: {
    id: 'app.scola.grading.panel.title',
    description: 'grading panel title',
  },
});

const StudentItem = withModalMounter((props) => {
  const { student, mountModal, onUpdateStudent } = props;
  const { fullName, avatarUrl } = student;

  const showGradingModal = () => mountModal(
    <GradingModal
      student={student}
      onRequestClose={() => mountModal(null)}
      onSubmit={async (data) => {
        await onUpdateStudent(data);
        mountModal(null);
      }}
    />,
  );

  return (
    <div
      role="button"
      className={styles.listItem}
      onClick={showGradingModal}
      onKeyDown={() => {}}
      tabIndex={0}
    >
      <div className={styles.image}>
        <img
          className={cx(styles.img, styles.circle)}
          src={avatarUrl}
          alt="avatar"
        />
      </div>
      <span>{fullName}</span>
    </div>
  );
});

const StudentsList = (props) => {
  const { students, onUpdateStudent } = props;

  return (
    <div className={styles.list}>
      {
        students.map(student => (
          <StudentItem
            key={student.id}
            student={student}
            onUpdateStudent={onUpdateStudent}
          />
        ))
      }
    </div>
  );
};


const Grading = (props) => {
  const { classData, scolaToken, intl } = props;
  const { centerid, teacherid, classid } = classData;

  const [studentInfo, setStudentInfo] = useState({
    loading: true,
    students: [],
  });

  const getStudentsInfoWithFetch = async () => {
    const students = await fetchStudents(centerid, teacherid, classid, scolaToken);

    setStudentInfo({
      loading: false,
      students,
    });
  };

  const updateOneStudentInfo = async (data) => {
    await updateStudentInfo(centerid, teacherid, classid, scolaToken, data);
    await getStudentsInfoWithFetch();
  };

  useEffect(() => {
    getStudentsInfoWithFetch();
  }, []);

  return (
    <div>
      <header className={styles.header}>
        <Button
          onClick={() => {
            Session.set('openPanel', 'userlist');
          }}
          aria-label={intl.formatMessage(intlMessages.panelTitle)}
          label={intl.formatMessage(intlMessages.panelTitle)}
          icon="left_arrow"
          className={styles.hideBtn}
        />
      </header>
      {studentInfo.loading
        ? (
          <div className={styles.spinner}>
            <div className={styles.bounce1} />
            <div className={styles.bounce2} />
            <div />
          </div>
        ) : (
          <StudentsList
            students={studentInfo.students}
            onUpdateStudent={updateOneStudentInfo}
          />
        )
      }
    </div>
  );
};

export default injectIntl(Grading);
