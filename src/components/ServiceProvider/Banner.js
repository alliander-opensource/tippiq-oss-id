/**
 * ServiceProvider Banner component.
 * @module components/ServiceProvider/Banner
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getServiceProvider } from '../../actions';
import { SUCCESS } from '../../constants/status';

import styles from './Banner.scss';

@connect(
  state => ({
    serviceProvider: state.serviceProvider,
  }),
  dispatch => bindActionCreators({ getServiceProvider }, dispatch),
)

/**
 * Banner component class.
 * @function Banner
 * @param {Object} props Component properties.
 * @returns {string} Markup of the not found page.
 */
export default class Banner extends Component {

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
    const style = { backgroundColor: `#${serviceProvider.brandColor}` };

    return serviceProvider.status === SUCCESS ? (
      <div className={`container-fluid ${styles.container}`} style={style}>
        <div className="row">
          <div className="col-xs-12">
            <div className="container">
              <div className="row">
                <div className="col-xs-12">
                  <span className={`text ${styles.text}`}>Huisregels instellen voor</span>
                  <img
                    className={`logo ${styles.logo}`}
                    src={`data:image/png;base64,${serviceProvider.logo}`}
                    alt="logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>) : null;
  }
}
