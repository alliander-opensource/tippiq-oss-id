import { insertTestData, removeTestData } from './common/seed-utils';

before(() => insertTestData());
after(() => removeTestData());
