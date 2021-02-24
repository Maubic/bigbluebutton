import { Meteor } from 'meteor/meteor';
import { makeCall } from '/imports/ui/services/api';

let streamer = null;
const getStreamer = (meetingID) => {
  if (!streamer) {
    streamer = new Meteor.Streamer(`quizizz-${meetingID}`);
    makeCall('initializeQuizizz');
  }
  return streamer;
};

export { getStreamer };
