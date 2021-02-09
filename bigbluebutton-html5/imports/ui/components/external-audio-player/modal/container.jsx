import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withModalMounter } from '/imports/ui/components/modal/service';
import ExternalAudioModal from './component';
import { startWatching, getAudioUrl } from '../service';

const ExternalAudioModalContainer = props => <ExternalAudioModal {...props} />;

export default withModalMounter(withTracker(({ mountModal }) => ({
  closeModal: () => {
    mountModal(null);
  },
  startWatching,
  audioUrl: getAudioUrl(),
}))(ExternalAudioModalContainer));
