import { app, expect, request } from '../../../common/test-utils';
import config from '../../../config';

describe('Get app-config', () => {
  it('should exist', () =>
    request(app)
      .get('/app-config')
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.property('tippiqPlacesBaseUrl', config.tippiqPlacesBaseUrl);
        expect(res.body).to.have.property('frontendBaseUrl', config.frontendBaseUrl);
        expect(res.body).to.have.property('privacyUrl', config.privacyUrl);
        expect(res.body).to.have.property('landingBaseUrl', config.landingBaseUrl);
        expect(res.body).to.have.property('irmaEnabled', config.irmaEnabled);
      })
  );
});

