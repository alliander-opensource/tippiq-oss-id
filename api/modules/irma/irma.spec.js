import jwt from 'jsonwebtoken';
import config from '../../config';

import { expect } from '../../common/test-utils';
import { AuthenticationError } from '../../common/errors';
import {
  generateAttributeDisclosureRequest,
  generateCredentialIssueRequest,
  generateIrmaCredential,
  requestVerificationSessionToken,
  requestIssueSessionToken,
  verifyAttributeDisclosureResponse,
} from './irma';
import { irmaApiMockServer, qrVerifyJson, qrIssueJson } from '../../common/irma-api-mock-server';

describe('Irma', () => {
  describe('generateAttributeDisclosureRequest', () => {
    it('should be a function', () =>
      expect(generateAttributeDisclosureRequest).to.be.a('function'));

    it('should return an IRMA login disclosure request in a jwt token', () => {
      const name = 'tippiq_login_request';
      const attributes = [
        { label: 'Inloggen bij Tippiq e-mail',
          attributes: [
            'tippiq.Tippiq.user.e-mail',
          ],
        },
        { label: 'Inloggen bij Tippiq id',
          attributes: [
            'tippiq.Tippiq.user.id',
          ],
        },
      ];
      return generateAttributeDisclosureRequest(name, attributes)
        .then(sprequestJwt => jwt.verify(sprequestJwt, config.tippiqIdIrmaPublicKey).sprequest)
        .then(sprequest => expect(sprequest).to.deep.equal({
          data: name,
          validity: 60,
          timeout: 600,
          callbackUrl: `${config.frontendBaseUrl}/api/irma/complete-login-request`,
          request: {
            content: attributes,
          },
        }
        ));
    });
  });

  describe('generateCredentialIssueRequest', () => {
    it('should be a function', () =>
      expect(generateCredentialIssueRequest).to.be.a('function'));

    it('should return an IRMA credential issue request in a jwt token', () => {
      const name = 'tippiqid_issue_request';
      const callbackEndpoint = 'not_relevant';
      const credentials = { name: 'value', name2: 'value2' };

      return generateCredentialIssueRequest(name, callbackEndpoint, credentials)
        .then(iprequestJwt => jwt.verify(iprequestJwt, config.tippiqIdIrmaPublicKey).iprequest)
        .then(iprequest => expect(iprequest).to.deep.equal({
          data: name,
          validity: 60,
          timeout: 600,
          callbackUrl: `${config.frontendBaseUrl}/${callbackEndpoint}`,
          request: {
            credentials,
          },
        }));
    });
  });

  describe('requestSessionToken', () => {
    before('set irma api server host and port', () => {
      irmaApiMockServer.start();
    });

    after('stop irma api server mock', () =>
      irmaApiMockServer.stop()
    );

    describe('requestVerificationSessionToken', () => {
      it('should be a function', () =>
        expect(requestVerificationSessionToken).to.be.a('function'));

      it('should return an IRMA verification session for qr', () =>
        requestVerificationSessionToken('data')
          .then(qr => expect(qr).to.deep.equal(qrVerifyJson))
      );
    });

    describe('requestIssueSessionToken', () => {
      it('should be a function', () =>
        expect(requestIssueSessionToken).to.be.a('function'));

      it('should return an IRMA irma session for qr', () =>
        requestIssueSessionToken('data')
          .then(qr => expect(qr).to.deep.equal(qrIssueJson))
      );
    });
  });

  describe('verifyAttributeDisclosureResponse', () => {
    it('should be a function', () => expect(verifyAttributeDisclosureResponse).to.be.a('function'));

    it('should throw an error if the jwt has an invalid status field', () => {
      const invalidStatusJwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkaX' +
             'NjbG9zdXJlX3Jlc3VsdCIsImF0dHJpYnV0ZXMiOnsidGlwcGlxLlRpcHBpcS50a' +
             'XBwaXFJZC5lLW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidGlwcGlxLlRpcHBp' +
             'cS50aXBwaXFJZC51dWlkIjoiMzFjZDA3M2EtZmVmMy00ZWU1LWIxYzMtZmUxMTQ' +
             'yZGY3OTA4In0sImV4cCI6MjQyMjQwNDA1NywiaWF0IjoxNDc3NDA0MDU3LCJqdG' +
             'kiOiJUaXBwaXEiLCJzdGF0dXMiOiJJTlZBTElEIn0.xE7zAyc1dUzDbgtFCahBR' +
             'znn9TvzbG6pwKHD7j9g7dqh-mT4ZKnsj34r947QO5x7lPLZmhhT8Xllvp4T8Gop' +
             'k82xp5RjFXrINm8ZKA3-IPgmagBB7hwiHFilx7xSCGbpodBbSqcxmLimKDaEcm2' +
             'uj9uRuhP4G4UHnJavHC3gyQ2b1lq02VyYUpF2Sj-lBslkBIl3209csp-be6yMe8' +
             'S8myDgC1heINcYz1M1YlDPhd_GEvZATACfP_kgmdH-SS4KFBv7TDVYlWbw6ZdW5' +
             '-iYDN2-tnCjB5btakqK-twwavtLojL2LeyZ_HOoazGjStTMrQZj2TgS-LCLSlIe' +
             'FGz_Ew';
      expect(verifyAttributeDisclosureResponse(invalidStatusJwt))
        .to.be.rejectedWith(AuthenticationError);
    });

    it('should return IRMA attributes if the jwt is valid', (done) => {
      const validJwt = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkaXNjbG9zdXJlX3Jlc3VsdCIsImF0dH' +
             'JpYnV0ZXMiOnsidGlwcGlxLlRpcHBpcS50aXBwaXFJZC5lLW1haWwiOiJ0ZXN0Q' +
             'GV4YW1wbGUuY29tIiwidGlwcGlxLlRpcHBpcS50aXBwaXFJZC51dWlkIjoiMzFj' +
             'ZDA3M2EtZmVmMy00ZWU1LWIxYzMtZmUxMTQyZGY3OTA4In0sImV4cCI6MjQyMjQ' +
             'wNDA1NywiaWF0IjoxNDc3NDA0MDU3LCJqdGkiOiJUaXBwaXEiLCJzdGF0dXMiOi' +
             'JWQUxJRCJ9.Ypz2z1V08HktT_j2dnYqU5t0YGVqgoEEYbvvE0ZdvUj3ZLoiAYpO' +
             'GwWiL8qVMXi5kIfc5Zpy4XTpD3vdW4rBwOZw90CGMngCEVd9H5Tx91Xvu_Uq2Hf' +
             'hEP_c-TzS5ZHq6zYZHCEQSSkJfpqIMyM4NzQmmkyX158-DFLMbGxvsn_wWU5jDZ' +
             'wT9jQ5ItmNb7BAQ0keOdZSI66tppXBTzrfmNL1b_Dlp-ReWRcDqf0YGS6FBFYIa' +
             'eYsQuDYdEOY-Fgg6QKTUD6VPvLlownF_52h0f_03kUPLiaVR9a1XyDdvM11kjMb' +
             'th5_SDKm9XCAWAmBEkRbdR_L_fPd6XORYVJYpQ';

      verifyAttributeDisclosureResponse(validJwt)
        .then(attributes => {
          expect(attributes).to.deep.equal(
            { 'tippiq.Tippiq.tippiqId.e-mail': 'test@example.com',
              'tippiq.Tippiq.tippiqId.uuid': '31cd073a-fef3-4ee5-b1c3-fe1142df7908' }
          );
          done();
        });
    });
  });

  describe('generateIrmaCredential', () => {
    it('should be a function', () =>
      expect(generateIrmaCredential).to.be.a('function'));

    it('should return an IRMA credential with floored validity date', () => {
      const name = 'credential.name';
      const attributes = { attributeName: 'attribute value', attributeName2: 'attribute value' };
      const validity = new Date(1509663600000); // 2017-11-02T23:00:00.000Z
      return generateIrmaCredential(name, attributes, validity)
        .then(credential => expect(credential).to.deep.equal({
          credential: name,
          validity: 1509580800,
          attributes,
        }));
    });
  });
});
