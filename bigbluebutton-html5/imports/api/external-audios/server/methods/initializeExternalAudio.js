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

  Logger.debug(`ExternalAudio Streamer auth allowed userId: ${userId}, meetingId: ${meetingId}, event: ${eventName}, time: ${time} rate: ${rate}, state: ${state}`);
  return true;
};

export default function initializeExternalAudio() {
  const { meetingId } = extractCredentials(this.userId);

  const streamName = `external-audios-${meetingId}`;
  if (!Meteor.StreamerCentral.instances[streamName]) {
    const streamer = new Meteor.Streamer(streamName);
    streamer.allowRead('all');
    streamer.allowWrite('none');
    streamer.allowEmit(allowRecentMessages);
    Logger.info(`Created External Audio streamer for ${streamName}`);
  } else {
    Logger.debug(`External Audio streamer is already created for ${streamName}`);
  }
}
