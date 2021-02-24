import PropTypes from 'prop-types';
import React, { Component } from 'react';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import { injectIntl } from 'react-intl';
import Iframe from 'react-iframe';

import { styles } from './styles';

const propTypes = {
  quizizzUrl: PropTypes.string,
  isPresenter: PropTypes.bool,
};

const defaultProps = {
  quizizzUrl: '',
  isPresenter: false,
};

class QuizizzPlayer extends Component {
  constructor(props) {
    super(props);


    this.hasPlayedBefore = false;
    this.playerIsReady = false;

    this.lastMessage = null;
    this.lastMessageTimestamp = Date.now();

    this.throttleTimeout = null;

    this.state = {
    };

    this.opts = {
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleOnReady = this.handleOnReady.bind(this);
    this.resizeListener = () => {
      setTimeout(this.handleResize, 0);
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeListener);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isPresenter } = this.props;
    const { playing } = this.state;

    // If user is presenter we don't re-render playing state changes
    // Because he's in control of the play/pause status
    if (nextProps.isPresenter && isPresenter && nextState.playing !== playing) {
      return false;
    }

    return true;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener);
  }

  handleResize() {
    if (!this.player || !this.playerParent) {
      return;
    }

    const par = this.playerParent.parentElement;
    const w = par.clientWidth;
    const h = par.clientHeight;
    const idealW = h * 16 / 9;

    const style = {};
    if (idealW > w) {
      style.width = w;
      style.height = w * 9 / 16;
    } else {
      style.width = idealW;
      style.height = h;
    }

    const styleStr = `width: ${style.width}px; height: ${style.height}px;`;
    this.player.wrapper.style = styleStr;
    this.playerParent.style = styleStr;
  }

  handleOnReady() {
    this.handleResize();
  }

  render() {
    const { quizizzUrl } = this.props;

    return (
      <div
        id="quizizz"
        data-test="quizizzPlayer"
        style={{ width: '90%' }}
        ref={(ref) => { this.playerParent = ref; }}
      >
        <Iframe
          className={styles.audioPlayer}
          url={quizizzUrl}
          width="100%"
          height="700px"
          display="initial"
          position="relative"
        />
      </div>
    );
  }
}

QuizizzPlayer.propTypes = propTypes;
QuizizzPlayer.defaultProps = defaultProps;

export default injectIntl(injectWbResizeEvent(QuizizzPlayer));
