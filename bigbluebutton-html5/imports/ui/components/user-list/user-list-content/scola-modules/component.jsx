import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import Icon from '/imports/ui/components/icon/component';
import { Session } from 'meteor/session';
import { styles } from '/imports/ui/components/user-list/user-list-content/styles';

const intlMessages = defineMessages({
  scolaTitle: {
    id: 'app.scola.section.title',
    description: 'Scola section title',
  },
  gradingTitle: {
    id: 'app.scola.grading.title',
    description: 'grading title',
  },
});

const toggleGradingPanel = () => {
  Session.set(
    'openPanel',
    Session.get('openPanel') === 'grading'
      ? 'userlist'
      : 'grading',
  );
};

const ScolaModules = ({
  compact,
  classData,
  scolaToken,
  intl,
}) => {
  if (classData && scolaToken) {
    return (
      <div className={styles.grading}>
        <div className={styles.container}>
          {
            !compact ? (
              <h2 className={styles.smallTitle}>
                {intl.formatMessage(intlMessages.scolaTitle)}
              </h2>
            ) : (
              <hr className={styles.separator} />
            )
          }
        </div>
        <div
          role="tabpanel"
          tabIndex={0}
          className={styles.scrollableList}
        >
          <div className={styles.list}>
            <div
              role="button"
              tabIndex={0}
              onClick={toggleGradingPanel}
              onKeyDown={() => {}}
              className={styles.listItem}
              aria-label={intl.formatMessage(intlMessages.gradingTitle)}
            >
              <Icon iconName="pen_tool" />
              <span aria-hidden>{intl.formatMessage(intlMessages.gradingTitle)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <span />;
};

ScolaModules.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  compact: PropTypes.bool.isRequired,
  classData: PropTypes.shape({
    centerid: PropTypes.number,
    teacherid: PropTypes.number,
    classid: PropTypes.number,
  }),
  scolaToken: PropTypes.string,
};
ScolaModules.defaultProps = {
  classData: null,
  scolaToken: null,
};

export default injectIntl(ScolaModules);
