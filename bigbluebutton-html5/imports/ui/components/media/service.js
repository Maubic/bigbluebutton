import Presentations from '/imports/api/presentations';
import { isVideoBroadcasting } from '/imports/ui/components/screenshare/service';
import { getVideoUrl } from '/imports/ui/components/external-video-player/service';
import { getAudioUrl } from '/imports/ui/components/external-audio-player/service';
import { getQuizizzUrl } from '/imports/ui/components/quizizz/service';
import Auth from '/imports/ui/services/auth';
import Users from '/imports/api/users';
import Settings from '/imports/ui/services/settings';
import PollingService from '/imports/ui/components/polling/service';
import getFromUserSettings from '/imports/ui/services/users-settings';

const LAYOUT_CONFIG = Meteor.settings.public.layout;
const KURENTO_CONFIG = Meteor.settings.public.kurento;

const getPresentationInfo = () => {
  const currentPresentation = Presentations.findOne({
    current: true,
  });

  return {
    current_presentation: (currentPresentation != null),
  };
};

const isUserPresenter = () => Users.findOne({ userId: Auth.userID },
  { fields: { presenter: 1 } }).presenter;

function shouldShowWhiteboard() {
  return true;
}

function shouldShowScreenshare() {
  const { viewScreenshare } = Settings.dataSaving;
  const enableScreensharing = getFromUserSettings('bbb_enable_screen_sharing', KURENTO_CONFIG.enableScreensharing);
  return enableScreensharing && viewScreenshare && isVideoBroadcasting();
}

function shouldShowExternalVideo() {
  const { enabled: enableExternalVideo } = Meteor.settings.public.externalVideoPlayer;
  return enableExternalVideo && getVideoUrl();
}

function shouldShowExternalAudio() {
  const { enabled: enableExternalAudio } = Meteor.settings.public.externalAudioPlayer;
  return enableExternalAudio && getAudioUrl();
}

function shouldShowQuizizz() {
  const { enabled: enableQuizizz } = Meteor.settings.public.quizizzPlayer;
  return enableQuizizz && getQuizizzUrl();
}


function shouldShowOverlay() {
  return getFromUserSettings('bbb_enable_video', KURENTO_CONFIG.enableVideo);
}

const swapLayout = {
  value: getFromUserSettings('bbb_auto_swap_layout', LAYOUT_CONFIG.autoSwapLayout),
  tracker: new Tracker.Dependency(),
};

const setSwapLayout = () => {
  swapLayout.value = getFromUserSettings('bbb_auto_swap_layout', LAYOUT_CONFIG.autoSwapLayout);
  swapLayout.tracker.changed();
};

const toggleSwapLayout = () => {
  swapLayout.value = !swapLayout.value;
  swapLayout.tracker.changed();
};

export const shouldEnableSwapLayout = () => !shouldShowScreenshare() && (!shouldShowExternalVideo() || !shouldShowExternalAudio || !shouldShowQuizizz);

export const getSwapLayout = () => {
  swapLayout.tracker.depend();
  return swapLayout.value;
};

export default {
  getPresentationInfo,
  shouldShowWhiteboard,
  shouldShowScreenshare,
  shouldShowExternalVideo,
  shouldShowExternalAudio,
  shouldShowQuizizz,
  shouldShowOverlay,
  isUserPresenter,
  isVideoBroadcasting,
  toggleSwapLayout,
  shouldEnableSwapLayout,
  getSwapLayout,
  setSwapLayout,
};
