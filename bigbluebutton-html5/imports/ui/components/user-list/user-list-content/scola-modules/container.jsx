import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ScolaModules from './component';
import getFromUserSettings from '/imports/ui/services/users-settings';
import { getCookie } from '/imports/ui/components/grading/service';

const ScolaModulesContainer = props => <ScolaModules {...props} />;

export default withTracker(() => ({
  classData: getFromUserSettings('scola_class_data', false),
  scolaToken: getCookie('scolaToken', null),
}))(ScolaModulesContainer);
