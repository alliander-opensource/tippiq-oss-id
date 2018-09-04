/**
 * Test for email/send-email
 * @module email/send-email.spec
 */
import { expect } from '../../common/test-utils';

import sendEmail from './send-email';

const email = {
  from: 'a@from.a',
  to: ['b@to.b'],
  subject: 'Subject',
  text: 'bodyTEXT',
  html: 'BodyHTML',
};

describe('sendMail', () => {
  it('should send an email synchronously', () =>
    expect(sendEmail(email, true)).to.eventually.have.property('accepted').to.become(email.to));
});
