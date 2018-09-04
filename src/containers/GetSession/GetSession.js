/**
 * Get session container.
 * @module components/GetSession
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner } from '../../components';
import { getUserPlaceSession } from '../../actions';
import { setQueryParam } from '../../utils/url';
import redirect from '../../utils/redirect';

@connect(
  state => ({
    session: state.userPlaceSession,
  }),
  dispatch => bindActionCreators({ getUserPlaceSession }, dispatch),
)
/**
 * Get Session component class.
 * @class getSession
 * @extends Component
 */
export default class getSession extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getUserPlaceSession: PropTypes.func.isRequired,
    session: PropTypes.object,
    location: React.PropTypes.shape({
      href: React.PropTypes.string,
      query: React.PropTypes.shape({
        redirect_uri: React.PropTypes.string,
        audience: React.PropTypes.string,
        clientId: React.PropTypes.string,
        place_id: React.PropTypes.string,
      }),
    }),
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getUserPlaceSession(
      this.props.location.query.audience,
      this.props.location.query.place_id
    );
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const redirectUri = decodeURIComponent(this.props.location.query.redirect_uri);
    if (nextProps.session.token && redirectUri) {
      redirect(
        setQueryParam(redirectUri, 'token', nextProps.session.token),
        this.props.location.query.clientId,
      );
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div id="page-get-session">
        <Helmet title="Sessie ophalen" />
        <Spinner />
      </div>
    );
  }
}
