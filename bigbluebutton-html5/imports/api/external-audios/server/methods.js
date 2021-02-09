import { Meteor } from 'meteor/meteor';
import startWatchingExternalAudio from './methods/startWatchingExternalAudio';
import stopWatchingExternalAudio from './methods/stopWatchingExternalAudio';
import initializeExternalAudio from './methods/initializeExternalAudio';
import emitExternalAudioEvent from './methods/emitExternalAudioEvent';

Meteor.methods({
  initializeExternalAudio,
  startWatchingExternalAudio,
  stopWatchingExternalAudio,
  emitExternalAudioEvent,
});
