const SCOLA_BACKEND_URL = Meteor.settings.public.scola.url;

function getCookie(key, defaultValue) {
  const match = document.cookie.match(`(^|;) ?${key}=([^;]*)(;|$)`);
  const value = match ? match[2] : defaultValue;

  return value;
}

async function fetchStudents(centerid, teacherid, classid, token) {
  const filter = encodeURIComponent(JSON.stringify({ include: ['students', 'studentInfo'] }));

  const response = await fetch(`${SCOLA_BACKEND_URL}/centers/${centerid}/teachers/${teacherid}/classes/${classid}?filter=${filter}`, {
    method: 'GET',
    headers: { Authorization: token },
  });
  const jsonData = await response.json();
  return (jsonData.studentInfo || []).map((info) => {
    const student = jsonData.students.find(el => el.id === info.studentId);
    return {
      ...info,
      avatarUrl: student.avatarUrl,
      fullName: [student.name, student.surname].join(' '),
    };
  });
}

async function updateStudentInfo(centerid, teacherid, classid, token, studentInfo) {
  const currentStudentsInfo = await fetchStudents(centerid, teacherid, classid, token);
  const oldStudentInfoIndex = currentStudentsInfo.findIndex(el => el.id === studentInfo.id);

  if (oldStudentInfoIndex > -1) {
    currentStudentsInfo[oldStudentInfoIndex] = {
      ...currentStudentsInfo[oldStudentInfoIndex],
      feedback: studentInfo.feedback,
      mark: studentInfo.mark,
      attendance: studentInfo.attendance,
    };
  }

  return fetch(`${SCOLA_BACKEND_URL}/centers/${centerid}/teachers/${teacherid}/classes/${classid}`, {
    method: 'PUT',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: classid,
      studentClassInfos: currentStudentsInfo,
    }),
  });
}

export {
  getCookie,
  fetchStudents,
  updateStudentInfo,
};
