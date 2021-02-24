import { Meteor } from 'meteor/meteor';
import startWatchingQuizizz from './methods/startWatchingQuizizz';
import stopWatchingQuizizz from './methods/stopWatchingQuizizz';
import initializeQuizizz from './methods/initializeQuizizz';
import emitQuizizzEvent from './methods/emitQuizizzEvent';

Meteor.methods({
  initializeQuizizz,
  startWatchingQuizizz,
  stopWatchingQuizizz,
  emitQuizizzEvent,
});
