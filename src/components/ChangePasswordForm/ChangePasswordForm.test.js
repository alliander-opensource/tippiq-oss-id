import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { ChangePasswordForm } from './ChangePasswordForm';

test('Basic render snapshot test', () => {
  const component = shallow(<ChangePasswordForm
    fields={{ password: 'password' }}
    handleSubmit={() => {}}
    errorMessage={'errormessage'}
  />);

  const tree = shallowToJson(component);
  expect(tree).toMatchSnapshot();
});

