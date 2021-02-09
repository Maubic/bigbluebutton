import { Meteor } from 'meteor/meteor';
import Logger from '/imports/startup/server/logger';

export default function destroyExternalAudio(meetingId) {
  const streamName = `external-audios-${meetingId}`;

  if (Meteor.StreamerCentral.instances[streamName]) {
    Logger.info(`Destroying External Audio streamer object for ${streamName}`);
    delete Meteor.StreamerCentral.instances[streamName];
  }
}
