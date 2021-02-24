import { extractCredentials } from '/imports/api/common/server/helpers';
import Logger from '/imports/startup/server/logger';

const allowRecentMessages = (eventName, message) => {
  const {
    userId,
    meetingId,
    time,
    rate,
    state,
  } = message;

  Logger.debug('Quizizz auth allowed', {
    userId, meetingId, eventName, time, rate, state,
  });
  return true;
};

export default function initializeQuizizz() {
  const { meetingId } = extractCredentials(this.userId);

  const streamName = `quizizz-${meetingId}`;
  if (!Meteor.StreamerCentral.instances[streamName]) {
    const streamer = new Meteor.Streamer(streamName);
    streamer.allowRead('all');
    streamer.allowWrite('none');
    streamer.allowEmit(allowRecentMessages);
    Logger.info(`Created Quizizz for ${streamName}`);
  } else {
    Logger.debug('Quizizz is already created', { streamName });
  }
}
