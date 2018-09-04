/**
 * VerifyEmailComplete container.
 * @module containers/VerifyEmailComplete
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { get } from 'lodash';

import { PageTitle } from '../../components';
import { verifyEmailComplete, hideAppMenu, showAppMenu } from '../../actions';

@connect(
  state => ({ emailVerification: state.emailVerification }),
  dispatch => bindActionCreators({ verifyEmailComplete, hideAppMenu, showAppMenu }, dispatch),
)
/**
 * VerifyEmailComplete component class.
 * @class VerifyEmailComplete
 * @extends Component
 */
export default class VerifyEmailComplete extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    location: PropTypes.object,
    verifyEmailComplete: PropTypes.func.isRequired,
    emailVerification: PropTypes.object.isRequired,
    hideAppMenu: PropTypes.func.isRequired,
    showAppMenu: PropTypes.func.isRequired,
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.hideAppMenu();
    // To show the result of the call, execute this only on the client.
    this.props.verifyEmailComplete(get(this.props, 'location.query.token'));
  }

  /**
   * Component will unmount
   * @method componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    this.props.showAppMenu();
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { emailVerification } = this.props;
    const returnUrl = get(this.props, 'location.query.returnUrl');
    return (
      <div id="page-verify-email-complete">
        <Helmet title="E-mailadres bevestigd" />
        <Grid fluid>
          <Row>
            <Col xs={12}>
              {emailVerification.complete &&
                <PageTitle>Je e-mailadres is bevestigd</PageTitle>
              }
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {emailVerification.error &&
                <div className="text-danger">{emailVerification.error.message}</div>
              }
              {returnUrl && returnUrl !== 'undefined' &&
                <p>
                  <Button
                    onClick={() => (window.location.href = `${returnUrl}&emailIsVerified=true`)}
                    bsStyle="primary"
                  >
                    Ga naar de dienst
                  </Button>
                </p>
              }
              {returnUrl && returnUrl === 'undefined' &&
                <p>
                  <Link className="btn btn-primary" to="/mijn-account/naam">
                    Ga naar mijn gegevens
                  </Link>
                </p>
              }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
