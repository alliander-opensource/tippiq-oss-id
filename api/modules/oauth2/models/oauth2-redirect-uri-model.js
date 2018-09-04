/**
 * OAuth2RedirectUri model.
 * @module modules/oauth2/models/oauth2-redirect-uri
 */

import debugLogger from 'debugnyan';
import _ from 'lodash';

import BaseModel from '../../../common/base-model';

const debug = debugLogger('tippiq-places:oauth2:models:oauth2-redirect-uri');

const instanceProps = {
  tableName: 'oauth2_redirect_uri',
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'oauth2-redirect-uri':
        return _
          .chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick([
            'clientId',
            'redirectUri',
          ])
          .value();
      default:
        debug.debug('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
};

const classProps = {};

const OAuth2RedirectUri = BaseModel.extend(instanceProps, classProps);

export default OAuth2RedirectUri;
