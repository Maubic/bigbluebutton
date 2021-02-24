import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { getQuizizzUrl } from './service';
import QuizizzPlayer from './component';

const QuizizzPlayerContainer = props => (
  <QuizizzPlayer {...{ ...props }} />
);

export default withTracker(({ isPresenter }) => {
  const inEchoTest = Session.get('inEchoTest');
  return {
    inEchoTest,
    isPresenter,
    quizizzUrl: getQuizizzUrl(),
  };
})(QuizizzPlayerContainer);
