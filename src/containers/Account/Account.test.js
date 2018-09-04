import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Account } from './Account';

test('Basic render snapshot test', () => {
  const component = shallow(<Account><div>content</div></Account>);

  const tree = shallowToJson(component);
  expect(tree).toMatchSnapshot();
});

