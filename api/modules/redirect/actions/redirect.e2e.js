import { app, request } from '../../../common/test-utils';
import testOauth2RedirectUris from '../../../testdata/oauth2_redirect_uri';
import config from '../../../config';

const API_REDIRECT_URL = '/redirect';

describe('Redirect', () => {
  it('should return 302', () =>
    request(app)
      .get(API_REDIRECT_URL)
      .expect(302)
  );

  describe('for unknown/external', () => {
    it('should redirect to 404 page if unknown uri', () =>
      request(app)
        .get(`${API_REDIRECT_URL}?uri=http://haxorz.tippiq.nl`)
        .expect(302)
    );
  });

  describe('for known client', () => {
    it('should redirect with unknown return_uri to 404 page', () =>
      request(app)
        .get(`${API_REDIRECT_URL}?clientId=${testOauth2RedirectUris.client_id}&uri=http://haxorz.tippiq.nl`)
        .expect(302)
    );

    it('should redirect with whitelisted return_uri', () =>
      request(app)
        .get(`${API_REDIRECT_URL}?clientId=${testOauth2RedirectUris.client_id}&uri=${testOauth2RedirectUris.redirect_uri}`)
        .expect(302)
    );
  });

  describe('for local', () => {
    it('should redirect to relative uri', () =>
      request(app)
        .get(`${API_REDIRECT_URL}?uri=/stylesheet`)
        .expect(302)
    );

    it('should redirect to local uri', () =>
      request(app)
        .get(`${API_REDIRECT_URL}?uri=${config.frontendBaseUrl}/stylesheet`)
        .expect(302)
    );

    it('should redirect to places', () =>
      request(app)
        .get(`${API_REDIRECT_URL}?uri=${config.tippiqPlacesBaseUrl}`)
        .expect(302)
    );
  });
});
