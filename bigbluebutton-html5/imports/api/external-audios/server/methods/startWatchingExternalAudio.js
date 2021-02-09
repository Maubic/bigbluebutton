import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import Meetings from '/imports/api/meetings';
import Users from '/imports/api/users';
import RedisPubSub from '/imports/startup/server/redis';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function startWatchingExternalAudio(options) {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'StartExternalAudioMsg';

  const { meetingId, requesterUserId: userId } = extractCredentials(this.userId);
  const { externalAudioUrl } = options;

  try {
    check(meetingId, String);
    check(userId, String);
    check(externalAudioUrl, String);

    const user = Users.findOne({ meetingId, userId, presenter: true }, { presenter: 1 });

    if (!user) {
      Logger.error(`Only presenters are allowed to start external audio for a meeting. meeting=${meetingId} userId=${userId}`);
      return;
    }

    Meetings.update({ meetingId }, { $set: { externalAudioUrl } });

    const payload = { externalAudioUrl };

    Logger.info(`User id=${userId} sharing an external audio: ${externalAudioUrl} for meeting ${meetingId}`);

    return RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, userId, payload);
  } catch (error) {
    Logger.error(`Error on sharing an external audio: ${externalAudioUrl} ${error}`);
  }
}
