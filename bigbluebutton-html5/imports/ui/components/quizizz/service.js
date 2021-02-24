import Meetings from '/imports/api/meetings';
import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';

import { getStreamer } from '/imports/api/quizizz'; // SNA: TODO
import { makeCall } from '/imports/ui/services/api';
import { stopWatching as stopWatchingVideo } from '//imports/ui/components/external-video-player/service';
import { stopWatching as stopListeningAudio } from '//imports/ui/components/external-audio-player/service';

import QuizizzPlayer from './custom-players/quizizz';

const isUrlValid = url => QuizizzPlayer.canPlay(url);

const startWatching = (url) => {
  const meeting = Meetings.findOne(
    {
      meetingId: Auth.meetingID,
    }, {
      fields:
      {
        externalVideoUrl: 1,
      },
    },
  );
  if (meeting && meeting.externalVideoUrl) {
    stopWatchingVideo();
  }

  const meetingAudio = Meetings.findOne(
    {
      meetingId: Auth.meetingID,
    }, {
      fields:
      {
        externalAudioUrl: 1,
      },
    },
  );
  if (meetingAudio && meetingAudio.externalAudioUrl) {
    stopListeningAudio();
  }

  if (QuizizzPlayer.canPlay(url)) {
    const quizizzId = QuizizzPlayer.getQuizizzId(url);
    makeCall('startWatchingQuizizz', { quizizzId });
  }
};

const stopWatching = () => {
  makeCall('stopWatchingQuizizz');
};

/* Not used in Quizizz */
const sendMessage = (event, data) => {
  const meetingId = Auth.meetingID;
  const userId = Auth.userID;

  makeCall('emitQuizizzEvent', event, { ...data, meetingId, userId });
};

const onMessage = (message, func) => {
  const streamer = getStreamer(Auth.meetingID);
  streamer.on(message, func);
};

const removeAllListeners = (eventType) => {
  const streamer = getStreamer(Auth.meetingID);
  streamer.removeAllListeners(eventType);
};

const amIPresenter = () => {
  const presenter = Users.findOne({ userId: Auth.userID }, { fields: { presenter: 1 } });

  return presenter.presenter;
};

const getQuizizzUrl = () => {
  const meetingId = Auth.meetingID;

  if (amIPresenter()) {
    const meeting = Meetings.findOne({ meetingId }, { fields: { quizizzUrl: 1 } });
    return meeting && meeting.quizizzUrl;
  }
  const meeting = Meetings.findOne({ meetingId }, { fields: { quizizzStudentUrl: 1 } });
  return meeting && meeting.quizizzStudentUrl;
};


export {
  sendMessage,
  onMessage,
  removeAllListeners,
  getQuizizzUrl,
  isUrlValid,
  startWatching,
  stopWatching,
};
