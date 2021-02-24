import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import Meetings from '/imports/api/meetings';
import Users from '/imports/api/users';
import RedisPubSub from '/imports/startup/server/redis';
import { extractCredentials } from '/imports/api/common/server/helpers';

const https = require('https');

export default function startWatchingQuizizz(options) {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'StartQuizizzMsg';

  const { meetingId, requesterUserId: userId } = extractCredentials(this.userId);
  const { quizizzId } = options;

  const createQuizizzMultiuser = _quizizzId => new Promise(((resolve, reject) => {
    const data = `{"quizId":"${_quizizzId}","type":"tp","expiry":7200,"locale":"es","gameOptions":{"memeset":"5c65cf51a7d584001a2630dd","studentLeaderboard":true,"timer":true,"timer_3":"classic","jumble":true,"jumbleAnswers":false,"memes":true,"showAnswers_2":"always","studentQuizReview_2":"yes","showAnswers":true,"studentQuizReview":true,"studentMusic":true,"redemption":"yes","powerups":"yes","nicknameGenerator":false,"loginRequired":false,"questionsPerAttempt":0},"memeSet":"5c65cf51a7d584001a2630dd","groupIds":[],"title":null,"description":null,"assignedTo":[],"brandingOptions":null}`;

    const httpoptions = {
      hostname: 'quizizz.com',
      port: 443,
      path: '/api/main/game',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(httpoptions, (res) => {
      Logger.info(`statusCode: ${res.statusCode}`);

      res.on('data', (d) => {
        resolve(JSON.parse(d));
      });
    });

    req.on('error', (error) => {
      Logger.error(error);
      reject(error);
    });

    req.write(data);
    req.end();
  }));

  try {
    check(meetingId, String);
    check(userId, String);
    check(quizizzId, String);

    const user = Users.findOne({ meetingId, userId, presenter: true }, { presenter: 1 });

    if (!user) {
      Logger.error(`Only presenters are allowed to start Quizizz for a meeting. meeting=${meetingId} userId=${userId}`);
      return;
    }

    Logger.info(`Trying to get URLs for Quiz ${quizizzId} in ${meetingId} - userId=${userId}`);
    createQuizizzMultiuser(quizizzId).then((response) => {
      const quizizzUrl = `https://stoic-rosalind-9f0caa.netlify.app/frame.html?zoom=0.9&path=/admin/presentation/${response.data.roomHash}/start`;

      // var quizizzUrl = `https://stoic-rosalind-9f0caa.netlify.app/admin/presentation/${response.data.roomHash}/start`;

      const quizizzStudentUrl = `https://quizizz.com/join?gc=${response.data.roomCode}`;

      Logger.info(`Quizizz Admin URL: ${quizizzUrl}`);
      Logger.info(`Quizizz Styudent URL: ${quizizzStudentUrl}`);

      Meetings.update({ meetingId }, { $set: { quizizzUrl } });
      Meetings.update({ meetingId }, { $set: { quizizzStudentUrl } });

      const payload = { quizizzUrl };

      Logger.info(`User id=${userId} sharing a Quizizz: ${quizizzUrl} for meeting ${meetingId} and payload ${payload}`);

      return RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, userId, payload);
    }).catch((error) => {
      Logger.error(`Error sharing Quizizz: ${quizizzId} ${error}`);
    });
  } catch (error) {
    Logger.error(`Error sharing Quizizz: ${quizizzId} ${error}`);
  }
}
