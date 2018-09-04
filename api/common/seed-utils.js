/**
 * Utility functions for seeding
 * @module common/seed-utils
 */
import BPromise from 'bluebird';
import fs from 'fs-promise';
import testOauth2Client from '../testdata/oauth2-client';
import testOauth2RedirectUris from '../testdata/oauth2_redirect_uri';
import fake3pServiceProvider from '../testdata/fake3p-service-provider';
import testUsers from '../testdata/users';
import testUserRoles from '../testdata/user-roles';
import testUserAttributes from '../testdata/attributes';
import {
  OAuth2ClientRepository,
  OAuth2RedirectUriRepository,
} from '../modules/oauth2/repositories';
import { ServiceProviderRepository } from '../modules/service-provider/repositories';
import { UserRepository, UserRoleRepository } from '../modules/users/repositories';
import { AttributeRepository } from '../modules/attributes/repositories';

/**
 * Insert test oauth2 client.
 * @function insertTestClient
 * @returns {undefined}
 */
export function insertTestClient() {
  return OAuth2ClientRepository.create(testOauth2Client, { method: 'insert' });
}

/**
 * Remove test oauth2 client.
 * @function removeTestClient
 * @returns {undefined}
 */
export function removeTestClient() {
  return OAuth2ClientRepository.deleteById(testOauth2Client.id);
}

/**
 * Insert test users.
 * @function insertTestUsers
 * @returns {undefined}
 */
export function insertTestUsers() {
  return BPromise.all(testUsers.map(user => UserRepository.create(user, { method: 'insert' })));
}

/**
 * Remove test users.
 * @function removeTestUsers
 * @returns {undefined}
 */
export function removeTestUsers() {
  return BPromise.all(testUsers.map(user => UserRepository.deleteById(user.id)));
}

/**
 * Insert test user roles.
 * @function insertTestUserRoles
 * @returns {undefined}
 */
export function insertTestUserRoles() {
  return BPromise.all(
    testUserRoles.map(userRole => UserRoleRepository.create(userRole, { method: 'insert' }))
  );
}

/**
 * Remove test user roles.
 * @function removeTestUserRoles
 * @returns {undefined}
 */
export function removeTestUserRoles() {
  return BPromise.all(testUserRoles.map(userRole => UserRoleRepository.deleteById(userRole.id)));
}

/**
 * Insert user attributes.
 * @function insertTestUserAttributes
 * @returns {undefined}
 */
export function insertTestUserAttributes() {
  return BPromise.all(testUserAttributes.map(attribute =>
    AttributeRepository.create(attribute, { method: 'insert' })));
}

/**
 * Remove user attributes.
 * @function removeTestUserAttributes
 * @returns {undefined}
 */
export function removeTestUserAttributes() {
  return BPromise.all(testUserAttributes.map(attribute =>
    AttributeRepository.deleteById(attribute.id)));
}


/**
 * Insert fake3p service provider.
 * @function insertFake3pServiceProvider
 * @returns {undefined}
 */
export function insertFake3pServiceProvider() {
  return fs.readFile('api/testdata/fake3p-logo.png')
    .then(imgData =>
      ServiceProviderRepository.create({
        ...fake3pServiceProvider,
        logo: imgData,
      }, { method: 'insert' })
    );
}

/**
 * Remove test oauth2 authorization code.
 * @function removeFake3pServiceProvider
 * @returns {undefined}
 */
export function removeFake3pServiceProvider() {
  return ServiceProviderRepository.deleteById(fake3pServiceProvider.id);
}

/**
 * Insert test oauth2 redirect uri's.
 * @function insertOAuthRedirectUris
 * @returns {undefined}
 */
export function insertOAuthRedirectUris() {
  return OAuth2RedirectUriRepository.create(testOauth2RedirectUris, { method: 'insert' });
}

/**
 * Remove test oauth2 redirect uri's.
 * @function removeOAuthRedirectUris
 * @returns {undefined}
 */
export function removeOAuthRedirectUris() {
  return OAuth2RedirectUriRepository.deleteById(testOauth2RedirectUris.id);
}

/**
 * Insert test data.
 * @function insertTestData
 * @returns {undefined}
 */
export function insertTestData() {
  return BPromise.all([
    insertTestClient(),
    insertFake3pServiceProvider(),
    insertTestUsers(),
  ])
    .then(() => BPromise.all([
      insertTestUserRoles(),
      insertTestUserAttributes(),
      insertOAuthRedirectUris(),
    ]));
}

/**
 * Remove test data
 * @function removeTestData
 * @returns {undefined}
 */
export function removeTestData() {
  return BPromise.all([
    removeTestUserRoles(),
    removeTestUserAttributes(),
    removeOAuthRedirectUris(),
  ])
    .then(() => BPromise.all([
      removeTestClient(),
      removeFake3pServiceProvider(),
      removeTestUsers(),
    ]));
}
