import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withModalMounter } from '/imports/ui/components/modal/service';
import QuizizzModal from './component';
import { startWatching, getQuizizzUrl } from '../service';

const QuizizzModalContainer = props => <QuizizzModal {...props} />;

export default withModalMounter(withTracker(({ mountModal }) => ({
  closeModal: () => {
    mountModal(null);
  },
  startWatching,
  quizizzUrl: getQuizizzUrl(),
}))(QuizizzModalContainer));
