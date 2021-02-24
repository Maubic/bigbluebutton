import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withModalMounter } from '/imports/ui/components/modal/service';
import Modal from '/imports/ui/components/modal/simple/component';
import Button from '/imports/ui/components/button/component';

import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { isUrlValid } from '../service';

import { styles } from './styles';

const propTypes = {
  intl: intlShape.isRequired,
  quizizzUrl: PropTypes.string,
  startWatching: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

const defaultProps = {
  quizizzUrl: '',
};

const intlMessages = defineMessages({
  start: {
    id: 'app.quizizz.start',
    description: 'Share external audio',
  },
  urlError: {
    id: 'app.quizizz.urlError',
    description: 'Not a audio URL error',
  },
  input: {
    id: 'app.quizizz.input',
    description: 'Quizizz URL',
  },
  urlInput: {
    id: 'app.quizizz.urlInput',
    description: 'URL input field placeholder',
  },
  title: {
    id: 'app.quizizz.title',
    description: 'Modal title',
  },
  close: {
    id: 'app.quizizz.close',
    description: 'Close',
  },
  note: {
    id: 'app.quizizz.noteLabel',
    description: 'provides hint about Shared External audios',
  },
});

class QuizizzModal extends Component {
  constructor(props) {
    super(props);

    const { quizizzUrl } = props;

    this.state = {
      url: quizizzUrl,
      sharing: quizizzUrl,
    };

    this.startWatchingHandler = this.startWatchingHandler.bind(this);
    this.updateAudioUrlHandler = this.updateAudioUrlHandler.bind(this);
    this.renderUrlError = this.renderUrlError.bind(this);
    this.updateAudioUrlHandler = this.updateAudioUrlHandler.bind(this);
  }

  startWatchingHandler() {
    const {
      startWatching,
      closeModal,
    } = this.props;

    const { url } = this.state;

    startWatching(url.trim());
    closeModal();
  }

  updateAudioUrlHandler(ev) {
    this.setState({ url: ev.target.value });
  }

  renderUrlError() {
    const { intl } = this.props;
    const { url } = this.state;

    const valid = (!url || url.length <= 3) || isUrlValid(url);

    return (
      !valid
        ? (
          <div className={styles.urlError}>
            {intl.formatMessage(intlMessages.urlError)}
          </div>
        )
        : null
    );
  }

  render() {
    const { intl, closeModal } = this.props;
    const { url, sharing } = this.state;

    const startDisabled = !isUrlValid(url);

    return (
      <Modal
        overlayClassName={styles.overlay}
        className={styles.modal}
        onRequestClose={closeModal}
        contentLabel={intl.formatMessage(intlMessages.title)}
        hideBorder
      >
        <header data-test="audioModealHeader" className={styles.header}>
          <h3 className={styles.title}>{intl.formatMessage(intlMessages.title)}</h3>
        </header>

        <div className={styles.content}>
          <div className={styles.quizizzUrl}>
            <label htmlFor="audio-modal-input" id="audio-modal-input">
              {intl.formatMessage(intlMessages.input)}
              <input
                id="audio-modal-input"
                onChange={this.updateAudioUrlHandler}
                name="audio-modal-input"
                placeholder={intl.formatMessage(intlMessages.urlInput)}
                disabled={sharing}
                aria-describedby="exernal-audio-note"
              />
            </label>
            <div className={styles.externalAudioNote} id="external-audio-note">
              {intl.formatMessage(intlMessages.note)}
            </div>
          </div>

          <div>
            {this.renderUrlError()}
          </div>

          <Button
            className={styles.startBtn}
            label={intl.formatMessage(intlMessages.start)}
            onClick={this.startWatchingHandler}
            disabled={startDisabled}
          />
        </div>
      </Modal>
    );
  }
}
QuizizzModal.propTypes = propTypes;
QuizizzModal.defaultProps = defaultProps;

export default injectIntl(withModalMounter(QuizizzModal));
