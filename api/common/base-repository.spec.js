/* eslint-disable require-jsdoc, max-nested-callbacks */
import secureRandomString from 'secure-random-string';
import BPromise from 'bluebird';

import BaseRepository from './base-repository';
import BaseModel from './base-model';
import { knex } from './bookshelf';
import { expect } from './test-utils';

const tableName = `base_repository_test_${secureRandomString()}`;
const TestModel = BaseModel.extend({ tableName }, {});

class TestRepository extends BaseRepository {
  constructor() {
    super(TestModel);
  }

  findByName(name) {
    return this.findOne({ name });
  }
}

const testRepository = new TestRepository();

describe('BaseRepository', () => {
  before('create test table', () =>
    knex.schema.createTable(tableName, (t) => {
      t.increments('id');
      t.string('name').notNull().unique();
    })
  );

  after('destroy test table', () => knex.schema.dropTable(tableName));

  describe('binding in fat arrow promise chain', () => {
    it('should just work', () =>
      expect(BPromise.resolve({ name: 'bind' }).then(testRepository.create)).to.be.fulfilled
    );
  });

  describe('create and deleteById', () => {
    const name = `create-${secureRandomString()}`;
    let testModel;
    it('should create a new Model', () =>
      expect(testRepository.create({ name })
        .tap((model) => {
          testModel = model;
        }))
        .to.eventually.have.property('id')
    );
    it('should delete the Model with the given id', () =>
      expect(testRepository.deleteById(testModel.id)).to.be.fullfilled
    );
  });

  describe('findOne', () => {
    const name = `findOne-${secureRandomString()}`;
    let testModel;
    before(name, () =>
      testRepository
        .create({ name })
        .tap((model) => {
          testModel = model;
        })
    );
    after(name, () => testRepository.deleteById(testModel.id));

    it('should find an existing Model by name', () =>
      expect(testRepository.findOne({ name }))
        .to.eventually.have.property('id', testModel.id)
    );
    it('should reject when a non-existing name is used', () =>
      expect(testRepository.findOne({ name: 'non-existing-name' }))
        .to.be.rejected);
  });

  describe('findById', () => {
    const name = `findById-${secureRandomString()}`;
    let testId;
    before(name, () =>
      testRepository
        .create({ name })
        .tap((model) => {
          testId = model.id;
        })
    );
    after(name, () => testRepository.deleteById(testId));

    it('should find an existing Model by id', () =>
      expect(testRepository.findById(testId))
        .to.not.be.rejected
    );
    it('should reject when a non-existing id is used', () =>
      expect(testRepository.findById(0))
        .to.be.rejected);
  });

  describe('findByName subclass method', () => {
    const name = `findByName-${secureRandomString()}`;
    let testModel;
    before(name, () =>
      testRepository
        .create({ name })
        .tap((model) => {
          testModel = model;
        })
    );
    after(name, () => testRepository.deleteById(testModel.id));

    it('should find an existing Model by name', () =>
      expect(testRepository.findByName(name))
        .to.eventually.have.property('id', testModel.id)
    );
    it('should reject when a non-existing name is used', () =>
      expect(testRepository.findOne('non-existing-name'))
        .to.be.rejected);
  });

  describe('findAll', () => {
    const name1 = `findAll-1-${secureRandomString()}`;
    const name2 = `findAll-2-${secureRandomString()}`;
    const testModels = [];
    before('setUp', () =>
      BPromise
        .all([name1, name2])
        .each(name =>
          testRepository
            .create({ name })
            .tap((model) => {
              testModels.push(model);
            })
        )
    );
    after('tearDown', () =>
      BPromise
        .all(testModels)
        .each(testModel => testRepository.deleteById(testModel.id))
    );

    it('should have a result set with all models when no where clause is specified', () =>
      testRepository
        .findAll()
        .then(
          resultCollection =>
            testModels
              .map(
                model =>
                  expect(resultCollection.get(model.id)).to.satisfy(
                    resultModel => resultModel.get('name') === model.get('name'))
              )
        )
    );

    it('should have an empty result set when a non-existing name is used', () =>
      expect(testRepository.findAll({ name: 'non-existing-name' }))
        .to.eventually.satisfy(resultCollection => resultCollection.isEmpty())
    );
  });
});
