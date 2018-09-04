import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { ResetPassword } from './ResetPassword';

test('Basic render snapshot test', () => {
  const component = shallow(<ResetPassword
    error={'error'}
    changePassword={() => {}}
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

