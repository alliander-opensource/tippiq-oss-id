import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Start } from './Start';

test('Basic render snapshot test', () => {
  const component = shallow(<Start
    error={'error'}
    getProfile={() => {}}
    simpleRegister={() => {}}
    checkEmailExists={() => {}}
    logout={() => {}}
    location={{ query: '' }}
    profile={{
      status: '',
      email: '',
    }}
    simpleRegistration={{
      status: {
        success: '',
      },
      error: {
        message: '',
      },
    }}
    emailExists={{
      status: {
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
