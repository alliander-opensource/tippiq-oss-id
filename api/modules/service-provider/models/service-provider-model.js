/**
 * ServiceProvider Model.
 * @module modules/service-provider/models/service-provider-model
 */

import _ from 'lodash';
import debugLogger from 'debugnyan';

import BaseModel from '../../../common/base-model';

const debug = debugLogger('tippiq-id:service-provider:model');

const instanceProps = {
  tableName: 'service_provider',
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'service-provider-resources':
        return _.chain(BaseModel.prototype.serialize.apply(this, [mergedOptions]))
          .pick([
            'id',
            'name',
            'brandColor',
            'logo',
          ])
          .transform((that, value, key) =>
            _.set(that, key, key === 'logo' && value ? value.toString('base64') : value))
          .value();
      default:
        debug.debug('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
