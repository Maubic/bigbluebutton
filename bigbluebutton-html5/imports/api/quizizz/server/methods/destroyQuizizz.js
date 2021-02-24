import { Meteor } from 'meteor/meteor';
import Logger from '/imports/startup/server/logger';

export default function destroyQuizizz(meetingId) {
  const streamName = `quizizz-${meetingId}`;

  if (Meteor.StreamerCentral.instances[streamName]) {
    Logger.info(`Destroying Quizizz object for ${streamName}`);
    delete Meteor.StreamerCentral.instances[streamName];
  }
}
