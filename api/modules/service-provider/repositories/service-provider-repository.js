/**
 * ServiceProviderRepository.
 * @module modules/service-provider/repositories/service-provider-repository
 */
import autobind from 'autobind-decorator';
import { ServiceProvider } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for ServiceProvider.
 * @class ServiceProviderRepository
 * @extends BaseRepository
 */
export class ServiceProviderRepository extends BaseRepository {
  /**
   * Construct a ServiceProviderRepository for ServiceProvider.
   * @constructs ServiceProviderRepository
   */
  constructor() {
    super(ServiceProvider);
  }
}

export default new ServiceProviderRepository();
