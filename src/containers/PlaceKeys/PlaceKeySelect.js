/**
 * PlaceKeySelect container.
 * @module components/PlaceKeys/PlaceKeySelect
 */

import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { bindActionCreators, compose } from 'redux';
import { get, isEqual } from 'lodash';

import { SUCCESS } from '../../constants/status';
import { getUserAttributes, getUserPlaceSession, getServiceProvider } from '../../actions';
import { PlaceKeyForm, PageTitle } from '../../components';
import { setQueryParams, setQueryParam, fixBaseUrl } from '../../utils/url';
import redirect from '../../utils/redirect';

/**
 * PlaceKey Select component class.
 * @class PlaceKeySelect
 * @extends Component
 */
class PlaceKeySelect extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    location: PropTypes.object,
    userAttributes: PropTypes.object,
    userPlaceSession: PropTypes.object,
    serviceProvider: PropTypes.object,
    getUserAttributes: PropTypes.func.isRequired,
    getUserPlaceSession: PropTypes.func.isRequired,
    getServiceProvider: PropTypes.func.isRequired,
    config: PropTypes.object,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties object
   * @constructs PlaceKeys
   */
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      autoSelect: null,
      placeToken: null,
    };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getUserAttributes();
    this.props.getUserPlaceSession('places');
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) { // eslint-disable-line max-statements
    const { userPlaceSession, userAttributes } = nextProps;
    const { placeId: autoSelectPlaceId } = nextProps.location.query;
    const attributeList = get(nextProps, 'userAttributes.list');

    if (autoSelectPlaceId && !this.state.autoSelect && userAttributes.status === SUCCESS &&
      attributeList.find(att => att.data && att.data.placeId === autoSelectPlaceId)) {
      // auto select placeId from querystring (optionally)
      this.setState({ autoSelect: true }, // only submit once
        this.handleSubmit({ placekey: autoSelectPlaceId }));
    }

    if (userPlaceSession.status === SUCCESS) {
      this.handleUserPlaceSession(nextProps);
    }
  }

  /**
   * Get placeKeys method.
   * @method getPlaceKeys
   * @returns {array} placeKey array
   */
  getPlaceKeys() {
    return (this.props.userAttributes.status === SUCCESS && this.props.userAttributes.list ?
      this.props.userAttributes.list : [])
      .filter(attribute => attribute.data && attribute.data.type === 'place_key')
      .map(placeKey => ({
        id: placeKey.id,
        label: placeKey.label,
        placeId: placeKey.data.placeId,
      }));
  }

  /**
   * Handle UserPlaceSession method.
   * @method handleUserPlaceSession
   * @param {Object} nextProps Props
   * @returns {undefined}
   */
  handleUserPlaceSession(nextProps) {
    const { userPlaceSession, userAttributes } = nextProps;
    const { placeId, token } = userPlaceSession;
    const { tippiqPlacesBaseUrl } = nextProps.config;
    const {
      redirect_uri: redirectUri = fixBaseUrl(tippiqPlacesBaseUrl),
      clientId,
    } = nextProps.location.query;
    const attributeList = get(nextProps, 'userAttributes.list');
    let placeToken = null;

    if (!isEqual(this.props.userPlaceSession, userPlaceSession)) {
      if (placeId) {
        // return with token for selected place
        redirect(setQueryParams(decodeURIComponent(redirectUri), { token }), clientId);
      } else {
        // store token for addPlaceButton
        placeToken = token;
        this.setState({ placeToken });
      }
    }

    if (userAttributes.status === SUCCESS
      && attributeList.filter(att => att.data && att.data.type === 'place_key').length === 0) {
      // user has no places, redirect to add place page
      window.location.href = this.createAddPlaceUrl(placeToken);
    }
  }

  /**
   * Create add place url
   * @method createAddPlaceUrl
   * @param {string} placeToken placeToken
   * @returns {string} Add place url
   */
  createAddPlaceUrl(placeToken) {
    const { frontendBaseUrl, tippiqPlacesBaseUrl } = this.props.config;
    const { redirect_uri: redirectUri, clientId } = this.props.location.query;
    let returnRoute = '/selecteer-je-huis';
    if (clientId) {
      returnRoute = setQueryParam(returnRoute, 'clientId', clientId);
    }

    if (redirectUri) {
      returnRoute = setQueryParam(returnRoute, 'redirect_uri', redirectUri);
    }

    const returnUrl = `${frontendBaseUrl}/huissleutel-opslaan?return_route=${returnRoute}`;
    return `${tippiqPlacesBaseUrl}/nieuw-huis?token=${placeToken ||
      this.state.placeToken}&clientid=${clientId}&return_url=${encodeURIComponent(returnUrl)}`;
  }

  /**
   * Select placeKey method.
   * @method selectPlaceKey
   * @param {Object} data Form data
   * @returns {undefined}
   */
  handleSubmit(data) {
    const audience = get(this.props, 'location.query.clientId') || 'places';
    this.props.getUserPlaceSession(audience, data.placekey);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { userAttributes, serviceProvider } = this.props;
    const placeKeys = this.getPlaceKeys();

    return (
      <div id="page-place-key-select">
        <Helmet title="Selecteer je huis" />
        <Grid>
          <Row>
            <Col xs={12}>
              <PageTitle>Welk Tippiq Huis wil je gebruiken?</PageTitle>
            </Col>
          </Row>
          { serviceProvider.status === SUCCESS &&
            <Row>
              <Col xs={12} id="service-provider-info">
                <p>Wil je inloggen bij {serviceProvider.name} met je Tippiq Account?</p>
              </Col>
            </Row>
          }
          { placeKeys && placeKeys.length === 0 &&
            <Row>
              <Col xs={12}>
                <Button href={this.createAddPlaceUrl()}>Voeg huis toe</Button>
              </Col>
            </Row>
          }
          { userAttributes.status === SUCCESS &&
            <Row>
              <Col xs={12}>
                <PlaceKeyForm
                  placeKeys={placeKeys}
                  onSubmit={this.handleSubmit}
                />
              </Col>
            </Row>
          }
        </Grid>
      </div>
    );
  }
}

export default compose(asyncConnect(
  [{
    key: 'serviceProvider',
    promise: ({ store: { dispatch }, location: { query } }) => (query.clientId ?
      dispatch(getServiceProvider(query.clientId)) : Promise.resolve()),
  }]),
  connect(
    state => ({
      userAttributes: state.userAttributes,
      userPlaceSession: state.userPlaceSession,
      serviceProvider: state.serviceProvider,
      config: state.appConfig,
    }),
    dispatch => bindActionCreators({
      getUserAttributes,
      getUserPlaceSession,
      getServiceProvider,
    }, dispatch)
  )
)(PlaceKeySelect);
