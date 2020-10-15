import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import getFromUserSettings from '/imports/ui/services/users-settings';
import Grading from './component';
import { getCookie } from './service';

const GradingContainer = props => (
  <Grading {...{ ...props }} />
);

export default withTracker(() => ({
  classData: getFromUserSettings('scola_class_data', false),
  scolaToken: getCookie('scolaToken', null),
}))(GradingContainer);
