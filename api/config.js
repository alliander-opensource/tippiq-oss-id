/**
 * Proxy module for frontend config.
 * @module config
 */
import _ from 'lodash';

import srcConfig from '../src/client-config';

const config = _.defaults(
  {
    databaseUrl: process.env.TIPPIQ_ID_DATABASE_URL,
    frontendBaseUrl: process.env.FRONTEND_BASE_URL,
    jwtIssuer: process.env.JWT_ISSUER,
    jwtIssuerTippiq: process.env.JWT_ISSUER_TIPPIQ,
    jwtIssuerPlaces: process.env.JWT_ISSUER_PLACES,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
    tippiqServicePublicKey: process.env.TIPPIQ_SERVICE_PUBLIC_KEY,
    tippiqPlacesServicePublicKey: process.env.TIPPIQ_PLACES_PUBLIC_KEY,
    jwtAudience: process.env.JWT_AUDIENCE,
    jwtAudienceTippiq: process.env.JWT_AUDIENCE_TIPPIQ,
    jwtAudiencePolicies: process.env.JWT_AUDIENCE_POLICIES,
    jwtAudiencePlaces: process.env.JWT_AUDIENCE_PLACES,
    landingBaseUrl: process.env.LANDING_BASE_URL,
    localSmtpHost: process.env.LOCAL_SMTP_HOST,
    localSmtpPort: process.env.LOCAL_SMTP_PORT,
    mailTransporter: process.env.MAIL_TRANSPORTER,
    sesAccessKeyId: process.env.SES_ACCESS_KEY_ID,
    sesAccessKeySecret: process.env.SES_ACCESS_KEY_SECRET,
    sesRegion: process.env.SES_REGION,
    rateLimitMaxAttempts: process.env.RATE_LIMIT_MAX_ATTEMPTS,
    rateLimitTimeDifference: process.env.RATE_LIMIT_TIME_DIFFERENCE,
    tippiqBaseUrl: process.env.TIPPIQ_BASE_URL,
    tippiqHoodBaseUrl: process.env.TIPPIQ_HOOD_BASE_URL,
    tippiqPlacesBaseUrl: process.env.TIPPIQ_PLACES_BASE_URL,
    privacyUrl: process.env.PRIVACY_URL,
    irmaEnabled: process.env.IRMA_ENABLED,
    irmaApiServerHost: process.env.IRMA_API_SERVER_HOST,
    irmaApiServerPort: process.env.IRMA_API_SERVER_PORT,
    irmaApiServerPublicKey: process.env.IRMA_API_SERVER_PUBLIC_KEY,
    tippiqIdIrmaName: process.env.TIPPIQ_ID_IRMA_NAME,
    tippiqIdIrmaPrivateKey: process.env.TIPPIQ_ID_IRMA_PRIVATE_KEY,
    tippiqIdIrmaPublicKey: process.env.TIPPIQ_ID_IRMA_PUBLIC_KEY,
    sendMailSynchronousDefault: process.env.SEND_MAIL_SYNCHRONOUS_DEFAULT,
    queuedEmailBatchSize: process.env.QUEUED_EMAIL_BATCH_SIZE,
    queuedEmailMaxRetries: process.env.QUEUED_EMAIL_MAX_RETRIES,
    queuedEmailBatchId: process.env.QUEUED_EMAIL_BATCH_ID,
  },
  {
    databaseUrl: 'postgresql://tippiq_id:tippiq_id@localhost:5432/tippiq_id?ssl=false',
    emailFromAddress: 'Tippiq Account <noreply@tippiq.nl>',
    emailFromPlacesAddress: 'Tippiq Huis <noreply@tippiq.nl>',
    frontendBaseUrl: 'http://localhost:3001',
    publicKey: `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEIwr0ttbt6S6lj3e8nuP3KN/clEw1RICw
k5d2Yy4hgKn7e6kBjeORFNnQDNj5GIGNmK0zb3SzW17JNzf22ooavQ==
-----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIJr08Kf8I7x/CPF87tLAbs3LpyYXk5IU0Np18+8nxK8FoAcGBSuBBAAK
oUQDQgAEIwr0ttbt6S6lj3e8nuP3KN/clEw1RICwk5d2Yy4hgKn7e6kBjeORFNnQ
DNj5GIGNmK0zb3SzW17JNzf22ooavQ==
-----END EC PRIVATE KEY-----`,
    tippiqServicePublicKey: `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAERaacYfJo5nsgQ/0MkCYtcKzxhyoQyWY4
Fe/ecUSRNunOI+CID2zeZ5/oClp7c+C4eUmroYfwEgfCDb6SBRoPqQ==
-----END PUBLIC KEY-----`,
    tippiqPlacesServicePublicKey: `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAENqWoqfszSKmYzr7PFSDDMcx0sUfefHav
Wpzryi4kN15rvz5V81a0mCIgxTJMWldn7gyb1IaDlD0wV6MJ79lTvA==
-----END PUBLIC KEY-----`,
    jwtIssuer: 'tippiq-id.local',
    jwtIssuerTippiq: 'tippiq.local',
    jwtIssuerPlaces: 'tippiq-places.local',
    jwtAudience: 'tippiq-id.local',
    jwtAudiencePolicies: 'tippiq-policies.local',
    jwtAudiencePlaces: 'tippiq-places.local',
    jwtAudienceTippiq: 'tippiq.local',
    landingBaseUrl: 'http://localhost:3001/login',
    localSmtpHost: 'localhost',
    localSmtpPort: 1025,
    mailTransporter: 'local-smtp',
    rateLimitMaxAttempts: 5,
    rateLimitTimeDifference: 20,
    tippiqBaseUrl: 'http://localhost:3000',
    tippiqHoodBaseUrl: 'http://localhost:3007',
    tippiqPlacesBaseUrl: 'http://localhost:3010',
    privacyUrl: 'https://www.tippiq.nl/privacy',
    irmaEnabled: true,
    irmaApiServerHost: 'localhost',
    irmaApiServerPort: 8888,
    irmaApiServerPublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8YzQy7677m7tISe2fH2r
9k8x0Gm4/pTdoCBCyAxPMbgcsWOeAX8yRKRhMP9y2Bajt5jxa05Sl7IRwmPjXU1j
4unJovJ96eXxo9DAAY5V4SSG0VWC4rhW1vwDa0fEH+xKeVACwTJ4XEYNFwPob41G
3nB8lbJVg1zOnvqvxqu58ALkTIovLiZa2/MizhtVAuRyiyhufBuCxPKwye9XeRXJ
UPObyvSh6LVtzMYqwgIU82bTqTKqUtT1SK6eaYjLYAEw+/NN8JMSgvHxxfS9waZG
RyHzebQV7uhCwd+MlgYmG7L6mLBdzYVCubS8vFgCCTu4dpinMa+4UCs+k1MVvGYv
hwIDAQAB
-----END PUBLIC KEY-----
    `,
    tippiqIdIrmaName: 'Tippiq',
    tippiqIdIrmaPrivateKey: null,
    tippiqIdIrmaPublicKey: null,
    sendMailSynchronousDefault: true,
    queuedEmailBatchSize: 100,
    queuedEmailMaxRetries: 5,
    queuedEmailBatchId: undefined,
  },
  srcConfig
);

export default config;
