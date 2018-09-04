/**
 * Garble email address.
 * @function garbleEmailAddress
 * @param {string} emailAddress The email address to garble
 * @returns {string} The garbled email address
 */
export function garbleEmailAddress(emailAddress) {
  const username = emailAddress.split('@')[0];
  const domain = emailAddress.split('@')[1].split('.')[0];

  const tld = emailAddress
    .substring(emailAddress.lastIndexOf('.') + 1);

  return `${username[0]}*****${username.slice(-1)}` +
    `@${domain[0]}***${domain.slice(-1)}` +
    `.${tld}`;
}
