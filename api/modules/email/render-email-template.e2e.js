/**
 * Unit test for email
 * @module email/render-email-template.spec
 */
import { expect } from '../../common/test-utils';
import renderEmailTemplate, { RenderError } from './render-email-template';

describe('Email Template Service', () => {
  const testData = {};
  it('should render an existing template', () => {
    const result = renderEmailTemplate('test-template', testData);
    return Promise.all([
      expect(result).to.eventually.have.deep.property('html'),
      expect(result).to.eventually.have.deep.property('text'),
    ]);
  });

  it('should throw an error when trying to render a non-existing template', () =>
    expect(renderEmailTemplate('non-existing-template', testData)).to.be.rejectedWith(RenderError)
  );
});
