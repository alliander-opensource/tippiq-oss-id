import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { RequestResetPasswordForm } from '../../components';

test('Basic render snapshot test', () => {
  const component = shallow(<RequestResetPasswordForm
    fields={{ password: 'password' }}
    handleSubmit={() => {}}
    errorMessage={'errormessage'}
  />);

  const tree = shallowToJson(component);
  expect(tree).toMatchSnapshot();
});

