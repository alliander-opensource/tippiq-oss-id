import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { SetPassword } from './SetPassword';

test('Basic render snapshot test', () => {
  const component = shallow(<SetPassword
    error={'error'}
    setPassword={() => {}}
    location={{ query: '' }}
    password={{
      save: {
        success: '',
      },
      error: {
        message: '',
      },
    }}
  />);

  const tree = shallowToJson(component);
  expect(tree).toMatchSnapshot();
});

