/**
 * ChangeUserName container.
 * @module components/ChangeUserName
 */
import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';

import { PageTitle, ChangeUserNameForm } from '../../components';
import {
  getUserAttributes,
  resetUserAttribute,
  createUserAttribute,
  saveUserAttribute,
  getUserDisplayName,
} from '../../actions';
import { SUCCESS, FAIL } from '../../constants/status';
import { getFirstOfType } from '../../helpers';
import { USER_NAME_ATTRIBUTE_TYPE } from '../../constants/AttributeTypes';

/**
 * Change username container class.
 * @class ChangeUserName
 * @extends Component
 */
export class ChangeUserName extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getUserAttributes: PropTypes.func.isRequired,
    resetUserAttribute: PropTypes.func.isRequired,
    createUserAttribute: PropTypes.func.isRequired,
    saveUserAttribute: PropTypes.func.isRequired,
    getUserDisplayName: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    userAttributes: PropTypes.object.isRequired,
    userNameAttribute: PropTypes.object.isRequired,
  };

  state = {
    userName: null,
    userNameSaved: false,
  };

  /**
   * On component did mount
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (!this.state.userName) {
      this.props.resetUserAttribute();
      this.props.getUserAttributes();
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.userAttributes.status === SUCCESS &&
      this.props.userAttributes.status !== SUCCESS) {
      const attribute = getFirstOfType(nextProps.userAttributes.list, USER_NAME_ATTRIBUTE_TYPE);
      const userName = attribute && attribute.data ? attribute.data.name : '';
      this.setState({ userName });
    }
    if (nextProps.userNameAttribute.status === SUCCESS && !this.state.userNameSaved) {
      this.setState({ userNameSaved: true });
      this.props.getUserAttributes();
      // trigger Header to update display name:
      this.props.getUserDisplayName(nextProps.login.id);
    }
  }

  /**
   * Get first attribute from list by type
   * @method getAttribute
   * @param {Array} attributes List of attributes
   * * @param {Array} type Attribute type
   * @returns {Object} attribute
   */
  getAttribute(attributes, type) {
    return attributes.length > 0 ?
      attributes.filter(attribute => attribute.data && attribute.data.type === type)[0] : null;
  }

  /**
   * Handler for submit action.
   * @method handleSubmit
   * @param {Object} data Form data.
   * @returns {undefined}
   */
  handleSubmit = (data) => {
    const { userAttributes } = this.props;
    const nameAttribute = this.getAttribute(userAttributes.list, USER_NAME_ATTRIBUTE_TYPE);

    if (nameAttribute) {
      nameAttribute.data.name = data.userName;
      this.setState({ userNameSaved: false }, () => this.props.saveUserAttribute(nameAttribute));
    } else {
      this.setState({ userNameSaved: false }, () => this.props.createUserAttribute({
        data: {
          type: USER_NAME_ATTRIBUTE_TYPE,
          name: data.userName,
        },
        userId: this.props.login.id,
        label: 'Mijn naam',
      }));
    }
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { userNameAttribute } = this.props;
    const { userName, userNameSaved } = this.state;

    const errorMessage = userNameAttribute.status === FAIL ? userNameAttribute.error.message : '';

    return (
      <div id="page-change-username">
        <Helmet title="Mijn Account | Naam wijzigen" />
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <PageTitle>Naam wijzigen</PageTitle>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <p>Je kunt hier je naam invullen zodat we je netjes aan kunnen spreken.</p>
              <br />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              { userName !== null &&
                <ChangeUserNameForm
                  initialValues={{ userName }}
                  onSubmit={this.handleSubmit}
                  errorMessage={errorMessage}
                />
              }
            </Col>
          </Row>
          { userNameSaved &&
            <Row>
              <Col xs={12}>
                <span id="successMessage" className="text-primary">
                  Gelukt! Je naam is opgeslagen.
                </span>
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
    userNameAttribute: state.userAttribute,
    login: state.login,
  }),
  ({
    getUserAttributes,
    resetUserAttribute,
    createUserAttribute,
    saveUserAttribute,
    getUserDisplayName,
  })
)(ChangeUserName);
