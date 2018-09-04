import { setQueryParams } from './url';
/**
 * Use the backend to redirect the browser to redirectUri after it validates that clientId is
 * allowed to make that request.
 * @param {string} uri ask the backed to redirect to, it will be encoded before passing on
 * @param {string} [clientId] to check redirectUri for
 */
export default function redirect(uri, clientId = null) {
  if (uri) {
    // const uri = encodeURIComponent(redirectUri);
    window.location.href = setQueryParams('/api/redirect/', { uri, clientId });
  }
}

