/**
 * SavePlaceKey container.
 * @module components/SavePlaceKey
 */

import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jwtDecode from 'jwt-decode';
import { getUserToken } from '../../helpers/LocalStorage/userToken';
import { setQueryParam } from '../../utils/url';

import { Spinner } from '../../components';
import { IDLE, PENDING, SUCCESS, FAIL } from '../../constants/status';
import {
  createUserAttribute,
} from '../../actions';

@connect(
  state => ({
    userAttribute: state.userAttribute,
  }),
  dispatch => bindActionCreators({
    createUserAttribute,
  }, dispatch),
)
/**
 * PlaceKeys component class.
 * @class PlaceKeys
 * @extends Component
 */
export default class PlaceKeys extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    location: PropTypes.object,
    userAttribute: PropTypes.object,
    createUserAttribute: PropTypes.func.isRequired,
  };

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    if (__SERVER__) return;
    const { placeToken } = this.props.location.query;
    const userToken = getUserToken();
    if (placeToken) {
      this.props.createUserAttribute({
        data: {
          type: 'place_key',
          token: placeToken,
          placeId: jwtDecode(placeToken).placeId,
        },
        userId: jwtDecode(userToken).sub,
        label: 'Mijn huis',
      });
    }
  }


  /**
   * componentWillReceiveProps
   * @param {Object} nextProps The next props
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.userAttribute.status === SUCCESS) {
      const { return_route: returnRoute } = nextProps.location.query;
      if (typeof returnRoute === 'undefined') return;
      let returnPath = returnRoute;
      const urlParts = returnRoute.split('redirect_uri=');

      if (urlParts.length > 1) {
        returnPath = setQueryParam(
          urlParts[0].slice(0, -1), // Slice is used to strip off the leading & or ?
          'redirect_uri',
          urlParts[1],
        );
      }

      window.location.href = returnPath;
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { status } = this.props.userAttribute;
    return (
      <div id="page-save-place-key">
        <Helmet title="Huissleutel opslaan" />
        <div>
          <Grid>
            <Row>
              <Col xs={12}>
                <h1>Huissleutel opslaan</h1>
                {status === PENDING || status === IDLE ? (
                  <p>Een moment, je huissleutel wordt opgeslagen.<Spinner /></p>) : null}
                {status === SUCCESS ? (<p>Je huissleutel is opgeslagen!</p>) : null}
                {status === FAIL ? (<p>Je huissleutel is helaas niet opgeslagen.</p>) : null}
              </Col>
            </Row>
          </Grid>
        </div>
      </div>);
  }
}
