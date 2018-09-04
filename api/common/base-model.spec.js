import { expect } from './test-utils';

const BaseModel = require('./base-model');

describe('the base model', () => {
  let model;
  let dbObject;
  let jsObject;

  before(() => {
    model = new BaseModel();

    dbObject = {
      foo: 'bar',
      column_name: 'bar',
    };

    jsObject = {
      foo: 'bar',
      columnName: 'bar',
    };
  });

  describe('parsing a model from the db to a model', () => {
    it('should convert all properties to camelcase', () => {
      expect(model.parse(dbObject)).to.deep.equal(jsObject);
    });
  });

  describe('parsing a model from to a db model', () => {
    it('should convert all properties to snake case', () => {
      expect(model.format(jsObject)).to.deep.equal(dbObject);
    });
  });
});
