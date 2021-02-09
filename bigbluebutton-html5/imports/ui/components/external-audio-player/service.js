import Meetings from '/imports/api/meetings';
import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';
import Logger from '/imports/startup/client/logger';

import { getStreamer } from '/imports/api/external-audios';
import { makeCall } from '/imports/ui/services/api';
import { stopWatching as stopWatchingVideo } from '/imports/ui/components/external-video-player/service';

import ReactPlayer from 'react-player';

import Panopto from './custom-players/panopto';

const isUrlValid = url => ReactPlayer.canPlay(url) || Panopto.canPlay(url);

const startWatching = (url) => {
  const meeting = Meetings.findOne({ meetingId: Auth.meetingID }, { fields: { externalVideoUrl: 1 } });
  if (meeting && meeting.externalVideoUrl) {
    stopWatchingVideo();
  }

  let externalAudioUrl = url;

  if (Panopto.canPlay(url)) {
    externalAudioUrl = Panopto.getSocialUrl(url);
  }

  makeCall('startWatchingExternalAudio', { externalAudioUrl });
};

const stopWatching = () => {
  makeCall('stopWatchingExternalAudio');
};

const sendMessage = (event, data) => {
  const meetingId = Auth.meetingID;
  const userId = Auth.userID;

  makeCall('emitExternalAudioEvent', event, { ...data, meetingId, userId });
};

const onMessage = (message, func) => {
  const streamer = getStreamer(Auth.meetingID);
  streamer.on(message, func);
};

const removeAllListeners = (eventType) => {
  const streamer = getStreamer(Auth.meetingID);
  streamer.removeAllListeners(eventType);
};

const getAudioUrl = () => {
  const meetingId = Auth.meetingID;
  const meeting = Meetings.findOne({ meetingId }, { fields: { externalAudioUrl: 1 } });

  return meeting && meeting.externalAudioUrl;
};

export {
  sendMessage,
  onMessage,
  removeAllListeners,
  getAudioUrl,
  isUrlValid,
  startWatching,
  stopWatching,
};
