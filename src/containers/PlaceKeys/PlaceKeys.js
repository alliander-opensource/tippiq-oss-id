/**
 * PlaceKeys container.
 * @module components/PlaceKeys
 */

import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEqual, sortBy } from 'lodash';

import { SUCCESS } from '../../constants/status';
import { getUserAttributes, getUserPlaceSession } from '../../actions';
import styles from './PlaceKeys.css';

/**
 * PlaceKeys component class.
 * @class PlaceKeys
 * @extends Component
 */
export class PlaceKeys extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    userAttributes: PropTypes.object,
    userPlaceSession: PropTypes.object,
    config: PropTypes.object,
    getUserAttributes: PropTypes.func.isRequired,
    getUserPlaceSession: PropTypes.func.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties object
   * @constructs PlaceKeys
   */
  constructor(props) {
    super(props);
    this.gotoPlace = this.gotoPlace.bind(this);
    this.state = {
      placeToken: null,
    };
  }

  /**
   * On component did mount
   * @function componentDidMount
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
  componentWillReceiveProps(nextProps) {
    const { userPlaceSession } = nextProps;
    const { placeId, token, status } = userPlaceSession;
    const { tippiqPlacesBaseUrl } = this.props.config;

    if (status === SUCCESS && !isEqual(this.props.userPlaceSession, userPlaceSession)) {
      if (placeId) {
        // place selected
        window.location.href = `${tippiqPlacesBaseUrl}/huis/${placeId}/mijn-huis?token=${token}`;
      } else {
        // store token for addPlaceButton
        this.setState({ placeToken: token });
      }
    }
  }

  /**
   * Create add place url
   * @method createAddPlaceUrl
   * @returns {string} Add place url
   */
  createAddPlaceUrl() {
    const { frontendBaseUrl, tippiqPlacesBaseUrl } = this.props.config;
    const returnUrl = `${frontendBaseUrl}/huissleutel-opslaan?return_route=/mijn-huissleutels`;
    return `${tippiqPlacesBaseUrl}/nieuw-huis?token=${this.state.placeToken}&return_url=${
      encodeURIComponent(returnUrl)}`;
  }

  /**
   * Go to place method.
   * @method gotoPlace
   * @param {string} placeId Place Id
   * @returns {undefined}
   */
  gotoPlace(placeId) {
    this.props.getUserPlaceSession('places', placeId);
  }

  /**
   * render placeKeys method.
   * @method renderPlaceKeys
   * @returns {string} Markup for the component.
   */
  renderPlaceKeys(placeKeys) {
    return placeKeys ? (
      <div className="list-group" id="list-place-keys">
        {placeKeys.map(placeKey =>
          <div className="list-group-item" key={placeKey.id}>
            <Button
              onClick={() => this.gotoPlace(placeKey.data.placeId)}
              className="btn btn-link"
            >{placeKey.label}
            </Button>
            <Button
              onClick={() => this.gotoPlace(placeKey.data.placeId)}
              className={`btn btn-primary ${styles.goToButton}`}
            >Ga naar {placeKey.label}
            </Button>
          </div>)
        }
      </div>
    ) : <div>Je hebt nog geen huissleutels</div>;
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { status, list } = this.props.userAttributes;
    const placeKeys = list ?
      sortBy(list.filter(attribute => attribute.data && attribute.data.type === 'place_key'), ['label']) : null;

    return (
      <div id="page-place-keys">
        <Helmet title="Mijn huissleutels" />
        <Grid>
          <Row>
            <Col xs={12}>
              <h1>Gekoppelde huizen</h1>
            </Col>
          </Row>
          {placeKeys && placeKeys.length === 0 &&
            <Row>
              <Col xs={12}>
                <Button href={this.createAddPlaceUrl()}>Voeg huis toe</Button>
                <hr />
              </Col>
            </Row>
          }
          {status === SUCCESS &&
            <Row>
              <Col xs={12}>
                {this.renderPlaceKeys(placeKeys)}
              </Col>
            </Row>
          }
          {placeKeys && placeKeys.length > 0 &&
            <Row>
              <Col xs={12}>
                In de toekomst wordt het mogelijk hier meerdere huizen toe te voegen waar je een
                relatie mee hebt, zoals bijvoorbeeld het huis waar je ouders verzorgd worden.
              </Col>
            </Row>
          }
        </Grid>
      </div>);
  }
}

export default connect(
  state => ({
    userAttributes: state.userAttributes,
    userPlaceSession: state.userPlaceSession,
    config: state.appConfig,
  }),
  dispatch => bindActionCreators({
    getUserAttributes,
    getUserPlaceSession,
  }, dispatch),
)(PlaceKeys);
