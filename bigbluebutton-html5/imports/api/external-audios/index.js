import { Meteor } from 'meteor/meteor';
import { makeCall } from '/imports/ui/services/api';

let streamer = null;
const getStreamer = (meetingID) => {
  if (!streamer) {
    streamer = new Meteor.Streamer(`external-audios-${meetingID}`);
    makeCall('initializeExternalAudio');
  }
  return streamer;
};

export { getStreamer };
