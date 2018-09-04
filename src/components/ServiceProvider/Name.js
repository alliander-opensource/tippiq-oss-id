/**
 * ServiceProvider Name component.
 * @module components/ServiceProvider/Name
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getServiceProvider } from '../../actions';
import { SUCCESS } from '../../constants/status';

@connect(
  state => ({
    serviceProvider: state.serviceProvider,
  }),
  dispatch => bindActionCreators({ getServiceProvider }, dispatch),
)

/**
 * Name component class.
 * @function Name
 * @param {Object} props Component properties.
 * @returns {string} Markup of the not found page.
 */
export default class Name extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getServiceProvider: PropTypes.func.isRequired,
    serviceProviderId: PropTypes.string,
    serviceProvider: PropTypes.object,
  }

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    const { serviceProviderId, serviceProvider } = this.props;
    if (serviceProviderId && serviceProviderId !== serviceProvider.id) {
      this.props.getServiceProvider(serviceProviderId);
    }
  }

  /**
   * Should component update
   * @method shouldComponentUpdate
   * @param {Object} nextProps Next properties
   * @returns {Boolean} flag whether to re-render this component or not
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.serviceProvider !== this.props.serviceProvider;
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { serviceProvider } = this.props;
    return serviceProvider.status === SUCCESS ?
      <span className="service-provider-name">{serviceProvider.name}</span> : null;
  }
}
