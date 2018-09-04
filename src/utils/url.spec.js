import { getQueryParam, setQueryParam, fixBaseUrl } from './url';

describe('get query param', () => {
  it('should return the query parameter', () => {
    expect(getQueryParam('?foo=bar', 'foo')).toBe('bar');
  });

  it('should decode urls', () => {
    expect(getQueryParam('?foo=http%3A%2F%2Ftest.com', 'foo')).toBe('http://test.com');
  });

  it('should work with full urls', () => {
    expect(getQueryParam('http://test.com/?foo=http%3A%2F%2Ftest.com', 'foo')).toBe('http://test.com');
  });

  it('should return undefined when an unvalid param is requested', () => {
    expect(getQueryParam('?foo=bar', 'test')).toBeUndefined();
  });

  it('should return undefined when url has no params', () => {
    expect(getQueryParam('http://test.com', 'foo')).toBeUndefined();
  });
});

describe('set query param', () => {
  it('should set the query parameter', () => {
    expect(setQueryParam('?foo=bar', 'baz', 'qux')).toBe('?baz=qux&foo=bar');
  });

  it('should work with a full url', () => {
    expect(setQueryParam('http://test.com?foo=bar', 'baz', 'qux')).toBe('http://test.com?baz=qux&foo=bar');
  });

  it('should work with a url without query params', () => {
    expect(setQueryParam('http://test.com', 'baz', 'qux')).toBe('http://test.com?baz=qux');
  });
});

describe('fixBaseUrl', () => {
  it('should add a slash to a bare baseUrl', () => {
    expect(fixBaseUrl('http://test.com')).toBe('http://test.com/');
  });
  it('should not add a slash to a good baseUrl', () => {
    expect(fixBaseUrl('http://test.com/')).toBe('http://test.com/');
  });
  it('should add a slash to a bare baseUrl with params', () => {
    expect(fixBaseUrl('http://test.com?baz=qux')).toBe('http://test.com/?baz=qux');
  });
  it('should not add a slash to a good baseUrl with params', () => {
    expect(fixBaseUrl('http://test.com/?baz=qux')).toBe('http://test.com/?baz=qux');
  });
  it('should not add a slash to a baseUrl with a path', () => {
    expect(fixBaseUrl('http://test.com/foo')).toBe('http://test.com/foo');
  });
  it('should not add a slash to a baseUrl with a path and params', () => {
    expect(fixBaseUrl('http://test.com/foo?baz=qux')).toBe('http://test.com/foo?baz=qux');
  });
  it('should add a slash to a baseUrl with a hyphen', () => {
    expect(fixBaseUrl('https://id-test.tippiq.rocks')).toBe('https://id-test.tippiq.rocks/');
  });
});
