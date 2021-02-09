import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { getAudioUrl } from './service';
import ExternalAudio from './component';

const ExternalAudioContainer = props => (
  <ExternalAudio {...{ ...props }} />
);

export default withTracker(({ isPresenter }) => {
  const inEchoTest = Session.get('inEchoTest');
  return {
    inEchoTest,
    isPresenter,
    audioUrl: getAudioUrl(),
  };
})(ExternalAudioContainer);
